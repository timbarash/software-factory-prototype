import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronRight, Zap, Lightbulb, Compass } from 'lucide-react'
import reviewData from '../agent-review.json'

interface AgentReviewProps { onBack: () => void }
type Tab = 'agents' | 'features' | 'departures'

function ScoreRing({ score, color, size = 48 }: { score: number; color: string; size?: number }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r, offset = c - (score / 100) * c
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#27272a" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color }}>{score}</span>
    </div>
  )
}

function ImpactBadge({ level }: { level: string }) {
  const colors: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
  return <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium" style={{ backgroundColor: `${colors[level]||'#71717a'}15`, color: colors[level]||'#71717a' }}>{level}</span>
}

/* ============================================================
   FEATURE CONCEPT MOCKUPS — inline visuals for top feature ideas
   ============================================================ */

function ComplianceGhostMockup() {
  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-5 mt-3">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-4 font-mono">Concept: Compliance Ghost Agent</div>
      <div className="flex gap-4">
        {/* Left: code diff with compliance overlay */}
        <div className="flex-1 rounded bg-surface-1 border border-border overflow-hidden">
          <div className="px-3 py-1.5 bg-surface-2 border-b border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] text-text-tertiary font-mono">order-sync-worker.go — line 142</span>
          </div>
          <div className="p-3 font-mono text-[10px] leading-relaxed">
            <div className="text-text-tertiary">  func (w *Worker) processOrder(ctx context.Context, order *Order) error {'{'}</div>
            <div className="text-text-tertiary">    // validate inventory levels</div>
            <div className="bg-red-500/10 border-l-2 border-red-500 pl-2 py-0.5 text-red-300">-   if err := w.inventory.Deduct(order.Items); err != nil {'{'}</div>
            <div className="bg-green-500/10 border-l-2 border-green-500 pl-2 py-0.5 text-green-300">+   if err := w.inventory.DeductWithTrace(order.Items, order.LocationID); err != nil {'{'}</div>
            <div className="text-text-tertiary">      return fmt.Errorf("inventory deduction failed: %w", err)</div>
            <div className="text-text-tertiary">    {'}'}</div>
            <div className="bg-green-500/10 border-l-2 border-green-500 pl-2 py-0.5 text-green-300">+   // Report to state track-and-trace system</div>
            <div className="bg-green-500/10 border-l-2 border-green-500 pl-2 py-0.5 text-green-300">+   w.metrc.ReportSale(order.LocationID, order.Items)</div>
          </div>
        </div>
        {/* Right: ghost agent alert panel */}
        <div className="w-72 space-y-3">
          <div className="rounded-lg bg-red-500/5 border border-red-500/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center text-[10px]">👻</div>
              <span className="text-[11px] font-semibold text-red-400">Compliance Ghost</span>
            </div>
            <div className="text-[11px] text-text-secondary leading-relaxed mb-2">This diff touches <span className="text-red-400 font-semibold">Metrc-reportable inventory operations</span> in 3 jurisdictions:</div>
            <div className="space-y-1">
              {['Colorado (MED)', 'Oregon (OLCC)', 'California (DCC)'].map(j => (
                <div key={j} className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-text-secondary">{j}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/30 p-3">
            <div className="text-[10px] text-amber-400 font-semibold mb-1">Required before merge:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary"><span className="text-amber-400">□</span> Verify ReportSale includes package tag IDs</div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary"><span className="text-amber-400">□</span> Add BioTrack fallback for WA locations</div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary"><span className="text-green-400">✓</span> LocationID mapping validated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function JurisdictionMatrixMockup() {
  const states = ['CO', 'OR', 'CA', 'WA', 'MI', 'IL', 'MA', 'NV']
  const features = ['Metrc', 'BioTrack', 'Leaf Data', 'Package Tags', 'Transfer Manifests', 'Destruction Reports']
  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-5 mt-3">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-4 font-mono">Concept: Jurisdiction Impact Matrix</div>
      <div className="overflow-x-auto">
        <div className="inline-grid gap-px bg-border/30" style={{ gridTemplateColumns: `120px repeat(${states.length}, 56px)` }}>
          {/* Header */}
          <div className="bg-surface-1 p-2 text-[9px] text-text-tertiary font-mono">Feature</div>
          {states.map(s => <div key={s} className="bg-surface-1 p-2 text-[10px] text-text-primary font-mono text-center font-semibold">{s}</div>)}
          {/* Rows */}
          {features.map((f, fi) => (
            <>
              <div key={f} className="bg-surface-1/50 p-2 text-[10px] text-text-secondary">{f}</div>
              {states.map((s, si) => {
                const v = ((fi * 7 + si * 3) % 5)
                const color = v < 1 ? '#ef4444' : v < 2 ? '#f59e0b' : '#22c55e'
                const label = v < 1 ? '✗' : v < 2 ? '~' : '✓'
                return <div key={`${f}-${s}`} className="bg-surface-1/50 p-2 text-center text-[10px] font-mono font-bold" style={{ color }}>{label}</div>
              })}
            </>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-3 text-[9px] text-text-tertiary">
        <span><span className="text-green-400">✓</span> Supported</span>
        <span><span className="text-amber-400">~</span> Partial</span>
        <span><span className="text-red-400">✗</span> Missing — blocks deployment</span>
      </div>
    </div>
  )
}

function AgentThoughtStreamMockup() {
  const thoughts = [
    { agent: 'Contexta', color: '#a855f7', icon: '◆', text: 'Found 3 similar sync failures in last 90 days — all involve location-cache staleness after CRUD operations', time: '0:00' },
    { agent: 'Cannabiz SME', color: '#22c55e', icon: '♦', text: 'Metrc divergence risk: if orders sync to wrong location, track-and-trace reports will show phantom inventory', time: '0:03' },
    { agent: 'Plana', color: '#3b82f6', icon: '▣', text: 'Proposing fix: invalidate location cache on any location CRUD event via pub/sub. Estimated 2 files changed.', time: '0:08' },
    { agent: 'QA', color: '#06b6d4', icon: '◉', text: 'Generating test matrix: 1-location, 2-location, 5-location configs × create/update/delete operations = 15 cases', time: '0:12' },
    { agent: 'Bilda', color: '#f59e0b', icon: '▲', text: 'Scaffolding cache invalidation handler. Subscribing to location.updated, location.created, location.deleted events.', time: '0:15' },
    { agent: 'Contexta', color: '#a855f7', icon: '◆', text: 'Cross-referencing: PF-1251 (inventory alerts) also reads from location-cache. Fix will benefit both tickets.', time: '0:20' },
  ]
  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-5 mt-3">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-4 font-mono">Concept: Agent Thought Stream (Live)</div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />
        <div className="space-y-3">
          {thoughts.map((t, i) => (
            <div key={i} className="flex gap-3 relative">
              <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[14px] z-10 border-2" style={{ backgroundColor: `${t.color}15`, borderColor: `${t.color}40`, color: t.color }}>{t.icon}</div>
              <div className="flex-1 rounded-lg bg-surface-1 border border-border p-3" style={{ borderLeftColor: t.color, borderLeftWidth: 2 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold" style={{ color: t.color }}>{t.agent}</span>
                  <span className="text-[9px] text-text-tertiary font-mono">{t.time}</span>
                </div>
                <div className="text-[12px] text-text-secondary leading-relaxed">{t.text}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Typing indicator */}
        <div className="flex gap-3 relative mt-3">
          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[14px] z-10 border-2" style={{ backgroundColor: '#06b6d415', borderColor: '#06b6d440', color: '#06b6d4' }}>◉</div>
          <div className="flex-1 rounded-lg bg-surface-1 border border-border p-3 opacity-60">
            <span className="text-[11px] font-semibold text-[#06b6d4]">QA</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FourTwentyReadinessMockup() {
  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-5 mt-3">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-4 font-mono">Concept: 4/20 Readiness Score</div>
      <div className="flex gap-6">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <svg width={140} height={80} viewBox="0 0 140 80">
            <path d="M 10 75 A 60 60 0 0 1 130 75" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />
            <path d="M 10 75 A 60 60 0 0 1 110 30" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
            <text x="70" y="65" textAnchor="middle" fill="#22c55e" fontSize="24" fontWeight="bold" fontFamily="monospace">73</text>
            <text x="70" y="78" textAnchor="middle" fill="#71717a" fontSize="8" fontFamily="monospace">/ 100</text>
          </svg>
          <span className="text-[11px] text-text-secondary mt-1">Overall Readiness</span>
        </div>
        {/* Breakdown */}
        <div className="flex-1 space-y-2">
          {[
            { label: 'Inventory Capacity', score: 92, color: '#22c55e' },
            { label: 'Payment Processing', score: 45, color: '#f59e0b' },
            { label: 'Order Throughput', score: 88, color: '#22c55e' },
            { label: 'Compliance Reporting', score: 67, color: '#f59e0b' },
            { label: 'Multi-location Sync', score: 31, color: '#ef4444' },
            { label: 'Staff Scheduling API', score: 78, color: '#22c55e' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-[10px] text-text-secondary w-36">{item.label}</span>
              <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
              </div>
              <span className="text-[10px] font-mono w-8 text-right" style={{ color: item.color }}>{item.score}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 p-3 rounded bg-red-500/5 border border-red-500/20 text-[11px] text-text-secondary">
        <span className="text-red-400 font-semibold">⚠ Blockers:</span> Multi-location sync (BUG-892) and payment timeout (BUG-901) must ship before 4/20 surge. At current velocity, ETA is April 14 — 6 day buffer.
      </div>
    </div>
  )
}

function CircuitBreakerMockup() {
  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-5 mt-3">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-4 font-mono">Concept: Agent Circuit Breaker</div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { agent: 'Contexta', color: '#a855f7', status: 'closed', confidence: 92, lastTrip: 'never', errors: 0 },
          { agent: 'Plana', color: '#3b82f6', status: 'closed', confidence: 78, lastTrip: '3d ago', errors: 1 },
          { agent: 'Bilda', color: '#f59e0b', status: 'half-open', confidence: 55, lastTrip: '2h ago', errors: 3 },
          { agent: 'QA', color: '#06b6d4', status: 'open', confidence: 22, lastTrip: 'now', errors: 7 },
        ].map(a => (
          <div key={a.agent} className="rounded-lg border p-4" style={{ borderColor: a.status === 'open' ? '#ef4444' : a.status === 'half-open' ? '#f59e0b' : '#27272a', backgroundColor: a.status === 'open' ? '#ef444408' : a.status === 'half-open' ? '#f59e0b08' : '#0a0a0f' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold" style={{ color: a.color }}>{a.agent}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${a.status === 'open' ? 'bg-red-500/20 text-red-400' : a.status === 'half-open' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>{a.status}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]"><span className="text-text-tertiary">Confidence</span><span className="font-mono" style={{ color: a.color }}>{a.confidence}%</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-text-tertiary">Errors</span><span className="font-mono text-text-secondary">{a.errors}</span></div>
              <div className="flex justify-between text-[10px]"><span className="text-text-tertiary">Last trip</span><span className="font-mono text-text-secondary">{a.lastTrip}</span></div>
            </div>
            {a.status === 'open' && (
              <div className="mt-3 p-2 rounded bg-red-500/10 text-[9px] text-red-300">
                Halted: 7 consecutive test failures on BUG-901. Human review required.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Map feature titles to their mockup components
const featureMockups: Record<string, () => JSX.Element> = {
  'Compliance Ghost Agent': ComplianceGhostMockup,
  'Jurisdiction Impact Matrix': JurisdictionMatrixMockup,
  'Agent Thought Stream': AgentThoughtStreamMockup,
  '4/20 Readiness Score': FourTwentyReadinessMockup,
  'Agent Circuit Breaker': CircuitBreakerMockup,
}

/* ============================================================
   DESIGN DEPARTURE MOCKUPS — full-width, high fidelity
   ============================================================ */

function CanvasMockup() {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-[#07070c]">
      <div className="px-4 py-2 bg-surface-1 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/60" /></div>
          <span className="text-[10px] text-text-tertiary font-mono">Rubicon Canvas — Sprint 14</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[9px] text-text-tertiary"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /> 4 online</div>
          <span className="text-[9px] bg-surface-3 px-2 py-0.5 rounded text-text-tertiary">100%</span>
        </div>
      </div>
      <svg viewBox="0 0 1000 550" className="w-full" style={{ minHeight: 450 }}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a1a2a" strokeWidth="0.3" /></pattern>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width="1000" height="550" fill="url(#grid)" />

        {/* Stage lane headers */}
        {['Contexta', 'Plana', 'Bilda', 'QA', 'Merge'].map((s, i) => (
          <g key={s}>
            <rect x={i * 200} y={0} width={200} height={36} fill={i % 2 === 0 ? '#0c0c14' : '#0e0e18'} />
            <text x={i * 200 + 100} y={23} textAnchor="middle" fill="#3f3f52" fontSize="11" fontFamily="monospace" fontWeight="600">{s.toUpperCase()}</text>
            <line x1={i * 200} y1={36} x2={(i+1) * 200} y2={36} stroke="#1e1e2a" strokeWidth="0.5" />
            <line x1={(i+1) * 200} y1={36} x2={(i+1) * 200} y2={550} stroke="#1a1a2a" strokeWidth="0.3" strokeDasharray="4 4" />
          </g>
        ))}

        {/* Flow particles */}
        {Array.from({length: 15}).map((_, i) => (
          <circle key={`fp${i}`} r={1} fill="#22c55e" opacity={0.2}>
            <animate attributeName="cx" from={-10} to={1010} dur={`${6 + i * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="cy" from={200 + Math.sin(i) * 100} to={220 + Math.cos(i) * 80} dur={`${6 + i * 0.7}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* BUG-892: Critical, Contexta stage — large pulsing card */}
        <g transform="translate(30, 55)">
          <rect width={160} height={120} rx={8} fill="#12121e" stroke="#ef4444" strokeWidth={2} />
          <rect width={160} height={3} rx={1.5} fill="#ef4444" opacity={0.6}><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" /></rect>
          <text x={12} y={28} fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="600">BUG-892</text>
          <text x={148} y={28} textAnchor="end" fill="#ef4444" fontSize="9" fontFamily="monospace">P0</text>
          <text x={12} y={44} fill="#a1a1aa" fontSize="10">Order sync — multi-location</text>
          <text x={12} y={60} fill="#71717a" fontSize="9">23 users affected • $12K/day</text>
          {/* Agent readiness dots */}
          <g transform="translate(12, 72)">
            {[{c:'#a855f7',v:55},{c:'#3b82f6',v:20},{c:'#f59e0b',v:10},{c:'#06b6d4',v:15}].map((a,j) => (
              <g key={j} transform={`translate(${j * 36}, 0)`}>
                <circle cx={6} cy={6} r={5} fill="none" stroke={a.c} strokeWidth={1.5} />
                <text x={6} y={9} textAnchor="middle" fill={a.c} fontSize="6" fontWeight="bold">{a.v}</text>
                <text x={14} y={9} fill="#52525b" fontSize="7">{['C','P','B','Q'][j]}</text>
              </g>
            ))}
          </g>
          <g transform="translate(12, 95)">
            <rect width={136} height={14} rx={3} fill="#1a1a2a" />
            <rect width={37} height={14} rx={3} fill="#ef4444" opacity={0.3} />
            <text x={68} y={10} textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">28% confidence</text>
          </g>
          {/* Pulsing human-input indicator */}
          <circle cx={150} cy={110} r={6} fill="#ef4444" opacity={0.15}><animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" /></circle>
          <text x={150} y={113} textAnchor="middle" fill="#ef4444" fontSize="7">!</text>
        </g>

        {/* PF-1255: medium, also Contexta */}
        <g transform="translate(30, 200)">
          <rect width={160} height={95} rx={8} fill="#12121e" stroke="#3b82f6" strokeWidth={1} />
          <text x={12} y={25} fill="#3b82f6" fontSize="11" fontFamily="monospace">PF-1255</text>
          <text x={12} y={41} fill="#a1a1aa" fontSize="10">API rate limiting dashboard</text>
          <text x={12} y={57} fill="#71717a" fontSize="9">45 users • 18 requests</text>
          <g transform="translate(12, 68)">
            <rect width={136} height={12} rx={3} fill="#1a1a2a" />
            <rect width={30} height={12} rx={3} fill="#3b82f6" opacity={0.3} />
            <text x={68} y={9} textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">22% confidence</text>
          </g>
        </g>

        {/* PF-1247: Plana stage */}
        <g transform="translate(230, 70)">
          <rect width={160} height={110} rx={8} fill="#12121e" stroke="#3b82f6" strokeWidth={1} />
          <text x={12} y={25} fill="#3b82f6" fontSize="11" fontFamily="monospace">PF-1247</text>
          <text x={12} y={41} fill="#a1a1aa" fontSize="10">Bulk actions toolbar</text>
          <text x={12} y={57} fill="#71717a" fontSize="9">1.2K users • 47 requests</text>
          <g transform="translate(12, 68)">
            {[{c:'#a855f7',v:92},{c:'#3b82f6',v:78},{c:'#f59e0b',v:65},{c:'#06b6d4',v:40}].map((a,j) => (
              <g key={j} transform={`translate(${j * 36}, 0)`}>
                <circle cx={6} cy={6} r={5} fill="none" stroke={a.c} strokeWidth={1.5} />
                <text x={6} y={9} textAnchor="middle" fill={a.c} fontSize="6" fontWeight="bold">{a.v}</text>
              </g>
            ))}
          </g>
          <g transform="translate(12, 88)">
            <rect width={136} height={12} rx={3} fill="#1a1a2a" />
            <rect width={100} height={12} rx={3} fill="#f59e0b" opacity={0.3} />
            <text x={68} y={9} textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">74% confidence</text>
          </g>
        </g>

        {/* PF-1251 + BUG-887: Bilda stage */}
        <g transform="translate(430, 55)">
          <rect width={160} height={105} rx={8} fill="#12121e" stroke="#3b82f6" strokeWidth={1} />
          <text x={12} y={25} fill="#3b82f6" fontSize="11" fontFamily="monospace">PF-1251</text>
          <text x={12} y={41} fill="#a1a1aa" fontSize="10">Inventory alerts</text>
          <g transform="translate(12, 55)">
            <rect width={136} height={12} rx={3} fill="#1a1a2a" />
            <rect width={111} height={12} rx={3} fill="#22c55e" opacity={0.3} />
            <text x={68} y={9} textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">82% confidence</text>
          </g>
          {/* Sunlight rays = Bilda working */}
          {[0,1,2].map(j => <line key={j} x1={80 + j*20} y1={-15} x2={80 + j*15} y2={0} stroke="#f59e0b" strokeWidth={0.8} opacity={0.2} />)}
        </g>
        <g transform="translate(430, 180)">
          <rect width={160} height={90} rx={8} fill="#12121e" stroke="#71717a" strokeWidth={0.5} />
          <text x={12} y={25} fill="#71717a" fontSize="11" fontFamily="monospace">BUG-887</text>
          <text x={12} y={41} fill="#71717a" fontSize="10">Chart flicker</text>
          <g transform="translate(12, 55)">
            <rect width={136} height={12} rx={3} fill="#1a1a2a" />
            <rect width={115} height={12} rx={3} fill="#22c55e" opacity={0.2} />
            <text x={68} y={9} textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">85%</text>
          </g>
        </g>

        {/* BUG-901: QA stage */}
        <g transform="translate(630, 70)">
          <rect width={160} height={115} rx={8} fill="#12121e" stroke="#ef4444" strokeWidth={1.5} />
          <text x={12} y={25} fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="600">BUG-901</text>
          <text x={148} y={25} textAnchor="end" fill="#ef4444" fontSize="9">P0</text>
          <text x={12} y={41} fill="#a1a1aa" fontSize="10">Payment timeout {'>'} $5K</text>
          <text x={12} y={57} fill="#71717a" fontSize="9">15 users • 89% error rate</text>
          <g transform="translate(12, 68)">
            {[{c:'#a855f7',v:98},{c:'#3b82f6',v:95},{c:'#f59e0b',v:92},{c:'#06b6d4',v:70}].map((a,j) => (
              <g key={j} transform={`translate(${j * 36}, 0)`}>
                <circle cx={6} cy={6} r={5} fill="none" stroke={a.c} strokeWidth={1.5} />
                <text x={6} y={9} textAnchor="middle" fill={a.c} fontSize="6" fontWeight="bold">{a.v}</text>
              </g>
            ))}
          </g>
          <g transform="translate(12, 93)">
            <rect width={136} height={12} rx={3} fill="#1a1a2a" />
            <rect width={124} height={12} rx={3} fill="#22c55e" opacity={0.3} />
            <text x={68} y={9} textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">91% confidence</text>
          </g>
          {/* Wind = QA testing */}
          {[0,1,2].map(j => <path key={j} d={`M ${-10},${40+j*15} Q ${20},${35+j*15} ${50},${40+j*15}`} fill="none" stroke="#06b6d4" strokeWidth={0.6} opacity={0.25} />)}
        </g>

        {/* PF-1239: Merge stage — glowing green */}
        <g transform="translate(830, 80)">
          <rect width={150} height={100} rx={8} fill="#0d1a0d" stroke="#22c55e" strokeWidth={1.5} filter="url(#glow)" />
          <text x={12} y={25} fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="600">PF-1239</text>
          <text x={138} y={25} textAnchor="end" fill="#22c55e" fontSize="9">✓ READY</text>
          <text x={12} y={41} fill="#a1a1aa" fontSize="10">CSV export</text>
          <g transform="translate(12, 58)">
            <rect width={126} height={12} rx={3} fill="#1a1a2a" />
            <rect width={122} height={12} rx={3} fill="#22c55e" opacity={0.4} />
            <text x={63} y={9} textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="monospace">97% — merge ready</text>
          </g>
          <text x={75} y={88} textAnchor="middle" fill="#22c55e" fontSize="9" fontFamily="monospace" opacity={0.6}>Auto-merge in 12m</text>
        </g>

        {/* Connection lines between related tickets */}
        <path d="M 190,115 C 210,115 210,125 230,125" fill="none" stroke="#a855f7" strokeWidth={0.8} opacity={0.25} strokeDasharray="3 3" />
        <path d="M 390,125 C 410,125 410,107 430,107" fill="none" stroke="#06b6d4" strokeWidth={0.8} opacity={0.25} strokeDasharray="3 3" />
        <path d="M 590,107 C 610,107 610,127 630,127" fill="none" stroke="#f59e0b" strokeWidth={0.8} opacity={0.25} strokeDasharray="3 3" />
        <path d="M 790,127 C 810,127 810,130 830,130" fill="none" stroke="#22c55e" strokeWidth={0.8} opacity={0.25} strokeDasharray="3 3" />
        {/* Cross-ticket dependency: BUG-892 blocks PF-1251 */}
        <path d="M 110,175 C 110,350 500,350 500,160" fill="none" stroke="#ef4444" strokeWidth={0.6} opacity={0.2} strokeDasharray="6 3" />
        <text x={305} y={345} textAnchor="middle" fill="#ef4444" fontSize="8" opacity={0.4}>blocks</text>

        {/* Multiplayer cursors */}
        <g transform="translate(660, 200)">
          <polygon points="0,0 0,14 5,11" fill="#a855f7" /><rect x={7} y={4} width={35} height={14} rx={3} fill="#a855f7" /><text x={12} y={14} fill="white" fontSize="8" fontWeight="500">Sarah</text>
        </g>
        <g transform="translate(100, 310)">
          <polygon points="0,0 0,14 5,11" fill="#06b6d4" /><rect x={7} y={4} width={30} height={14} rx={3} fill="#06b6d4" /><text x={12} y={14} fill="white" fontSize="8" fontWeight="500">Mike</text>
        </g>
        <g transform="translate(850, 200)">
          <polygon points="0,0 0,14 5,11" fill="#22c55e" /><rect x={7} y={4} width={28} height={14} rx={3} fill="#22c55e" /><text x={12} y={14} fill="white" fontSize="8" fontWeight="500">Alex</text>
        </g>

        {/* Shipped zone */}
        <rect x={0} y={420} width={1000} height={130} fill="#080d08" />
        <line x1={0} y1={420} x2={1000} y2={420} stroke="#22c55e" strokeWidth={0.3} opacity={0.3} />
        <text x={20} y={445} fill="#22c55e" fontSize="10" fontFamily="monospace" opacity={0.4}>SHIPPED THIS SPRINT</text>
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => (
          <g key={`sh${i}`} transform={`translate(${20 + i * 70}, 455)`}>
            <rect width={60} height={55} rx={4} fill={`hsl(${140 + i * 8}, 30%, ${10 + i * 0.5}%)`} stroke="#22c55e" strokeWidth={0.3} opacity={0.6} />
            <text x={30} y={20} textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace" opacity={0.6}>#{1220 + i}</text>
            <text x={30} y={35} textAnchor="middle" fill="#52525b" fontSize="7">merged</text>
            <rect x={5} y={42} width={50} height={6} rx={2} fill="#22c55e" opacity={0.1 + i * 0.03} />
          </g>
        ))}
        <text x={980} y={520} textAnchor="end" fill="#22c55e" fontSize="11" fontFamily="monospace" opacity={0.5}>14 shipped • 97% AI-assisted • avg 2.3 days</text>
      </svg>
    </div>
  )
}

function WarRoomMockup() {
  const msgs: {agent: string; color: string; text: string; time: string; isRich?: boolean; richContent?: string}[] = [
    { agent: 'You', color: '#e2e8f0', text: "what's the highest priority right now?", time: '2:14 PM' },
    { agent: 'Contexta', color: '#a855f7', text: 'BUG-892 — Order sync fails silently for multi-location retailers. Confidence: 28%. 23 affected users, $12K/day revenue at risk. Root cause still under investigation.', time: '2:14 PM' },
    { agent: 'Cannabiz SME', color: '#22c55e', text: "Compliance flag on BUG-892: multi-location sync failures mean Metrc track-and-trace reports may be diverging across locations. If a state auditor pulls reports during this window, that's a Category 2 violation. Colorado and Oregon locations are highest risk.", time: '2:14 PM' },
    { agent: 'QA', color: '#06b6d4', text: 'I can spin up a 3-location staging env with realistic sync patterns. 20 min to get test fixtures ready. Heads up: order flow is the critical path — regression risk is HIGH on any changes here.', time: '2:15 PM' },
    { agent: 'Plana', color: '#3b82f6', text: 'Blocked on Contexta diagnosis. Likely involves order-sync-worker + location-cache services. @Contexta — can you dig into the cache TTL configuration? Suspecting stale reads.', time: '2:15 PM' },
    { agent: 'Contexta', color: '#a855f7', text: '', time: '2:16 PM', isRich: true, richContent: 'found_it' },
    { agent: 'Bilda', color: '#f59e0b', text: "I can have a fix ready in ~45 min once Plana specs the approach. The cache invalidation pattern already exists in the notification service — I'll port it.", time: '2:16 PM' },
    { agent: 'You', color: '#e2e8f0', text: "@Plana go ahead and spec it. @QA start the staging env now. @Bilda prep the port.", time: '2:17 PM' },
  ]
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-[#07070c]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-48 bg-surface-1 border-r border-border p-3 shrink-0">
          <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-3 font-mono">Channels</div>
          <div className="space-y-0.5">
            {[
              { name: '#general', unread: 0, active: false },
              { name: '#BUG-892', unread: 3, active: true },
              { name: '#PF-1247', unread: 0, active: false },
              { name: '#PF-1251', unread: 1, active: false },
              { name: '#BUG-901', unread: 0, active: false },
            ].map(ch => (
              <div key={ch.name} className={`flex items-center justify-between px-2 py-1.5 rounded text-[11px] ${ch.active ? 'bg-surface-3 text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}>
                <span className="font-mono">{ch.name}</span>
                {ch.unread > 0 && <span className="text-[8px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{ch.unread}</span>}
              </div>
            ))}
          </div>
          <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2 mt-5 font-mono">Agents Online</div>
          <div className="space-y-1.5">
            {[
              { name: 'Contexta', color: '#a855f7', status: 'investigating' },
              { name: 'Plana', color: '#3b82f6', status: 'waiting' },
              { name: 'Bilda', color: '#f59e0b', status: 'prepping' },
              { name: 'QA', color: '#06b6d4', status: 'staging' },
              { name: 'Cannabiz', color: '#22c55e', status: 'monitoring' },
            ].map(a => (
              <div key={a.name} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-[10px]" style={{ color: a.color }}>{a.name}</span>
                <span className="text-[8px] text-text-tertiary ml-auto">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Main chat */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-surface-1/50">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-text-primary font-mono">#BUG-892</span>
              <span className="text-[10px] text-text-tertiary">Order sync — multi-location</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 uppercase">P0 Critical</span>
            </div>
            <span className="text-[9px] text-text-tertiary">6 participants</span>
          </div>
          <div className="p-4 space-y-4 flex-1" style={{ minHeight: 420 }}>
            {msgs.map((m, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: `${m.color}15`, color: m.color }}>{m.agent[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold" style={{ color: m.color }}>{m.agent}</span>
                    <span className="text-[9px] text-text-tertiary">{m.time}</span>
                  </div>
                  {m.isRich ? (
                    <div className="mt-2 rounded-lg bg-surface-1 border border-border overflow-hidden">
                      <div className="px-3 py-1.5 bg-surface-2 border-b border-border text-[10px] text-text-tertiary font-mono">Investigation Result</div>
                      <div className="p-3">
                        <div className="text-[11px] text-green-400 font-semibold mb-2">Root cause identified</div>
                        <div className="text-[11px] text-text-secondary mb-2">Cache TTL is 300s but location resolver uses stale reads. The sync worker reads location config at startup, not per-request. Any location CRUD after startup → stale data.</div>
                        <div className="font-mono text-[10px] bg-surface-2 rounded p-2 text-text-tertiary">
                          <div><span className="text-red-400">-</span> locationConfig = w.cache.Get("locations") <span className="text-red-400">// startup only</span></div>
                          <div><span className="text-green-400">+</span> locationConfig = w.cache.GetFresh("locations") <span className="text-green-400">// per-request</span></div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[9px] px-2 py-0.5 rounded bg-green-500/15 text-green-400">high confidence</span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-surface-3 text-text-tertiary">2 files affected</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[12px] text-text-secondary leading-relaxed mt-1">{m.text}</div>
                  )}
                </div>
              </div>
            ))}
            {/* Typing indicators */}
            <div className="flex gap-3 opacity-50">
              <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>P</div>
              <div>
                <span className="text-[11px] font-semibold text-[#3b82f6]">Plana</span>
                <div className="flex gap-1 mt-1.5"><div className="w-2 h-2 rounded-full bg-text-tertiary animate-pulse" /><div className="w-2 h-2 rounded-full bg-text-tertiary animate-pulse" style={{animationDelay:'0.2s'}} /><div className="w-2 h-2 rounded-full bg-text-tertiary animate-pulse" style={{animationDelay:'0.4s'}} /></div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-border flex items-center gap-3">
            <div className="flex-1 bg-surface-2 rounded-lg px-4 py-2.5 text-[12px] text-text-tertiary border border-border">@Cannabiz how quickly do we need to notify affected CO dispensaries about the Metrc gap?</div>
            <div className="w-8 h-8 rounded-lg bg-accent-green flex items-center justify-center text-[12px] text-black font-bold cursor-pointer">↵</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MissionControlMockup() {
  const sparkline = (data: number[], color: string) => {
    const max = Math.max(...data), min = Math.min(...data)
    const pts = data.map((v, i) => `${i * (80 / (data.length - 1))},${30 - ((v - min) / (max - min || 1)) * 25}`).join(' ')
    return <svg width={80} height={30} className="shrink-0"><polyline points={pts} fill="none" stroke={color} strokeWidth={1.2} /></svg>
  }
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-[#050508]">
      <div className="px-4 py-2 bg-[#0a0a10] border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-text-tertiary font-mono">RUBICON MISSION CONTROL — LIVE</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-text-tertiary font-mono">
          <span>Throughput: 3.2 tickets/day</span>
          <span>|</span>
          <span>Queue: 7 active</span>
          <span>|</span>
          <span>Uptime: 99.7%</span>
        </div>
      </div>
      <div className="grid grid-cols-12 grid-rows-6 gap-px bg-[#1a1a2a]/30" style={{ minHeight: 500 }}>
        {/* Pipeline Flow — top section, full width */}
        <div className="col-span-12 row-span-2 bg-[#07070c] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[9px] text-text-tertiary uppercase tracking-wider font-mono">Pipeline Flow</div>
            <div className="flex gap-3 text-[8px] text-text-tertiary font-mono">
              <span>▶ 2 in-flight</span>
              <span className="text-red-400">■ 1 blocked</span>
              <span className="text-green-400">● 1 ready</span>
            </div>
          </div>
          <div className="flex gap-1">
            {[
              { name: 'Contexta', tickets: [{id:'892',sev:'critical',pct:28},{id:'1255',sev:'medium',pct:22}] },
              { name: 'Plana', tickets: [{id:'1247',sev:'high',pct:74}] },
              { name: 'Bilda', tickets: [{id:'1251',sev:'medium',pct:82},{id:'887',sev:'low',pct:85}] },
              { name: 'QA', tickets: [{id:'901',sev:'critical',pct:91}] },
              { name: 'Merge', tickets: [{id:'1239',sev:'low',pct:97}] },
            ].map(stage => (
              <div key={stage.name} className="flex-1 rounded-lg bg-surface-1/30 border border-border/20 p-2.5">
                <div className="text-[9px] text-text-tertiary font-mono mb-2 flex items-center justify-between">
                  <span>{stage.name}</span>
                  <span className="text-[8px]">{stage.tickets.length}</span>
                </div>
                <div className="space-y-1.5">
                  {stage.tickets.map(t => {
                    const c = t.sev === 'critical' ? '#ef4444' : t.sev === 'high' ? '#f59e0b' : t.sev === 'medium' ? '#3b82f6' : '#71717a'
                    return (
                      <div key={t.id} className="rounded bg-surface-1/80 border p-2" style={{ borderColor: `${c}40` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-mono font-semibold" style={{ color: c }}>{t.id}</span>
                          <span className="text-[8px] font-mono" style={{ color: c }}>{t.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: c }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Vital Signs — bottom left */}
        <div className="col-span-4 row-span-4 bg-[#07070c] p-4">
          <div className="text-[9px] text-text-tertiary uppercase tracking-wider font-mono mb-3">Agent Vital Signs</div>
          <div className="space-y-3">
            {[
              { name: 'Contexta', color: '#a855f7', load: 85, trend: [60,65,70,75,80,82,85], tickets: 2, status: 'investigating BUG-892' },
              { name: 'Plana', color: '#3b82f6', load: 40, trend: [80,70,55,50,45,42,40], tickets: 1, status: 'waiting on Contexta' },
              { name: 'Bilda', color: '#f59e0b', load: 72, trend: [30,45,55,60,68,70,72], tickets: 2, status: 'implementing PF-1251' },
              { name: 'QA', color: '#06b6d4', load: 90, trend: [40,50,65,75,80,85,90], tickets: 1, status: 'validating BUG-901' },
              { name: 'Cannabiz SME', color: '#22c55e', load: 30, trend: [50,45,40,35,32,30,30], tickets: 3, status: 'monitoring compliance' },
            ].map(a => (
              <div key={a.name} className="rounded-lg bg-surface-1/30 border border-border/20 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-[11px] font-semibold" style={{ color: a.color }}>{a.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: a.color }}>{a.load}%</span>
                </div>
                <div className="flex items-center gap-3 mb-1.5">
                  {sparkline(a.trend, a.color)}
                  <div className="flex-1">
                    <div className="h-2 bg-surface-3 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${a.load}%`, backgroundColor: a.color }} /></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] text-text-tertiary">
                  <span>{a.tickets} ticket{a.tickets !== 1 ? 's' : ''}</span>
                  <span className="italic">{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Panel — bottom center */}
        <div className="col-span-4 row-span-4 bg-[#07070c] p-4 border-l border-r border-border/10">
          <div className="text-[9px] text-text-tertiary uppercase tracking-wider font-mono mb-3">Focus Panel — BUG-892</div>
          <div className="rounded-lg bg-surface-1 border border-red-500/30 overflow-hidden">
            <div className="px-3 py-2 bg-red-500/5 border-b border-red-500/20 flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold text-red-400">BUG-892</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 uppercase">Critical</span>
            </div>
            <div className="p-3 space-y-3">
              <div>
                <div className="text-[12px] text-text-primary font-medium mb-1">Order sync fails silently</div>
                <div className="text-[10px] text-text-tertiary">Multi-location retailers • 23 affected</div>
              </div>
              <div className="rounded bg-surface-2 border border-border p-2">
                <div className="text-[9px] text-text-tertiary font-mono mb-1">Terminal</div>
                <div className="font-mono text-[9px] text-green-400 space-y-0.5">
                  <div>$ contexta investigate BUG-892</div>
                  <div className="text-text-tertiary">Scanning order-sync-worker...</div>
                  <div className="text-text-tertiary">Found: cache.Get("locations")</div>
                  <div className="text-amber-400">⚠ Stale read: TTL=300s, no invalidation</div>
                  <div className="text-green-400">✓ Root cause: startup-only cache load</div>
                </div>
              </div>
              <div>
                <div className="text-[9px] text-text-tertiary font-mono mb-1.5">Agent Readiness</div>
                <div className="space-y-1">
                  {[{n:'Contexta',c:'#a855f7',v:55},{n:'Plana',c:'#3b82f6',v:20},{n:'Bilda',c:'#f59e0b',v:10},{n:'QA',c:'#06b6d4',v:15}].map(a => (
                    <div key={a.n} className="flex items-center gap-2">
                      <span className="text-[9px] w-16" style={{color:a.c}}>{a.n}</span>
                      <div className="flex-1 h-1.5 bg-surface-3 rounded-full"><div className="h-full rounded-full" style={{width:`${a.v}%`,backgroundColor:a.c}} /></div>
                      <span className="text-[9px] font-mono w-6 text-right" style={{color:a.c}}>{a.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded bg-red-500/5 border border-red-500/20 p-2">
                <div className="text-[9px] text-red-400 font-semibold mb-1">Human Input Required</div>
                <div className="text-[10px] text-text-secondary">Confirm: should cache invalidation be synchronous or eventual?</div>
                <div className="flex gap-2 mt-2">
                  <div className="text-[9px] px-2.5 py-1 rounded bg-surface-3 border border-border text-text-secondary cursor-pointer">Synchronous</div>
                  <div className="text-[9px] px-2.5 py-1 rounded bg-surface-3 border border-border text-text-secondary cursor-pointer">Eventual</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Feed — bottom right */}
        <div className="col-span-4 row-span-4 bg-[#07070c] p-4">
          <div className="text-[9px] text-text-tertiary uppercase tracking-wider font-mono mb-3">Alert Feed</div>
          <div className="space-y-2">
            {[
              { text: 'BUG-892: Contexta found root cause — cache staleness', color: '#a855f7', time: '2m ago', action: 'Review' },
              { text: 'BUG-892: Cannabiz SME flagged Metrc compliance risk', color: '#22c55e', time: '2m ago', action: 'Ack' },
              { text: 'BUG-892 needs human input: sync vs eventual cache', color: '#ef4444', time: '1m ago', action: 'Decide' },
              { text: 'PF-1239: All tests passing — auto-merge in 12m', color: '#22c55e', time: '5m ago', action: 'Merge now' },
              { text: 'BUG-901: QA confidence 91% → 89% on edge case', color: '#f59e0b', time: '8m ago', action: 'Ignore' },
              { text: 'PF-1251: Bilda completed notification center integration', color: '#f59e0b', time: '15m ago', action: 'Review' },
              { text: 'Compliance: CO Metrc report may diverge (BUG-892)', color: '#ef4444', time: '20m ago', action: 'Escalate' },
              { text: 'BUG-887: Bilda applied resize fix to 2/4 charts', color: '#f59e0b', time: '25m ago', action: null },
              { text: 'PF-1247: Plana architecture approved by Design Lead', color: '#3b82f6', time: '30m ago', action: null },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-surface-1/30 border border-border/20 p-2.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: a.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-text-secondary leading-relaxed">{a.text}</div>
                  <div className="text-[8px] text-text-tertiary mt-0.5">{a.time}</div>
                </div>
                {a.action && (
                  <span className="text-[8px] px-2 py-1 rounded border shrink-0 cursor-pointer" style={{ borderColor: `${a.color}40`, color: a.color }}>{a.action}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Audio cue bar */}
      <div className="px-4 py-1.5 bg-[#0a0a10] border-t border-border flex items-center justify-between text-[8px] text-text-tertiary font-mono">
        <span>🔔 Audio: chime on merge, tone on circuit break, pulse on human-input</span>
        <span>Last event: 1m ago • Next refresh: 3s</span>
      </div>
    </div>
  )
}

function GardenMockup() {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-[#050508]">
      <div className="px-4 py-2 bg-[#0a0f0a] border-b border-[#1a2a1a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[12px]">🌱</span>
          <span className="text-[10px] text-green-400/70 font-mono">Rubicon Garden — Sprint 14</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-green-400/40 font-mono">
          <span>🌤️ Clear</span>
          <span>💧 Hydrated</span>
          <span>🌡️ 72°F</span>
        </div>
      </div>
      <svg viewBox="0 0 1000 600" className="w-full" style={{ minHeight: 480 }}>
        <defs>
          <linearGradient id="nightsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030308" />
            <stop offset="60%" stopColor="#050810" />
            <stop offset="100%" stopColor="#0a0f0a" />
          </linearGradient>
          <linearGradient id="soilgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1208" />
            <stop offset="100%" stopColor="#0d0a04" />
          </linearGradient>
          <radialGradient id="moonlight" cx="85%" cy="10%" r="30%">
            <stop offset="0%" stopColor="#1a1a3a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="plantglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="1000" height="600" fill="url(#nightsky)" />
        <rect width="1000" height="600" fill="url(#moonlight)" />

        {/* Stars */}
        {Array.from({length: 30}).map((_, i) => (
          <circle key={`star${i}`} cx={50 + (i * 137) % 900} cy={10 + (i * 73) % 180} r={0.5 + (i % 3) * 0.3} fill="white" opacity={0.1 + (i % 4) * 0.05}>
            <animate attributeName="opacity" values={`${0.1 + (i%4)*0.05};${0.3 + (i%3)*0.05};${0.1 + (i%4)*0.05}`} dur={`${3 + i % 4}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Moon */}
        <circle cx={850} cy={60} r={25} fill="#1a1a3a" opacity={0.4} />
        <circle cx={855} cy={55} r={22} fill="#0a0a1a" />

        {/* Ground */}
        <rect x={0} y={400} width={1000} height={200} fill="url(#soilgrad)" />
        <path d="M 0 400 Q 200 390 400 400 Q 600 410 800 398 Q 900 395 1000 400 L 1000 400 L 0 400" fill="#1a1a0a" stroke="#2d4a1a" strokeWidth={0.5} opacity={0.4} />

        {/* Garden fence */}
        {Array.from({length: 25}).map((_, i) => (
          <g key={`fence${i}`}>
            <rect x={i * 42 - 5} y={375} width={3} height={30} fill="#2a1a0a" rx={1} />
            {i < 24 && <rect x={i * 42 - 5} y={382} width={42} height={2} fill="#2a1a0a" rx={1} />}
          </g>
        ))}

        {/* BUG-892: WILTING THORN ROSE — critical, Contexta stage */}
        <g transform="translate(100, 200)">
          {/* Rain — Contexta investigating */}
          {Array.from({length: 8}).map((_, j) => (
            <line key={j} x1={-30 + j * 12} y1={-30} x2={-35 + j * 12} y2={-20} stroke="#a855f7" strokeWidth={0.6} opacity={0.35}>
              <animate attributeName="y1" values="-40;200" dur={`${1.2 + j * 0.15}s`} repeatCount="indefinite" />
              <animate attributeName="y2" values="-30;210" dur={`${1.2 + j * 0.15}s`} repeatCount="indefinite" />
            </line>
          ))}
          {/* Stem — drooping */}
          <path d="M 0,200 Q -5,150 -10,100 Q -12,70 -8,50 Q -5,30 -15,15" fill="none" stroke="#3d4a2a" strokeWidth={3} />
          {/* Thorns */}
          <line x1={-8} y1={100} x2={-18} y2={92} stroke="#5a3a2a" strokeWidth={1} />
          <line x1={-10} y1={70} x2={0} y2={62} stroke="#5a3a2a" strokeWidth={1} />
          {/* Wilting leaves */}
          <ellipse cx={-22} cy={120} rx={12} ry={5} fill="#2a3a1a" opacity={0.6} transform="rotate(30, -22, 120)" />
          <ellipse cx={5} cy={85} rx={10} ry={4} fill="#2a3a1a" opacity={0.5} transform="rotate(-20, 5, 85)" />
          {/* Rose head — drooping */}
          <circle cx={-15} cy={12} r={14} fill="#ef4444" opacity={0.5} />
          <circle cx={-15} cy={12} r={10} fill="#ef4444" opacity={0.7} />
          <circle cx={-15} cy={12} r={5} fill="#dc2626" />
          {/* Wilting petals falling */}
          <ellipse cx={-25} cy={35} rx={3} ry={2} fill="#ef4444" opacity={0.3} transform="rotate(45, -25, 35)">
            <animate attributeName="cy" values="35;45" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="4s" repeatCount="indefinite" />
          </ellipse>
          {/* Labels */}
          <text x={0} y={218} textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="600">BUG-892</text>
          <text x={0} y={232} textAnchor="middle" fill="#ef4444" fontSize="9" opacity={0.7}>wilting — needs water</text>
          <text x={0} y={245} textAnchor="middle" fill="#71717a" fontSize="8">28% confidence</text>
          {/* Pulsing danger indicator */}
          <circle cx={-15} cy={12} r={20} fill="none" stroke="#ef4444" strokeWidth={0.5} opacity={0.3}>
            <animate attributeName="r" values="20;28;20" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* PF-1247: SUNFLOWER — high priority, Plana stage */}
        <g transform="translate(300, 140)">
          {/* Stem */}
          <path d="M 0,260 Q 2,200 3,150 Q 4,100 2,50 Q 1,25 0,0" fill="none" stroke="#3d7a2a" strokeWidth={4} />
          {/* Leaves */}
          <ellipse cx={-22} cy={180} rx={18} ry={7} fill="#2d6a1a" transform="rotate(25, -22, 180)" />
          <ellipse cx={20} cy={140} rx={16} ry={6} fill="#2d6a1a" transform="rotate(-20, 20, 140)" />
          <ellipse cx={-18} cy={100} rx={14} ry={5} fill="#2d5a1a" transform="rotate(15, -18, 100)" />
          {/* Flower head */}
          {Array.from({length: 12}).map((_, j) => (
            <ellipse key={j} cx={0} cy={-15} rx={5} ry={14} fill="#f59e0b" opacity={0.7} transform={`rotate(${j * 30}, 0, 0)`} />
          ))}
          <circle cx={0} cy={0} r={12} fill="#92400e" />
          <circle cx={0} cy={0} r={8} fill="#78350f" />
          <text x={0} y={278} textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="600">PF-1247</text>
          <text x={0} y={292} textAnchor="middle" fill="#f59e0b" fontSize="9" opacity={0.7}>flowering</text>
          <text x={0} y={305} textAnchor="middle" fill="#71717a" fontSize="8">74% confidence</text>
        </g>

        {/* PF-1251: HERB — medium, Bilda stage */}
        <g transform="translate(480, 210)">
          {/* Sunlight beams from Bilda */}
          {Array.from({length: 5}).map((_, j) => (
            <line key={j} x1={-20 + j * 12} y1={-60} x2={-15 + j * 10} y2={-30} stroke="#f59e0b" strokeWidth={0.8} opacity={0.15 + j * 0.03} />
          ))}
          <path d="M 0,190 Q 1,140 2,100 Q 3,60 0,20" fill="none" stroke="#3d7a2a" strokeWidth={3} />
          <ellipse cx={-16} cy={120} rx={14} ry={6} fill="#2d6a1a" transform="rotate(20, -16, 120)" />
          <ellipse cx={14} cy={80} rx={12} ry={5} fill="#2d6a1a" transform="rotate(-15, 14, 80)" />
          <ellipse cx={-10} cy={50} rx={10} ry={4} fill="#2d5a1a" transform="rotate(10, -10, 50)" />
          <circle cx={0} cy={12} r={10} fill="#3b82f6" opacity={0.6} />
          <circle cx={0} cy={12} r={6} fill="#3b82f6" opacity={0.9} />
          <text x={0} y={208} textAnchor="middle" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="600">PF-1251</text>
          <text x={0} y={222} textAnchor="middle" fill="#3b82f6" fontSize="9" opacity={0.7}>budding</text>
          <text x={0} y={235} textAnchor="middle" fill="#71717a" fontSize="8">82% confidence</text>
        </g>

        {/* BUG-901: FRUIT TREE — critical, QA stage */}
        <g transform="translate(660, 120)">
          {/* Wind — QA testing */}
          {Array.from({length: 6}).map((_, j) => (
            <path key={j} d={`M ${-40 + j * 20},${30 + j * 15} Q ${-20 + j * 20},${25 + j * 15} ${j * 20},${30 + j * 15}`} fill="none" stroke="#06b6d4" strokeWidth={0.7} opacity={0.2}>
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur={`${2 + j * 0.3}s`} repeatCount="indefinite" />
            </path>
          ))}
          <path d="M 0,280 Q 2,220 4,160 Q 5,100 3,50 Q 2,20 0,0" fill="none" stroke="#4d8a3a" strokeWidth={4.5} />
          <path d="M 3,80 Q 20,60 35,50" fill="none" stroke="#4d8a3a" strokeWidth={2.5} />
          <ellipse cx={40} cy={47} rx={14} ry={7} fill="#2d6a1a" />
          <path d="M 4,130 Q -20,115 -30,105" fill="none" stroke="#4d8a3a" strokeWidth={2.5} />
          <ellipse cx={-35} cy={102} rx={14} ry={7} fill="#2d6a1a" />
          {/* Fruit */}
          <circle cx={0} cy={-5} r={16} fill="#22c55e" opacity={0.7} filter="url(#plantglow)" />
          <circle cx={0} cy={-5} r={10} fill="#22c55e" />
          <text x={0} y={-2} textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">91</text>
          {/* Small fruits */}
          <circle cx={30} cy={40} r={6} fill="#22c55e" opacity={0.5} />
          <circle cx={-25} cy={95} r={5} fill="#22c55e" opacity={0.4} />
          <text x={0} y={298} textAnchor="middle" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="600">BUG-901</text>
          <text x={0} y={312} textAnchor="middle" fill="#22c55e" fontSize="9" opacity={0.7}>fruiting — almost ripe</text>
          <text x={0} y={325} textAnchor="middle" fill="#71717a" fontSize="8">91% confidence</text>
        </g>

        {/* PF-1239: HARVEST READY — glowing */}
        <g transform="translate(850, 150)">
          <path d="M 0,250 Q 1,190 2,130 Q 3,80 1,30 Q 0,10 0,-5" fill="none" stroke="#5aaa4a" strokeWidth={5} />
          <path d="M 2,70 Q 25,50 40,45" fill="none" stroke="#5aaa4a" strokeWidth={3} />
          <ellipse cx={46} cy={42} rx={16} ry={8} fill="#3d7a2a" />
          <path d="M 1,120 Q -22,105 -35,100" fill="none" stroke="#5aaa4a" strokeWidth={3} />
          <ellipse cx={-41} cy={97} rx={16} ry={8} fill="#3d7a2a" />
          {/* Glowing harvest fruit */}
          <circle cx={0} cy={-12} r={20} fill="#22c55e" opacity={0.3} filter="url(#plantglow)">
            <animate attributeName="r" values="20;24;20" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={0} cy={-12} r={15} fill="#22c55e" opacity={0.8} />
          <text x={0} y={-8} textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">✓</text>
          <text x={0} y={268} textAnchor="middle" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="600">PF-1239</text>
          <text x={0} y={282} textAnchor="middle" fill="#22c55e" fontSize="9">harvest ready!</text>
          <text x={0} y={295} textAnchor="middle" fill="#22c55e" fontSize="8" opacity={0.6}>97% confidence</text>
        </g>

        {/* Greenhouse dome over compliance-sensitive tickets */}
        <path d="M 60,400 Q 60,100 150,100 Q 240,100 240,400" fill="none" stroke="#22c55e" strokeWidth={0.5} opacity={0.15} strokeDasharray="4 3" />
        <text x={150} y={115} textAnchor="middle" fill="#22c55e" fontSize="7" opacity={0.25}>🏠 compliance greenhouse</text>

        {/* Harvest basket */}
        <g transform="translate(20, 450)">
          <rect width={960} height={80} rx={10} fill="#0d0a04" stroke="#22c55e" strokeWidth={0.3} opacity={0.6} />
          <text x={20} y={22} fill="#22c55e" fontSize="10" fontFamily="monospace" opacity={0.5}>HARVEST BASKET — Sprint 14</text>
          {Array.from({length: 12}).map((_, i) => (
            <g key={`hb${i}`} transform={`translate(${20 + i * 78}, 32)`}>
              <rect width={68} height={38} rx={4} fill={`hsl(${130 + i * 6}, 25%, ${8 + i * 0.5}%)`} stroke="#22c55e" strokeWidth={0.3} />
              <text x={34} y={18} textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace" opacity={0.5}>#{1220 + i}</text>
              <text x={34} y={30} textAnchor="middle" fill="#52525b" fontSize="7">shipped</text>
            </g>
          ))}
        </g>

        {/* Weather legend */}
        <g transform="translate(20, 560)">
          <text x={0} y={0} fill="#52525b" fontSize="8" fontFamily="monospace">
            🌧 = Contexta investigating | ☀️ = Bilda building | 💨 = QA testing | 🏠 = Compliance monitoring | 🌱→🌻→🍎→✓ = growth stages
          </text>
        </g>
      </svg>
    </div>
  )
}

const departureMockups = [CanvasMockup, WarRoomMockup, MissionControlMockup, GardenMockup]

/* ============================================================
   AGENT REVIEW DIAGRAM — visual assessment per agent
   ============================================================ */

function AgentRadar({ agent }: { agent: typeof reviewData.agents[0] }) {
  // Render a simple radar/gauge showing the agent's evaluation areas
  const dims = [
    { label: 'UX Design', value: agent.name === 'Design Lead' ? 85 : agent.name === 'QA Engineer' ? 40 : agent.name === 'Product Marketing' ? 70 : 60 },
    { label: 'Tech Quality', value: agent.name === 'SWE' ? 80 : agent.name === 'Architect' ? 85 : agent.name === 'QA Engineer' ? 75 : 55 },
    { label: 'Industry Fit', value: agent.name === 'Cannabiz SME' ? 90 : agent.name === 'Product Marketing' ? 65 : 45 },
    { label: 'Scalability', value: agent.name === 'Architect' ? 78 : agent.name === 'SWE' ? 70 : 50 },
    { label: 'Market Ready', value: agent.name === 'Product Marketing' ? 75 : agent.name === 'Design Lead' ? 60 : 40 },
  ]
  return (
    <div className="rounded-lg bg-surface-2 border border-border p-3">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">Evaluation Focus</div>
      <div className="space-y-1.5">
        {dims.map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-[9px] text-text-tertiary w-20">{d.label}</span>
            <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: agent.color }} />
            </div>
            <span className="text-[9px] font-mono w-6 text-right" style={{ color: agent.color }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function AgentReview({ onBack }: AgentReviewProps) {
  const [tab, setTab] = useState<Tab>('agents')
  const [expandedAgent, setExpandedAgent] = useState<string | null>(reviewData.agents[0]?.name || null)
  const [expandedDeparture, setExpandedDeparture] = useState<number>(0)

  return (
    <div className="min-h-screen bg-surface-0 text-text-primary">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface-0/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none">
              <ArrowLeft size={14} /> Back to Rubicon
            </button>
            <span className="text-border">|</span>
            <span className="text-[15px] font-semibold">Agent Gang Thoughts on Rubicon</span>
          </div>
          <span className="text-[11px] text-text-tertiary font-mono">{reviewData.reviewDate} • 6 agents • deep review</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-surface-1 rounded-lg p-1 w-fit">
          {([
            { key: 'agents' as Tab, label: 'Agent Reviews', icon: Zap },
            { key: 'features' as Tab, label: `Feature Ideas (${reviewData.featureIdeas.length})`, icon: Lightbulb },
            { key: 'departures' as Tab, label: 'Design Departures (4)', icon: Compass },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-medium transition-all cursor-pointer border-none ${
                tab === t.key ? 'bg-surface-3 text-text-primary' : 'bg-transparent text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* AGENTS TAB */}
        {tab === 'agents' && (
          <div className="space-y-4">
            {/* Score overview — bigger */}
            <div className="grid grid-cols-6 gap-3 mb-6">
              {reviewData.agents.map(a => (
                <div key={a.name} className="rounded-lg bg-surface-1 border border-border p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-border-bright transition-all" onClick={() => setExpandedAgent(a.name)}>
                  <ScoreRing score={a.score} color={a.color} size={52} />
                  <span className="text-[12px] font-semibold text-center" style={{ color: a.color }}>{a.icon} {a.name}</span>
                  <span className="text-[10px] text-text-tertiary text-center leading-snug">{a.score >= 75 ? 'Positive' : a.score >= 55 ? 'Mixed' : 'Concerned'}</span>
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
                    className="w-full flex items-center justify-between p-5 cursor-pointer bg-transparent border-none text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px]" style={{ backgroundColor: `${agent.color}15` }}>{agent.icon}</div>
                      <div>
                        <div className="text-[14px] font-semibold text-text-primary">{agent.name}</div>
                        <div className="text-[12px] text-text-secondary mt-0.5 max-w-3xl leading-relaxed">{agent.verdict}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <ScoreRing score={agent.score} color={agent.color} size={48} />
                      {isExpanded ? <ChevronDown size={16} className="text-text-tertiary" /> : <ChevronRight size={16} className="text-text-tertiary" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-5 animate-fade-in-up">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Strengths */}
                        <div>
                          <div className="text-[10px] text-accent-green uppercase tracking-wider mb-2 font-medium">Strengths</div>
                          <div className="space-y-2">
                            {agent.strengths.map((s, i) => (
                              <div key={i} className="flex gap-2 text-[12px] text-text-secondary leading-relaxed">
                                <span className="text-accent-green mt-0.5 shrink-0">+</span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Concerns */}
                        <div>
                          <div className="text-[10px] text-accent-red uppercase tracking-wider mb-2 font-medium">Concerns</div>
                          <div className="space-y-2">
                            {agent.concerns.map((c, i) => (
                              <div key={i} className="flex gap-2 text-[12px] text-text-secondary leading-relaxed">
                                <span className="text-accent-red mt-0.5 shrink-0">!</span>
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Radar */}
                        <AgentRadar agent={agent} />
                      </div>

                      {/* Feature Ideas */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-2 font-medium" style={{ color: agent.color }}>Feature Ideas from {agent.name}</div>
                        <div className="grid grid-cols-2 gap-3">
                          {agent.featureIdeas.map((f, i) => (
                            <div key={i} className="p-4 rounded-lg bg-surface-2 border border-border">
                              <div className="text-[13px] font-semibold text-text-primary mb-1">{f.title}</div>
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
            <p className="text-[14px] text-text-secondary mb-6">
              {reviewData.featureIdeas.length} feature ideas from across the agent gang, ranked by impact. Top ideas include interactive concept mockups.
            </p>
            {['high', 'medium', 'low'].map(impact => {
              const features = reviewData.featureIdeas.filter(f => f.impact === impact)
              if (features.length === 0) return null
              return (
                <div key={impact}>
                  <div className="flex items-center gap-2 mb-3 mt-6">
                    <ImpactBadge level={impact} />
                    <span className="text-[11px] text-text-tertiary uppercase tracking-wider">impact ({features.length})</span>
                  </div>
                  <div className="space-y-3">
                    {features.map((f, i) => {
                      const agent = reviewData.agents.find(a => a.name === f.proposedBy)
                      const MockupComponent = featureMockups[f.title]
                      return (
                        <div key={i} className="rounded-lg bg-surface-1 border border-border overflow-hidden">
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {agent && <span className="text-[16px]" style={{ color: agent.color }}>{agent.icon}</span>}
                                <span className="text-[14px] font-semibold text-text-primary">{f.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ImpactBadge level={f.impact} />
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-3 text-text-tertiary uppercase tracking-wider">{f.effort} effort</span>
                              </div>
                            </div>
                            <div className="text-[13px] text-text-secondary mb-2 leading-relaxed">{f.description}</div>
                            <div className="text-[12px] text-text-tertiary leading-relaxed italic">"{f.rationale}"</div>
                            <div className="text-[11px] text-text-tertiary mt-2">— {f.proposedBy}</div>
                          </div>
                          {/* Inline concept mockup for top features */}
                          {MockupComponent && (
                            <div className="border-t border-border px-5 pb-5">
                              <MockupComponent />
                            </div>
                          )}
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
          <div className="space-y-6">
            <p className="text-[14px] text-text-secondary mb-6">
              Four radically different takes on what Rubicon could be. Not tweaks — fundamental rethinks. Each includes a high-fidelity interactive mockup.
            </p>
            {reviewData.designDepartures.map((dep, i) => {
              const isExpanded = expandedDeparture === i
              const colors = ['#a855f7', '#06b6d4', '#f59e0b', '#22c55e']
              return (
                <div key={i} className={`rounded-xl border transition-all ${isExpanded ? 'border-border-bright' : 'border-border'}`} style={isExpanded ? { boxShadow: `0 0 30px ${colors[i]}10` } : {}}>
                  <button
                    onClick={() => setExpandedDeparture(isExpanded ? -1 : i)}
                    className="w-full flex items-start justify-between p-6 cursor-pointer bg-transparent border-none text-left"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[11px] px-2.5 py-1 rounded-full font-mono font-semibold" style={{ backgroundColor: `${colors[i]}15`, color: colors[i] }}>
                          {i + 1}/4
                        </span>
                        <span className="text-[18px] font-bold text-text-primary">{dep.title}</span>
                      </div>
                      <div className="text-[14px] text-text-secondary italic ml-12">{dep.subtitle}</div>
                    </div>
                    {isExpanded ? <ChevronDown size={18} className="text-text-tertiary mt-1" /> : <ChevronRight size={18} className="text-text-tertiary mt-1" />}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-5 animate-fade-in-up">
                      {/* Full-width hi-fi mockup */}
                      {(() => { const Mockup = departureMockups[i]; return Mockup ? <Mockup /> : null })()}

                      {/* Description */}
                      <div className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-line max-w-4xl">
                        {dep.description}
                      </div>

                      {/* Key difference + inspirations side by side */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border-l-3" style={{ borderColor: colors[i], backgroundColor: `${colors[i]}08`, borderLeftWidth: 3 }}>
                          <div className="text-[10px] uppercase tracking-wider mb-2 font-semibold" style={{ color: colors[i] }}>Key Difference</div>
                          <div className="text-[13px] text-text-secondary leading-relaxed">{dep.keyDifference}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-surface-1 border border-border">
                          <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-3 font-semibold">Inspired By</div>
                          <div className="flex flex-wrap gap-2">
                            {dep.inspirations.map((insp, j) => (
                              <span key={j} className="text-[11px] px-2.5 py-1.5 rounded-lg bg-surface-2 border border-border text-text-secondary">{insp}</span>
                            ))}
                          </div>
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
