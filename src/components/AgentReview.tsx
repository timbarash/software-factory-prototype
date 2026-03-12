import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronRight, Zap, Lightbulb, Compass } from 'lucide-react'
import reviewData from '../agent-review.json'

interface AgentReviewProps {
  onBack: () => void;
}

type Tab = 'agents' | 'features' | 'departures'

function ScoreRing({ score, color, size = 48 }: { score: number; color: string; size?: number }) {
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272a" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color }}>{score}</span>
    </div>
  )
}

function ImpactBadge({ level }: { level: string }) {
  const colors: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium" style={{ backgroundColor: `${colors[level] || '#71717a'}15`, color: colors[level] || '#71717a' }}>
      {level}
    </span>
  )
}

export function AgentReview({ onBack }: AgentReviewProps) {
  const [tab, setTab] = useState<Tab>('agents')
  const [expandedAgent, setExpandedAgent] = useState<string | null>(reviewData.agents[0]?.name || null)
  const [expandedDeparture, setExpandedDeparture] = useState<number>(0)

  return (
    <div className="min-h-screen bg-surface-0 text-text-primary">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface-0/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">
              <ArrowLeft size={14} /> Back
            </button>
            <span className="text-border">|</span>
            <span className="text-[14px] font-semibold">Agent Gang Thoughts on Rubicon</span>
          </div>
          <span className="text-[11px] text-text-tertiary font-mono">{reviewData.reviewDate}</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-surface-1 rounded-lg p-1 w-fit">
          {([
            { key: 'agents' as Tab, label: 'Agent Reviews', icon: Zap },
            { key: 'features' as Tab, label: `Feature Ideas (${reviewData.featureIdeas.length})`, icon: Lightbulb },
            { key: 'departures' as Tab, label: 'Design Departures (4)', icon: Compass },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer border-none ${
                tab === t.key ? 'bg-surface-3 text-text-primary' : 'bg-transparent text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* AGENTS TAB */}
        {tab === 'agents' && (
          <div className="space-y-3">
            {/* Score overview */}
            <div className="flex gap-4 mb-6 p-4 rounded-lg bg-surface-1 border border-border">
              {reviewData.agents.map(a => (
                <div key={a.name} className="flex items-center gap-2">
                  <ScoreRing score={a.score} color={a.color} size={36} />
                  <div>
                    <span className="text-[11px] font-medium" style={{ color: a.color }}>{a.icon} {a.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Agent cards */}
            {reviewData.agents.map(agent => {
              const isExpanded = expandedAgent === agent.name
              return (
                <div key={agent.name} className={`rounded-lg border transition-all ${isExpanded ? 'bg-surface-1 border-border-bright' : 'bg-surface-1 border-border'}`}>
                  <button
                    onClick={() => setExpandedAgent(isExpanded ? null : agent.name)}
                    className="w-full flex items-center justify-between p-4 cursor-pointer bg-transparent border-none text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[18px]" style={{ color: agent.color }}>{agent.icon}</span>
                      <div>
                        <div className="text-[13px] font-semibold text-text-primary">{agent.name}</div>
                        <div className="text-[11px] text-text-secondary mt-0.5 max-w-2xl">{agent.verdict}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ScoreRing score={agent.score} color={agent.color} />
                      {isExpanded ? <ChevronDown size={14} className="text-text-tertiary" /> : <ChevronRight size={14} className="text-text-tertiary" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 animate-fade-in-up">
                      {/* Strengths */}
                      <div>
                        <div className="text-[10px] text-accent-green uppercase tracking-wider mb-2 font-medium">Strengths</div>
                        <div className="space-y-1.5">
                          {agent.strengths.map((s, i) => (
                            <div key={i} className="flex gap-2 text-[12px] text-text-secondary">
                              <span className="text-accent-green mt-0.5 shrink-0">+</span>
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Concerns */}
                      <div>
                        <div className="text-[10px] text-accent-red uppercase tracking-wider mb-2 font-medium">Concerns</div>
                        <div className="space-y-1.5">
                          {agent.concerns.map((c, i) => (
                            <div key={i} className="flex gap-2 text-[12px] text-text-secondary">
                              <span className="text-accent-red mt-0.5 shrink-0">!</span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Feature Ideas */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-2 font-medium" style={{ color: agent.color }}>Feature Ideas</div>
                        <div className="grid grid-cols-2 gap-2">
                          {agent.featureIdeas.map((f, i) => (
                            <div key={i} className="p-3 rounded-lg bg-surface-2 border border-border">
                              <div className="text-[12px] font-semibold text-text-primary mb-1">{f.title}</div>
                              <div className="text-[11px] text-text-tertiary leading-relaxed">{f.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* FEATURES TAB */}
        {tab === 'features' && (
          <div className="space-y-3">
            <p className="text-[13px] text-text-secondary mb-4">
              {reviewData.featureIdeas.length} feature ideas from across the agent gang, ranked by impact.
            </p>
            {['high', 'medium', 'low'].map(impact => {
              const features = reviewData.featureIdeas.filter(f => f.impact === impact)
              if (features.length === 0) return null
              return (
                <div key={impact}>
                  <div className="flex items-center gap-2 mb-2 mt-4">
                    <ImpactBadge level={impact} />
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wider">impact ({features.length})</span>
                  </div>
                  <div className="space-y-2">
                    {features.map((f, i) => {
                      const agent = reviewData.agents.find(a => a.name === f.proposedBy)
                      return (
                        <div key={i} className="p-4 rounded-lg bg-surface-1 border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {agent && <span style={{ color: agent.color }}>{agent.icon}</span>}
                              <span className="text-[13px] font-semibold text-text-primary">{f.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ImpactBadge level={f.impact} />
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-3 text-text-tertiary uppercase tracking-wider">{f.effort} effort</span>
                            </div>
                          </div>
                          <div className="text-[12px] text-text-secondary mb-2">{f.description}</div>
                          <div className="text-[11px] text-text-tertiary leading-relaxed italic">"{f.rationale}"</div>
                          <div className="text-[10px] text-text-tertiary mt-2">— {f.proposedBy}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* DEPARTURES TAB */}
        {tab === 'departures' && (
          <div className="space-y-4">
            <p className="text-[13px] text-text-secondary mb-4">
              Four radically different takes on what Rubicon could be. Not tweaks — fundamental rethinks.
            </p>
            {reviewData.designDepartures.map((dep, i) => {
              const isExpanded = expandedDeparture === i
              const colors = ['#a855f7', '#06b6d4', '#f59e0b', '#22c55e']
              return (
                <div key={i} className={`rounded-lg border transition-all ${isExpanded ? 'border-border-bright' : 'border-border'}`} style={isExpanded ? { boxShadow: `0 0 20px ${colors[i]}10` } : {}}>
                  <button
                    onClick={() => setExpandedDeparture(isExpanded ? -1 : i)}
                    className="w-full flex items-start justify-between p-5 cursor-pointer bg-transparent border-none text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${colors[i]}15`, color: colors[i] }}>
                          {i + 1}/4
                        </span>
                        <span className="text-[16px] font-bold text-text-primary">{dep.title}</span>
                      </div>
                      <div className="text-[13px] text-text-secondary italic">{dep.subtitle}</div>
                    </div>
                    {isExpanded ? <ChevronDown size={16} className="text-text-tertiary mt-1" /> : <ChevronRight size={16} className="text-text-tertiary mt-1" />}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4 animate-fade-in-up">
                      {/* Description paragraphs */}
                      <div className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-line">
                        {dep.description}
                      </div>

                      {/* Key difference */}
                      <div className="p-3 rounded-lg border-l-2" style={{ borderColor: colors[i], backgroundColor: `${colors[i]}08` }}>
                        <div className="text-[10px] uppercase tracking-wider mb-1 font-medium" style={{ color: colors[i] }}>Key Difference</div>
                        <div className="text-[12px] text-text-secondary">{dep.keyDifference}</div>
                      </div>

                      {/* Inspirations */}
                      <div>
                        <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Inspired By</div>
                        <div className="flex flex-wrap gap-1.5">
                          {dep.inspirations.map((insp, j) => (
                            <span key={j} className="text-[10px] px-2 py-1 rounded bg-surface-2 border border-border text-text-tertiary">{insp}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
