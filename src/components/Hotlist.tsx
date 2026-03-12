import { useState, useEffect, useRef } from 'react'
import { Bug, Lightbulb, Search, Zap, ChevronRight, Users, TrendingUp, AlertTriangle, X } from 'lucide-react'
import { Ticket, getSeverityColor, getConfidenceColor, getHumanInputColor, stages, getStageIndex } from '../data'

interface HotlistProps {
  tickets: Ticket[];
  onSelectTicket: (id: string) => void;
  onShowMarketing: () => void;
  onShowReview: () => void;
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
              {ticket.complianceFlags && ticket.complianceFlags.length > 0 && (
                <span className={`text-[10px] px-1 py-0.5 rounded ${
                  ticket.complianceFlags.some(f => f.risk === 'violation')
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`} title="Compliance Ghost flagged">
                  👻
                </span>
              )}
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

function CommandPalette({ tickets, onSelect, onClose }: { tickets: Ticket[]; onSelect: (id: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const commands = [
    ...tickets.map(t => ({ type: 'ticket' as const, id: t.id, label: `${t.id}: ${t.title}`, meta: t.severity })),
    { type: 'action' as const, id: 'critical', label: 'Show critical tickets', meta: 'filter' },
    { type: 'action' as const, id: 'ready', label: 'Show merge-ready tickets', meta: 'filter' },
    { type: 'action' as const, id: 'compliance', label: 'Show compliance-flagged tickets', meta: 'ghost' },
  ]

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase()))
    : commands

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[520px] bg-surface-1 rounded-xl border border-border shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search size={14} className="text-text-tertiary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tickets, commands..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-text-primary placeholder:text-text-tertiary"
          />
          <kbd className="text-[10px] text-text-tertiary bg-surface-3 px-1.5 py-0.5 rounded border border-border">esc</kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto py-1">
          {filtered.slice(0, 8).map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => {
                if (cmd.type === 'ticket') { onSelect(cmd.id); onClose() }
                else onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2 transition-colors bg-transparent border-none cursor-pointer"
            >
              {cmd.type === 'ticket' ? (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getSeverityColor(cmd.meta as any) }} />
              ) : (
                <Zap size={12} className="text-accent-green" />
              )}
              <span className="text-[12px] text-text-primary flex-1">{cmd.label}</span>
              {cmd.type === 'ticket' && (
                <span className="text-[10px] text-text-tertiary">{cmd.meta}</span>
              )}
              {cmd.type === 'action' && (
                <span className="text-[10px] text-accent-green">{cmd.meta}</span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-[12px] text-text-tertiary">No results found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Hotlist({ tickets, onSelectTicket, onShowMarketing, onShowReview }: HotlistProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'ready' | 'compliance'>('all')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Cmd+K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowCommandPalette(true) }
      if (e.key === '/' && !showCommandPalette && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); searchInputRef.current?.focus() }
      if (e.key === 'Escape') { setShowCommandPalette(false); setSearchQuery(''); searchInputRef.current?.blur() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showCommandPalette])

  let filtered = [...tickets]
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(t =>
      t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.labels.some(l => l.toLowerCase().includes(q))
    )
  }
  if (filterMode === 'critical') filtered = filtered.filter(t => t.severity === 'critical')
  if (filterMode === 'ready') filtered = filtered.filter(t => t.confidenceScore >= 80)
  if (filterMode === 'compliance') filtered = filtered.filter(t => t.complianceFlags && t.complianceFlags.length > 0)

  const sorted = filtered.sort((a, b) => {
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    if (sevOrder[a.severity] !== sevOrder[b.severity]) return sevOrder[a.severity] - sevOrder[b.severity]
    return b.confidenceScore - a.confidenceScore
  })

  const criticalCount = tickets.filter(t => t.severity === 'critical').length
  const avgConfidence = Math.round(tickets.reduce((s, t) => s + t.confidenceScore, 0) / tickets.length)
  const complianceCount = tickets.filter(t => t.complianceFlags && t.complianceFlags.length > 0).length

  return (
    <div className="h-full flex flex-col">
      {showCommandPalette && (
        <CommandPalette tickets={tickets} onSelect={onSelectTicket} onClose={() => setShowCommandPalette(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent-green flex items-center justify-center">
              <Zap size={14} color="#000" />
            </div>
            <span className="text-[15px] font-semibold text-text-primary tracking-tight">Rubicon</span>
          </div>
          <span className="text-[11px] text-text-tertiary px-2 py-0.5 rounded bg-surface-3 border border-border">
            Next Logical Action
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-2 rounded-md px-3 py-1.5 border border-border focus-within:border-accent-green/50 transition-colors">
            <Search size={13} className="text-text-tertiary" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-[12px] text-text-primary placeholder:text-text-tertiary w-32"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="bg-transparent border-none cursor-pointer p-0 text-text-tertiary hover:text-text-primary">
                <X size={12} />
              </button>
            ) : (
              <kbd className="text-[10px] text-text-tertiary bg-surface-3 px-1 rounded border border-border">/</kbd>
            )}
          </div>
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-1.5 bg-surface-2 rounded-md px-2 py-1.5 border border-border text-[11px] text-text-tertiary hover:border-border-bright transition-colors cursor-pointer"
          >
            <Zap size={11} />
            <kbd className="text-[10px] bg-surface-3 px-1 rounded border border-border">⌘K</kbd>
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="px-6 py-4 border-b border-border bg-surface-1/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-text-primary">Product Feedback & Bugs</h1>
            <p className="text-[12px] text-text-secondary mt-0.5">
              {filtered.length === tickets.length
                ? <>{tickets.length} items in queue — {criticalCount} critical — avg confidence {avgConfidence}%</>
                : <>{filtered.length} of {tickets.length} shown{searchQuery && <> — matching "{searchQuery}"</>}</>
              }
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            {[
              { key: 'all' as const, label: 'All', count: tickets.length },
              { key: 'critical' as const, label: 'P0', count: criticalCount },
              { key: 'ready' as const, label: 'Ready', count: tickets.filter(t => t.confidenceScore >= 80).length },
              { key: 'compliance' as const, label: '👻', count: complianceCount },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterMode(filterMode === f.key ? 'all' : f.key)}
                className={`px-2 py-1 rounded border transition-colors cursor-pointer bg-transparent text-[11px] ${
                  filterMode === f.key
                    ? 'border-accent-green/50 text-accent-green bg-accent-green/5'
                    : 'border-border text-text-tertiary hover:border-border-bright'
                }`}
              >
                {f.label} <span className="font-mono">{f.count}</span>
              </button>
            ))}
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
          {sorted.length === 0 && (
            <div className="text-center py-12 text-text-tertiary text-[13px]">
              No tickets match your filters.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-2 border-t border-border bg-surface-1 flex items-center justify-between text-[11px] text-text-tertiary">
        <div className="flex items-center gap-4">
          <button
            onClick={onShowMarketing}
            className="hover:text-accent-green transition-colors cursor-pointer bg-transparent border-none text-[11px] text-text-tertiary p-0"
          >
            Why Rubicon? →
          </button>
          <button
            onClick={onShowReview}
            className="hover:text-accent-green transition-colors cursor-pointer bg-transparent border-none text-[11px] text-text-tertiary p-0"
          >
            Agent Gang Thoughts on Rubicon →
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span>Agents: 4 active</span>
          <span>Queue refresh: 30s</span>
          <kbd className="text-[10px] bg-surface-3 px-1 rounded border border-border">⌘K</kbd>
        </div>
      </div>
    </div>
  )
}
