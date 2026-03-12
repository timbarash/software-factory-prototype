import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Bug, Lightbulb, Zap, ChevronRight, Circle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { Ticket, tickets, stages, getStageIndex, getConfidenceColor, getSeverityColor, expertAgents, terminalSessions } from '../data'

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
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getSeverityColor(t.severity) }} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-text-tertiary">{t.id}</div>
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

function TerminalWindow({ ticket }: { ticket: Ticket }) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lines = terminalSessions[ticket.id] || [
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

  useEffect(() => {
    setVisibleLines(0)
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= lines.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 60)
    return () => clearInterval(timer)
  }, [ticket.id, lines.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleLines])

  return (
    <div className="flex flex-col h-full bg-terminal-bg rounded-lg border border-border overflow-hidden">
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
          <span className="px-1.5 py-0.5 rounded bg-surface-3 border border-border">bash</span>
          <span className="px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20">
            ● connected
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="min-h-[1.2em]">
            {line.startsWith('$') ? (
              <span>
                <span className="text-terminal-green">❯</span>{' '}
                <span className="text-text-primary">{line.slice(2)}</span>
              </span>
            ) : line.startsWith('◆') ? (
              <span className="text-accent-purple font-semibold">{line}</span>
            ) : line.startsWith('  ✓') ? (
              <span className="text-accent-green">{line}</span>
            ) : line.startsWith('  ✗') ? (
              <span className="text-accent-red">{line}</span>
            ) : line.startsWith('  ⚠') ? (
              <span className="text-accent-amber font-semibold">{line}</span>
            ) : line.startsWith('  ⏳') ? (
              <span className="text-text-tertiary">{line}</span>
            ) : line.includes('━━━') ? (
              <span className="text-text-tertiary">{line}</span>
            ) : line.startsWith('  ┌') || line.startsWith('  │') || line.startsWith('  └') ? (
              <span className="text-accent-blue">{line}</span>
            ) : line.startsWith('    →') ? (
              <span className="text-accent-cyan">{line}</span>
            ) : (
              <span className="text-text-secondary">{line}</span>
            )}
          </div>
        ))}
        {visibleLines >= lines.length && (
          <div className="mt-1">
            <span className="text-terminal-green">❯</span>{' '}
            <span className="terminal-cursor" />
          </div>
        )}
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

  const [expandedAgent, setExpandedAgent] = useState<string | null>(agents[0]?.id || null)

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] text-text-tertiary uppercase tracking-wider px-1">Expert Agents</div>
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
            <ChevronRight
              size={12}
              className={`text-text-tertiary transition-transform duration-150 ${
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
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src={`${import.meta.env.BASE_URL}peon.jpeg`}
              alt="peon"
              className="w-10 h-10 rounded object-cover"
              style={{
                opacity: i < ticket.complexityScore ? 1 : 0.15,
                filter: i < ticket.complexityScore ? 'none' : 'grayscale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Agent Readiness Breakdown */}
      <div className="border-t border-border pt-3 mt-1">
        <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Agent Readiness</div>
        {ticket.agents.map((agent, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-[11px] text-text-secondary">{agent.agent}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${agent.readiness}%`,
                    backgroundColor: getConfidenceColor(agent.readiness),
                  }}
                />
              </div>
              <span className="text-[10px] font-mono w-7 text-right" style={{ color: getConfidenceColor(agent.readiness) }}>
                {agent.readiness}
              </span>
            </div>
          </div>
        ))}
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
          <TerminalWindow ticket={ticket} />
        </div>

        {/* Right Panel */}
        <div className="w-72 border-l border-border bg-surface-1 flex flex-col overflow-y-auto shrink-0 p-3 gap-4">
          <AgentPanel ticket={ticket} />
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
