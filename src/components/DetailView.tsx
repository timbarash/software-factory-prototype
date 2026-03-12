import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Bug, Lightbulb, Zap, ChevronRight, Circle, CheckCircle2, Clock, AlertTriangle, Shield, Send, Eye, EyeOff, Terminal } from 'lucide-react'
import { Ticket, tickets, stages, getStageIndex, getConfidenceColor, getSeverityColor, expertAgents, terminalSessions } from '../data'
import { useClaudeTerminal } from '../useClaudeTerminal'

interface DetailViewProps {
  ticket: Ticket;
  onBack: () => void;
  onSelectTicket: (id: string) => void;
  onShowMarketing: () => void;
}

function MiniHotlist({ currentId, onSelect }: { currentId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 px-1">Hotlist</div>
      {tickets.slice(0, 5).map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all duration-150 border-none cursor-pointer ${
            t.id === currentId
              ? 'bg-surface-3 border-l-2 border-l-accent-green'
              : 'bg-transparent hover:bg-surface-2'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: getSeverityColor(t.severity) }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-text-tertiary">{t.id}</span>
              {t.stage === 'bilda' && (
                <span className="text-[8px] px-1 py-0 rounded bg-accent-green/10 text-accent-green border border-accent-green/20 flex items-center gap-0.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-accent-green" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                  building
                </span>
              )}
            </div>
            <div className="text-[11px] text-text-secondary truncate">{t.title}</div>
          </div>
          <span className="text-[10px] font-mono" style={{ color: getConfidenceColor(t.confidenceScore) }}>
            {t.confidenceScore}%
          </span>
        </button>
      ))}
    </div>
  )
}

function StageTracker({ currentStage }: { currentStage: string }) {
  const currentIdx = getStageIndex(currentStage as any)
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1 px-1">SDLC Stage</div>
      {stages.map((stage, i) => {
        const isComplete = i < currentIdx
        const isCurrent = i === currentIdx
        const isFuture = i > currentIdx
        return (
          <div
            key={stage.key}
            className={`flex items-center gap-2 px-2 py-2 rounded transition-all duration-150 ${
              isCurrent ? 'bg-surface-3' : ''
            }`}
          >
            <div className="flex flex-col items-center">
              {isComplete ? (
                <CheckCircle2 size={14} className="text-accent-green" />
              ) : isCurrent ? (
                <div className="relative">
                  <Circle size={14} className="text-accent-green" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  </div>
                </div>
              ) : (
                <Circle size={14} className="text-surface-4" />
              )}
              {i < stages.length - 1 && (
                <div className={`w-px h-3 mt-0.5 ${isComplete ? 'bg-accent-green' : 'bg-surface-4'}`} />
              )}
            </div>
            <div className="flex-1">
              <div className={`text-[12px] font-medium ${
                isCurrent ? 'text-accent-green' : isComplete ? 'text-text-secondary' : 'text-text-tertiary'
              }`}>
                {stage.label}
              </div>
              <div className="text-[10px] text-text-tertiary">{stage.agent}</div>
            </div>
            {isCurrent && (
              <div className="text-[9px] text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded">
                Active
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function TerminalWindow({ ticket, bildaMode }: { ticket: Ticket; bildaMode?: 'watching' | 'background' }) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevTicketRef = useRef(ticket.id)
  const isBilda = ticket.stage === 'bilda'
  const typeSpeed = isBilda && bildaMode === 'watching' ? 140 : 60

  const { lines: liveLines, isStreaming, sendMessage, resetForTicket } = useClaudeTerminal(ticket)

  const staticLines = terminalSessions[ticket.id] || [
    `$ claude --ticket ${ticket.id} --stage ${ticket.stage}`,
    '',
    `◆ ${stages[getStageIndex(ticket.stage)].label} Agent — Processing...`,
    '',
    `  Ticket: ${ticket.id} — ${ticket.title}`,
    `  Type: ${ticket.type === 'BUG' ? 'Bug' : 'Product Feedback'} | Severity: ${ticket.severity}`,
    '',
    '  Loading context and preparing analysis...',
    '',
    '  ⏳ Gathering codebase context...',
    '  ⏳ Analyzing related tickets...',
    '  ⏳ Checking test coverage...',
  ]

  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (prevTicketRef.current !== ticket.id) {
      prevTicketRef.current = ticket.id
      setVisibleLines(0)
      setIsLive(false)
      resetForTicket(ticket)
    }
  }, [ticket.id, ticket, resetForTicket])

  useEffect(() => {
    if (isLive) return
    setVisibleLines(0)
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= staticLines.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, typeSpeed)
    return () => clearInterval(timer)
  }, [ticket.id, staticLines.length, typeSpeed, isLive])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleLines, liveLines.length])

  const handleSubmit = useCallback(async () => {
    const val = inputValue.trim()
    if (!val || isStreaming) return
    setInputValue('')
    setIsLive(true)
    await sendMessage(val)
  }, [inputValue, isStreaming, sendMessage])

  const displayLines = isLive ? liveLines : staticLines.slice(0, visibleLines)
  const showCursor = isLive ? !isStreaming : visibleLines >= staticLines.length

  const renderLine = (line: string) => {
    if (line.startsWith('⟡ thinking')) {
      return <span className="text-text-tertiary italic text-[11px]">⟡ {line.slice(2)}</span>
    }
    if (line.startsWith('  ⚙ tool:') || line.startsWith('  ⚙ Read') || line.startsWith('  ⚙ Grep') || line.startsWith('  ⚙ Edit') || line.startsWith('  ⚙ Bash')) {
      return (
        <span className="text-accent-purple">
          <span className="text-[10px] bg-accent-purple/10 px-1 py-0.5 rounded border border-accent-purple/20">{line.trim()}</span>
        </span>
      )
    }
    if (line.startsWith('  ↳ ')) {
      return <span className="text-text-tertiary text-[11px] pl-4">{line}</span>
    }
    if (line.startsWith('$') || line.startsWith('❯')) {
      return (
        <span>
          <span className="text-terminal-green">❯</span>{' '}
          <span className="text-text-primary">{line.replace(/^[$❯]\s*/, '')}</span>
        </span>
      )
    }
    if (line.startsWith('◆')) return <span className="text-accent-purple font-semibold">{line}</span>
    if (line.startsWith('  ✓')) return <span className="text-accent-green">{line}</span>
    if (line.startsWith('  ✗')) return <span className="text-accent-red">{line}</span>
    if (line.startsWith('  ⚠')) return <span className="text-accent-amber font-semibold">{line}</span>
    if (line.startsWith('  ⏳')) return <span className="text-text-tertiary">{line}</span>
    if (line.includes('━━━')) return <span className="text-text-tertiary">{line}</span>
    if (line.startsWith('  ┌') || line.startsWith('  │') || line.startsWith('  └')) return <span className="text-accent-blue">{line}</span>
    if (line.startsWith('    →')) return <span className="text-accent-cyan">{line}</span>
    if (line.includes('👻') || line.includes('VIOLATION') || line.includes('JURISDICTION')) {
      return <span className="text-pink-400 font-medium">{line}</span>
    }
    return <span className="text-text-secondary">{line}</span>
  }

  return (
    <div className="flex flex-col h-full bg-terminal-bg rounded-lg border border-border overflow-hidden" onClick={() => inputRef.current?.focus()}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-red/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-amber/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-green/70" />
          </div>
          <span className="text-[11px] text-text-tertiary font-mono ml-2">
            claude — {ticket.id} — {stages[getStageIndex(ticket.stage)].label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
          <span className="px-1.5 py-0.5 rounded bg-accent-purple/10 text-accent-purple border border-accent-purple/20 font-medium">
            claude-opus-4-6
          </span>
          {isStreaming ? (
            <span className="px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" style={{ animation: 'pulse-dot 0.8s ease-in-out infinite' }} />
              streaming
            </span>
          ) : isLive ? (
            <span className="px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20">
              ● interactive
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20">
              ● connected
            </span>
          )}
          {isBilda && bildaMode === 'watching' ? (
            <span className="px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" style={{ animation: 'pulse-dot 1s ease-in-out infinite' }} />
              building live
            </span>
          ) : isBilda && bildaMode === 'background' ? (
            <span className="px-1.5 py-0.5 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              background
            </span>
          ) : null}
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed">
        {displayLines.map((line, i) => (
          <div key={`${isLive ? 'live' : 'static'}-${i}`} className="min-h-[1.2em]">
            {renderLine(line)}
          </div>
        ))}
        {isStreaming && (
          <div className="min-h-[1.2em]">
            <span className="terminal-cursor" />
          </div>
        )}
        {showCursor && !isStreaming && (
          <div className="mt-1">
            <span className="text-terminal-green">❯</span>{' '}
            <span className="terminal-cursor" />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-border bg-surface-2/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green text-[12px] font-mono">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
            placeholder="Ask Claude about this ticket..."
            className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono text-text-primary placeholder:text-text-tertiary"
            disabled={isStreaming}
          />
          <button
            onClick={handleSubmit}
            disabled={isStreaming || !inputValue.trim()}
            className="text-text-tertiary hover:text-accent-green transition-colors bg-transparent border-none cursor-pointer p-0.5 disabled:opacity-30"
          >
            <Send size={12} />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-1 text-[9px] text-text-tertiary">
          <span>Enter to send</span>
          <span>Try: "status" · "run tests" · "compliance" · "fix it"</span>
          {isLive && <span className="text-accent-green">● interactive</span>}
        </div>
      </div>
    </div>
  )
}

function CompliancePanel({ ticket }: { ticket: Ticket }) {
  if (!ticket.complianceFlags || ticket.complianceFlags.length === 0) return null

  const riskColors = {
    clear: { bg: 'bg-accent-green/10', border: 'border-accent-green/20', text: 'text-accent-green', label: 'CLEAR' },
    warning: { bg: 'bg-accent-amber/10', border: 'border-accent-amber/20', text: 'text-accent-amber', label: 'WARNING' },
    violation: { bg: 'bg-accent-red/10', border: 'border-accent-red/20', text: 'text-accent-red', label: 'VIOLATION' },
  }

  const hasViolation = ticket.complianceFlags.some(f => f.risk === 'violation')

  return (
    <div className={`rounded-lg border p-3 ${hasViolation ? 'bg-accent-red/5 border-accent-red/30' : 'bg-surface-1 border-border'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[14px]">👻</span>
        <div className="text-[10px] text-text-tertiary uppercase tracking-wider">Compliance Ghost</div>
        {hasViolation && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-red/10 text-accent-red border border-accent-red/20 font-medium" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}>
            ACTIVE RISK
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {ticket.complianceFlags.map((flag, i) => {
          const risk = riskColors[flag.risk]
          return (
            <div key={i} className={`rounded p-2 ${risk.bg} border ${risk.border}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold ${risk.text}`}>{risk.label}</span>
                <span className="text-[10px] text-text-tertiary">{flag.jurisdiction}</span>
              </div>
              <div className="text-[10px] text-text-tertiary mb-1">{flag.system}</div>
              <div className={`text-[11px] ${risk.text} leading-relaxed`}>{flag.detail}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AgentPanel({ ticket }: { ticket: Ticket }) {
  const agents = expertAgents[ticket.id] || [
    {
      id: 'design-lead', name: 'Design Lead', role: 'VP Design', icon: '◆', color: '#a855f7',
      thoughts: ['Analyzing UI implications...', 'Reviewing component patterns...'],
    },
    {
      id: 'qa-agent', name: 'QA Engineer', role: 'Quality', icon: '◇', color: '#06b6d4',
      thoughts: ['Preparing test scenarios...', 'Identifying edge cases...'],
    },
    {
      id: 'swe-agent', name: 'SWE', role: 'Engineer', icon: '⬡', color: '#3b82f6',
      thoughts: ['Reviewing implementation approach...', 'Checking codebase patterns...'],
    },
    {
      id: 'cannabiz-sme', name: 'Cannabiz SME', role: 'Industry Expert', icon: '◈', color: '#f59e0b',
      thoughts: ['Assessing impact on dispensary operations...', 'Checking compliance implications...'],
    },
  ]

  // Default to Cannabiz SME — the most contextually rich agent for this domain
  const cannabizIdx = agents.findIndex(a => a.id === 'cannabiz-sme')
  const defaultAgent = cannabizIdx >= 0 ? agents[cannabizIdx].id : agents[0]?.id || null
  const [expandedAgent, setExpandedAgent] = useState<string | null>(defaultAgent)
  const [streamMode, setStreamMode] = useState(false)

  // Thought stream: shows all agents' thoughts interleaved chronologically
  const allThoughts = agents.flatMap(a =>
    a.thoughts.map((t, i) => ({ agentId: a.id, agent: a.name, icon: a.icon, color: a.color, text: t, order: i }))
  ).sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div className="text-[10px] text-text-tertiary uppercase tracking-wider">Expert Agents</div>
        <button
          onClick={() => setStreamMode(!streamMode)}
          className="text-[9px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer bg-transparent"
          style={{
            borderColor: streamMode ? '#22c55e40' : '#27272a',
            color: streamMode ? '#22c55e' : '#71717a',
          }}
        >
          {streamMode ? '◉ Stream' : '☰ Panel'}
        </button>
      </div>

      {streamMode ? (
        /* Thought Stream Mode — inspired by review doc's Agent Thought Stream concept */
        <div className="rounded-lg border border-border bg-surface-2 p-2 overflow-y-auto max-h-[40vh]">
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
            <div className="flex flex-col gap-2">
              {allThoughts.map((t, i) => (
                <div key={i} className="flex gap-2 relative animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] z-10 border"
                    style={{ backgroundColor: `${t.color}15`, borderColor: `${t.color}40`, color: t.color }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex-1 rounded bg-surface-1 border border-border p-2" style={{ borderLeftColor: t.color, borderLeftWidth: 2 }}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-semibold" style={{ color: t.color }}>{t.agent}</span>
                      <span className="text-[8px] text-text-tertiary font-mono">{t.order * 3}s ago</span>
                    </div>
                    <div className="text-[11px] text-text-secondary leading-relaxed">{t.text}</div>
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              <div className="flex gap-2 relative">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] z-10 border opacity-50" style={{ backgroundColor: '#06b6d415', borderColor: '#06b6d440', color: '#06b6d4' }}>◇</div>
                <div className="flex-1 rounded bg-surface-1 border border-border p-2 opacity-40">
                  <span className="text-[10px] font-semibold text-[#06b6d4]">QA</span>
                  <div className="flex gap-1 mt-1">
                    <div className="w-1 h-1 rounded-full bg-text-tertiary animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-text-tertiary animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 rounded-full bg-text-tertiary animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Panel Mode — individual agent cards */
        <>
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`rounded-lg border transition-all duration-150 cursor-pointer ${
                expandedAgent === agent.id
                  ? 'bg-surface-2 border-border-bright'
                  : 'bg-surface-1 border-border hover:border-border-bright'
              }`}
              onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <span style={{ color: agent.color }} className="text-[14px]">{agent.icon}</span>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-text-primary">{agent.name}</div>
                  <div className="text-[10px] text-text-tertiary">{agent.role}</div>
                </div>
                {expandedAgent !== agent.id && (
                  <span className="text-[9px] text-text-tertiary truncate max-w-[80px]">{agent.thoughts[0]?.slice(0, 30)}...</span>
                )}
                <ChevronRight
                  size={12}
                  className={`text-text-tertiary transition-transform duration-150 shrink-0 ${
                    expandedAgent === agent.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
              {expandedAgent === agent.id && (
                <div className="px-3 pb-3 border-t border-border mt-0">
                  <div className="flex flex-col gap-1.5 mt-2">
                    {agent.thoughts.map((thought, i) => (
                      <div
                        key={i}
                        className="text-[11px] text-text-secondary leading-relaxed pl-2 border-l-2 animate-fade-in-up"
                        style={{
                          borderColor: `${agent.color}40`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      >
                        {thought}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function ConfidencePanel({ ticket }: { ticket: Ticket }) {
  return (
    <div className="rounded-lg bg-surface-1 border border-border p-3">
      <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-3">Confidence & Complexity</div>

      {/* Confidence Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-text-secondary">Confidence</span>
          <span className="text-[13px] font-mono font-bold" style={{ color: getConfidenceColor(ticket.confidenceScore) }}>
            {ticket.confidenceScore}%
          </span>
        </div>
        <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${ticket.confidenceScore}%`,
              backgroundColor: getConfidenceColor(ticket.confidenceScore),
            }}
          />
        </div>
      </div>

      {/* Complexity Score - Peon Scale */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-text-secondary">Complexity</span>
          <span className="text-[13px] font-mono font-bold text-text-primary">
            {ticket.complexityScore}/5
          </span>
        </div>
        <div className="flex gap-1 items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src={`${import.meta.env.BASE_URL}peon.jpeg`}
              alt="peon"
              className="w-8 h-8 rounded object-cover"
              style={{
                opacity: i < ticket.complexityScore ? 1 : 0.15,
                filter: i < ticket.complexityScore ? 'none' : 'grayscale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Human Input Required */}
      <div className="border-t border-border pt-3 mt-3">
        <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Human Input Needed</div>
        <div className="flex items-center gap-2">
          {ticket.agents.filter(a => a.humanInput !== 'none').length === 0 ? (
            <span className="text-[11px] text-accent-green flex items-center gap-1">
              <CheckCircle2 size={12} /> Fully autonomous
            </span>
          ) : (
            <>
              {ticket.agents.filter(a => a.humanInput === 'high').length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-red/10 text-accent-red border border-accent-red/20">
                  {ticket.agents.filter(a => a.humanInput === 'high').length} high
                </span>
              )}
              {ticket.agents.filter(a => a.humanInput === 'medium').length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
                  {ticket.agents.filter(a => a.humanInput === 'medium').length} medium
                </span>
              )}
              {ticket.agents.filter(a => a.humanInput === 'low').length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20">
                  {ticket.agents.filter(a => a.humanInput === 'low').length} low
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function DetailView({ ticket, onBack, onSelectTicket, onShowMarketing }: DetailViewProps) {
  const [bildaMode, setBildaMode] = useState<'watching' | 'background'>('watching')
  const isBilda = ticket.stage === 'bilda'

  return (
    <div className="h-full flex flex-col bg-surface-0">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-1 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer p-1"
          >
            <ArrowLeft size={14} />
            <span>Hotlist</span>
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: ticket.type === 'BUG' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)' }}
            >
              {ticket.type === 'BUG' ? <Bug size={11} color="#ef4444" /> : <Lightbulb size={11} color="#3b82f6" />}
            </div>
            <span className="text-[11px] font-mono text-text-tertiary">{ticket.id}</span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{
                backgroundColor: `${getSeverityColor(ticket.severity)}15`,
                color: getSeverityColor(ticket.severity),
              }}
            >
              {ticket.severity}
            </span>
          </div>
          <span className="text-[13px] font-medium text-text-primary">{ticket.title}</span>
          {ticket.complianceFlags && ticket.complianceFlags.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${
              ticket.complianceFlags.some(f => f.risk === 'violation')
                ? 'bg-accent-red/10 text-accent-red border border-accent-red/20'
                : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20'
            }`}>
              <span>👻</span>
              {ticket.complianceFlags.some(f => f.risk === 'violation') ? 'Violation Risk' : 'Compliance Flag'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {ticket.errorRate && (
            <span className="flex items-center gap-1 text-[11px] text-accent-red">
              <AlertTriangle size={11} /> {ticket.errorRate}% errors
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <Zap size={12} style={{ color: getConfidenceColor(ticket.confidenceScore) }} />
            <span className="text-[12px] font-mono font-bold" style={{ color: getConfidenceColor(ticket.confidenceScore) }}>
              {ticket.confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Bilda Banner — shown when ticket is in implementation stage */}
      {isBilda && (
        <div className="px-4 py-2 border-b border-accent-green/20 bg-accent-green/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-accent-green" />
              <span className="text-[12px] font-medium text-accent-green">Bilda is writing code</span>
            </div>
            <span className="text-[11px] text-text-secondary">
              {bildaMode === 'watching'
                ? 'Watching live — you can steer with the input bar below'
                : 'Building in background — work on other tickets while Bilda codes'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBildaMode('watching')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors border cursor-pointer ${
                bildaMode === 'watching'
                  ? 'bg-accent-green/15 border-accent-green/30 text-accent-green'
                  : 'bg-transparent border-border text-text-tertiary hover:border-border-bright'
              }`}
            >
              <Eye size={12} />
              Watch & Steer
            </button>
            <button
              onClick={() => { setBildaMode('background'); onBack() }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors border cursor-pointer ${
                bildaMode === 'background'
                  ? 'bg-accent-amber/15 border-accent-amber/30 text-accent-amber'
                  : 'bg-transparent border-border text-text-tertiary hover:border-border-bright'
              }`}
            >
              <EyeOff size={12} />
              Build in Background
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-56 border-r border-border bg-surface-1 flex flex-col overflow-y-auto shrink-0 p-3 gap-4">
          <MiniHotlist currentId={ticket.id} onSelect={onSelectTicket} />
          <div className="border-t border-border pt-3">
            <StageTracker currentStage={ticket.stage} />
          </div>
        </div>

        {/* Center — Terminal */}
        <div className="flex-1 p-3 flex flex-col min-w-0">
          <TerminalWindow ticket={ticket} bildaMode={isBilda ? bildaMode : undefined} />
        </div>

        {/* Right Panel */}
        <div className="w-72 border-l border-border bg-surface-1 flex flex-col overflow-y-auto shrink-0 p-3 gap-4">
          <AgentPanel ticket={ticket} />
          <CompliancePanel ticket={ticket} />
          <ConfidencePanel ticket={ticket} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-4 py-2 border-t border-border bg-surface-1 flex items-center justify-between text-[11px] text-text-tertiary shrink-0">
        <button
          onClick={onShowMarketing}
          className="hover:text-accent-green transition-colors cursor-pointer bg-transparent border-none text-[11px] text-text-tertiary p-0"
        >
          Why Rubicon? →
        </button>
        <div className="flex items-center gap-4">
          <span>Stage: {stages[getStageIndex(ticket.stage)].label}</span>
          <span>Assignee: {ticket.assignee}</span>
          <span className="flex items-center gap-1">
            <Clock size={10} /> {ticket.created}
          </span>
        </div>
      </div>
    </div>
  )
}
