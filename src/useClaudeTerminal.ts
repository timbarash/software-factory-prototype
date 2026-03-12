import { useState, useCallback, useRef } from 'react'
import { Ticket, stages, getStageIndex, expertAgents, terminalSessions } from './data'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function buildSystemPrompt(ticket: Ticket): string {
  const stage = stages[getStageIndex(ticket.stage)]
  const agents = expertAgents[ticket.id] || []
  const agentContext = agents.map(a =>
    `${a.name} (${a.role}): ${a.thoughts.slice(0, 2).join(' ')}`
  ).join('\n')

  const complianceContext = ticket.complianceFlags?.map(f =>
    `[${f.risk.toUpperCase()}] ${f.jurisdiction} (${f.system}): ${f.detail}`
  ).join('\n') || 'No compliance flags.'

  return `You are Claude, an AI coding agent working inside "Rubicon" — an AI-native SDLC tool for Dutchie, a cannabis technology company. You are the ${stage.label} agent (${stage.agent}) working on ticket ${ticket.id}.

## Your Role
You are the AI agent actively working on this ticket. Respond as if you are Claude Code — the AI coding assistant running in a terminal. You use tools like Read, Edit, Grep, Bash to investigate and modify code.

## Current Ticket
- ID: ${ticket.id}
- Title: ${ticket.title}
- Type: ${ticket.type === 'BUG' ? 'Bug' : 'Product Feedback'}
- Severity: ${ticket.severity}
- Stage: ${stage.label} (${stage.agent})
- Confidence: ${ticket.confidenceScore}%
- Complexity: ${ticket.complexityScore}/5
- Description: ${ticket.description}
- Affected Users: ${ticket.affectedUsers}
${ticket.errorRate ? `- Error Rate: ${ticket.errorRate}%` : ''}

## Expert Agent Insights
${agentContext}

## Compliance Status
${complianceContext}

## Response Format
You must format your responses like Claude Code terminal output. Use these exact formats:

- For thinking: Start lines with "⟡ thinking" followed by indented thought lines
- For tool use: Use "  ⚙ Read <filepath>" or "  ⚙ Edit <filepath>" or "  ⚙ Grep <pattern> <path>" or "  ⚙ Bash <command>"
- For tool results: Use "  ↳ " prefix for result lines
- For success: Use "  ✓ " prefix
- For failure: Use "  ✗ " prefix
- For warnings: Use "  ⚠ " prefix
- For compliance: Use "  👻 " prefix for compliance ghost notes
- For section headers: Use "◆ " prefix
- For boxes: Use "  ┌─", "  │", "  └─" for bordered sections
- For sub-items: Use "    → " prefix

Keep responses concise and technical. You are working on real Dutchie code — reference real file paths like:
- services/order-sync-worker/worker.go
- src/components/inventory/threshold-config.tsx
- services/payments/fraud_check.go
- src/lib/hooks/use-selection.ts
- services/api-gateway/middleware/rate_limiter.go
- src/components/dashboard/sales-chart.tsx
- services/reports/csv/handler.go

Stay in character as a terminal agent. Do not use markdown formatting like ** or headers. Do not wrap in code blocks. Just output terminal-style lines.

When the user asks a question or gives a direction, respond as if you're executing that action — show tool calls, results, thinking, etc. Make it feel like you're actually working on the code.`
}

export function useClaudeTerminal(ticket: Ticket) {
  const initialLines = terminalSessions[ticket.id] || [
    `$ claude --ticket ${ticket.id} --stage ${ticket.stage}`,
    '',
    `◆ ${stages[getStageIndex(ticket.stage)].label} Agent — Processing...`,
  ]

  const [lines, setLines] = useState<string[]>(initialLines)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesRef = useRef<Message[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const resetForTicket = useCallback((t: Ticket) => {
    const newLines = terminalSessions[t.id] || [
      `$ claude --ticket ${t.id} --stage ${t.stage}`,
      '',
      `◆ ${stages[getStageIndex(t.stage)].label} Agent — Processing...`,
    ]
    setLines(newLines)
    messagesRef.current = []
    if (abortRef.current) abortRef.current.abort()
    setIsStreaming(false)
  }, [])

  const sendMessage = useCallback(async (userInput: string) => {
    const apiKey = localStorage.getItem('rubicon-api-key')
    if (!apiKey) return false

    // Add user input as a terminal line
    setLines(prev => [...prev, '', `❯ ${userInput}`])

    // Add thinking indicator
    setLines(prev => [...prev, '', '⟡ thinking...'])

    messagesRef.current.push({ role: 'user', content: userInput })
    setIsStreaming(true)

    const systemPrompt = buildSystemPrompt(ticket)

    // Include terminal history as context for first message
    const contextMessage = messagesRef.current.length === 1
      ? `[Terminal session history for context — this is what has already been output in the terminal before the user typed their message]\n\n${lines.join('\n')}\n\n[End of terminal history]\n\nUser input: ${userInput}`
      : userInput

    const apiMessages = messagesRef.current.map((m, i) => ({
      role: m.role as 'user' | 'assistant',
      content: i === messagesRef.current.length - 1 && m.role === 'user' ? contextMessage : m.content,
    }))

    try {
      abortRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          messages: apiMessages,
          systemPrompt,
          ticketId: ticket.id,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        const err = await response.text()
        setLines(prev => {
          const newLines = [...prev]
          // Remove the "thinking..." line
          if (newLines[newLines.length - 1] === '⟡ thinking...') newLines.pop()
          if (newLines[newLines.length - 1] === '') newLines.pop()
          newLines.push('', `  ✗ API Error: ${err}`)
          return newLines
        })
        setIsStreaming(false)
        return false
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let fullResponse = ''
      let currentLineBuffer = ''
      let removedThinking = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const eventLines = chunk.split('\n')

        for (const eventLine of eventLines) {
          if (!eventLine.startsWith('data: ')) continue
          const data = eventLine.slice(6)

          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'text') {
              // Remove "thinking..." indicator on first real content
              if (!removedThinking) {
                removedThinking = true
                setLines(prev => {
                  const newLines = [...prev]
                  if (newLines[newLines.length - 1] === '⟡ thinking...') newLines.pop()
                  if (newLines[newLines.length - 1] === '') newLines.pop()
                  return newLines
                })
              }

              currentLineBuffer += parsed.text
              fullResponse += parsed.text

              // Process complete lines
              while (currentLineBuffer.includes('\n')) {
                const nlIdx = currentLineBuffer.indexOf('\n')
                const completeLine = currentLineBuffer.slice(0, nlIdx)
                currentLineBuffer = currentLineBuffer.slice(nlIdx + 1)

                setLines(prev => [...prev, completeLine])
              }
            }

            if (parsed.type === 'error') {
              setLines(prev => [...prev, '', `  ✗ Error: ${parsed.error}`])
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Flush remaining buffer
      if (currentLineBuffer.trim()) {
        setLines(prev => [...prev, currentLineBuffer])
      }

      messagesRef.current.push({ role: 'assistant', content: fullResponse })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return false
      setLines(prev => [...prev, '', `  ✗ Connection error: ${err instanceof Error ? err.message : 'Unknown'}`])
    } finally {
      setIsStreaming(false)
    }

    return true
  }, [ticket, lines])

  return { lines, isStreaming, sendMessage, resetForTicket }
}
