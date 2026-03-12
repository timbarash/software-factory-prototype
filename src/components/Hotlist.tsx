import { Bug, Lightbulb, Search, Zap, ChevronRight, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import { Ticket, getSeverityColor, getConfidenceColor, getHumanInputColor, stages, getStageIndex } from '../data'

interface HotlistProps {
  tickets: Ticket[];
  onSelectTicket: (id: string) => void;
  onShowMarketing: () => void;
}

function AgentDots({ agents }: { agents: Ticket['agents'] }) {
  return (
    <div className="flex gap-1.5 items-center">
      {agents.map((a, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getConfidenceColor(a.readiness) }}
            title={`${a.agent}: ${a.readiness}% ready`}
          />
          <span className="text-[10px] text-text-tertiary font-mono">{a.readiness}</span>
        </div>
      ))}
    </div>
  )
}

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const stageIdx = getStageIndex(ticket.stage)
  const currentStage = stages[stageIdx]

  return (
    <div
      onClick={onClick}
      className="group bg-surface-1 border border-border rounded-lg p-4 hover:border-border-bright hover:bg-surface-2 transition-all duration-150 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ backgroundColor: ticket.type === 'BUG' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)' }}
          >
            {ticket.type === 'BUG' ? (
              <Bug size={14} color={ticket.type === 'BUG' ? '#ef4444' : '#3b82f6'} />
            ) : (
              <Lightbulb size={14} color="#3b82f6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
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
            <h3 className="text-[13px] text-text-primary font-medium mt-0.5 group-hover:text-white transition-colors">
              {ticket.title}
            </h3>
          </div>
        </div>
        <ChevronRight size={16} className="text-text-tertiary group-hover:text-text-secondary transition-colors mt-1" />
      </div>

      <p className="text-[12px] text-text-secondary leading-relaxed mb-3 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex items-center gap-3 mb-3 text-[11px] text-text-tertiary">
        {ticket.affectedUsers && (
          <span className="flex items-center gap-1">
            <Users size={11} /> {ticket.affectedUsers.toLocaleString()} users
          </span>
        )}
        {ticket.errorRate && (
          <span className="flex items-center gap-1 text-accent-red">
            <AlertTriangle size={11} /> {ticket.errorRate}% error rate
          </span>
        )}
        {ticket.requestCount && (
          <span className="flex items-center gap-1">
            <TrendingUp size={11} /> {ticket.requestCount} requests
          </span>
        )}
        <span>{ticket.created}</span>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {ticket.labels.map(l => (
          <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-text-tertiary border border-border">
            {l}
          </span>
        ))}
      </div>

      <div className="border-t border-border pt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Stage:</span>
            <span className="text-[11px] font-medium text-accent-green">{currentStage.label}</span>
            <div className="flex gap-0.5 ml-1">
              {stages.map((s, i) => (
                <div
                  key={s.key}
                  className="w-4 h-1 rounded-full"
                  style={{
                    backgroundColor: i <= stageIdx ? '#22c55e' : '#27272a',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-text-tertiary">Agents:</span>
            <AgentDots agents={ticket.agents} />
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={11} style={{ color: getConfidenceColor(ticket.confidenceScore) }} />
            <span className="text-[11px] font-mono font-medium" style={{ color: getConfidenceColor(ticket.confidenceScore) }}>
              {ticket.confidenceScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hotlist({ tickets, onSelectTicket, onShowMarketing }: HotlistProps) {
  const sorted = [...tickets].sort((a, b) => {
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    if (sevOrder[a.severity] !== sevOrder[b.severity]) return sevOrder[a.severity] - sevOrder[b.severity]
    return b.confidenceScore - a.confidenceScore
  })

  const criticalCount = tickets.filter(t => t.severity === 'critical').length
  const avgConfidence = Math.round(tickets.reduce((s, t) => s + t.confidenceScore, 0) / tickets.length)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent-green flex items-center justify-center">
              <Zap size={14} color="#000" />
            </div>
            <span className="text-[15px] font-semibold text-text-primary tracking-tight">Software Factory</span>
          </div>
          <span className="text-[11px] text-text-tertiary px-2 py-0.5 rounded bg-surface-3 border border-border">
            Next Logical Action
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-2 rounded-md px-3 py-1.5 border border-border">
            <Search size={13} className="text-text-tertiary" />
            <span className="text-[12px] text-text-tertiary">Search...</span>
            <kbd className="text-[10px] text-text-tertiary bg-surface-3 px-1 rounded border border-border">/</kbd>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="px-6 py-4 border-b border-border bg-surface-1/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-text-primary">Product Feedback & Bugs</h1>
            <p className="text-[12px] text-text-secondary mt-0.5">
              {tickets.length} items in queue — {criticalCount} critical — avg confidence {avgConfidence}%
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-red" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span className="text-text-secondary">{criticalCount} P0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-text-secondary">{tickets.filter(t => t.confidenceScore >= 80).length} ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-amber" />
              <span className="text-text-secondary">{tickets.filter(t => t.agents.some(a => a.humanInput === 'high')).length} need input</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {sorted.map((ticket, i) => (
            <div key={ticket.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <TicketCard ticket={ticket} onClick={() => onSelectTicket(ticket.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-2 border-t border-border bg-surface-1 flex items-center justify-between text-[11px] text-text-tertiary">
        <button
          onClick={onShowMarketing}
          className="hover:text-accent-green transition-colors cursor-pointer bg-transparent border-none text-[11px] text-text-tertiary p-0"
        >
          Why Software Factory? →
        </button>
        <div className="flex items-center gap-4">
          <span>Agents: 4 active</span>
          <span>Queue refresh: 30s</span>
          <kbd className="text-[10px] bg-surface-3 px-1 rounded border border-border">⌘K</kbd>
        </div>
      </div>
    </div>
  )
}
