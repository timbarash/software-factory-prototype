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

function CanvasMockup() {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-[#0a0a0f] p-4">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-3 font-mono">The Canvas — Spatial SDLC Mockup</div>
      <svg viewBox="0 0 800 400" className="w-full" style={{ height: 280 }}>
        {/* Stage lanes */}
        {['Contexta', 'Plana', 'Bilda', 'QA', 'Merge'].map((s, i) => (
          <g key={s}>
            <rect x={i * 160} y={0} width={160} height={400} fill={i % 2 === 0 ? '#0f0f17' : '#12121a'} />
            <text x={i * 160 + 80} y={20} textAnchor="middle" fill="#52525b" fontSize="10" fontFamily="monospace">{s}</text>
            <line x1={i * 160} y1={30} x2={i * 160 + 160} y2={30} stroke="#1e1e2a" strokeWidth="0.5" />
          </g>
        ))}
        {/* Flow particles */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <circle key={`p${i}`} cx={100 + i * 90} cy={200} r={1.5} fill="#22c55e" opacity={0.3}>
            <animate attributeName="cx" from={i * 90} to={800} dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Ticket nodes */}
        <g>
          <rect x={30} y={60} width={100} height={60} rx={6} fill="#1a1a2e" stroke="#ef4444" strokeWidth={1.5} />
          <text x={80} y={80} textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">BUG-892</text>
          <text x={80} y={95} textAnchor="middle" fill="#a1a1aa" fontSize="8">Order Sync</text>
          <circle cx={80} cy={110} r={8} fill="none" stroke="#ef4444" strokeWidth={1.5} />
          <text x={80} y={113} textAnchor="middle" fill="#ef4444" fontSize="7">28</text>
          <circle cx={30} cy={60} r={3} fill="#ef4444" opacity={0.6}><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" /></circle>
        </g>
        <g>
          <rect x={200} y={140} width={100} height={60} rx={6} fill="#1a1a2e" stroke="#3b82f6" strokeWidth={1} />
          <text x={250} y={160} textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="monospace">PF-1247</text>
          <text x={250} y={175} textAnchor="middle" fill="#a1a1aa" fontSize="8">Bulk Actions</text>
          <circle cx={250} cy={190} r={8} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
          <text x={250} y={193} textAnchor="middle" fill="#f59e0b" fontSize="7">74</text>
        </g>
        <g>
          <rect x={350} y={80} width={100} height={60} rx={6} fill="#1a1a2e" stroke="#3b82f6" strokeWidth={1} />
          <text x={400} y={100} textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="monospace">PF-1251</text>
          <text x={400} y={115} textAnchor="middle" fill="#a1a1aa" fontSize="8">Inventory Alerts</text>
          <circle cx={400} cy={130} r={8} fill="none" stroke="#22c55e" strokeWidth={1.5} />
          <text x={400} y={133} textAnchor="middle" fill="#22c55e" fontSize="7">82</text>
        </g>
        <g>
          <rect x={520} y={100} width={100} height={60} rx={6} fill="#1a1a2e" stroke="#ef4444" strokeWidth={1.5} />
          <text x={570} y={120} textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">BUG-901</text>
          <text x={570} y={135} textAnchor="middle" fill="#a1a1aa" fontSize="8">Payment Fix</text>
          <circle cx={570} cy={150} r={8} fill="none" stroke="#22c55e" strokeWidth={1.5} />
          <text x={570} y={153} textAnchor="middle" fill="#22c55e" fontSize="7">91</text>
        </g>
        <g>
          <rect x={680} y={60} width={100} height={60} rx={6} fill="#1a1a2e" stroke="#22c55e" strokeWidth={1.5} />
          <text x={730} y={80} textAnchor="middle" fill="#22c55e" fontSize="9" fontFamily="monospace">PF-1239</text>
          <text x={730} y={95} textAnchor="middle" fill="#a1a1aa" fontSize="8">CSV Export</text>
          <text x={730} y={112} textAnchor="middle" fill="#22c55e" fontSize="8">✓ Ready</text>
        </g>
        {/* Connection lines */}
        <line x1={130} y1={90} x2={200} y2={170} stroke="#a855f7" strokeWidth={0.5} opacity={0.3} strokeDasharray="4 4" />
        <line x1={300} y1={170} x2={350} y2={110} stroke="#06b6d4" strokeWidth={0.5} opacity={0.3} strokeDasharray="4 4" />
        <line x1={450} y1={110} x2={520} y2={130} stroke="#f59e0b" strokeWidth={0.5} opacity={0.3} strokeDasharray="4 4" />
        <line x1={620} y1={130} x2={680} y2={90} stroke="#22c55e" strokeWidth={0.5} opacity={0.3} strokeDasharray="4 4" />
        {/* Multiplayer cursors */}
        <g transform="translate(540, 170)">
          <polygon points="0,0 0,12 4,9" fill="#a855f7" /><text x={6} y={12} fill="#a855f7" fontSize="7">Sarah</text>
        </g>
        <g transform="translate(90, 130)">
          <polygon points="0,0 0,12 4,9" fill="#06b6d4" /><text x={6} y={12} fill="#06b6d4" fontSize="7">Mike</text>
        </g>
        {/* Shipped zone */}
        <rect x={0} y={300} width={800} height={100} fill="#0d1117" rx={0} />
        <text x={20} y={320} fill="#22c55e" fontSize="9" fontFamily="monospace" opacity={0.5}>SHIPPED</text>
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
          <rect key={`s${i}`} x={20 + i * 65} y={330} width={55} height={50} rx={3} fill={`hsl(${140 + i * 15}, 40%, ${12 + i}%)`} stroke="#22c55e" strokeWidth={0.3} opacity={0.5} />
        ))}
      </svg>
    </div>
  )
}

function WarRoomMockup() {
  const msgs = [
    { agent: 'You', color: '#e2e8f0', text: "what's the highest priority right now?" },
    { agent: 'Contexta', color: '#a855f7', text: 'BUG-892 — Order sync fails silently for multi-location retailers. 23 affected users, $12K/day revenue at risk. Root cause unclear — investigating race condition in location resolver.' },
    { agent: 'Cannabiz SME', color: '#22c55e', text: "⚠️ Compliance flag: multi-location sync failures mean Metrc track-and-trace reports may be diverging across locations. If regulators audit during this window, that's a violation." },
    { agent: 'QA', color: '#06b6d4', text: 'I can prep a 3-location staging environment. Need ~20 min to set up test fixtures. Regression risk is HIGH — order flow is critical path.' },
    { agent: 'Plana', color: '#f59e0b', text: 'Blocked on Contexta diagnosis. Likely involves order-sync-worker + location-cache. @Contexta can you check the cache TTL config?' },
    { agent: 'Contexta', color: '#a855f7', text: 'Cache TTL is 300s but location resolver is using stale reads. Found it — the sync worker reads location config at startup, not per-request. Stale after any location CRUD.' },
  ]
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-[#0a0a0f]">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-surface-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-text-tertiary uppercase tracking-wider font-mono">The War Room — Conversational SDLC Mockup</span>
        </div>
        <div className="flex gap-1.5">
          {['#general', '#BUG-892', '#PF-1247'].map(ch => (
            <span key={ch} className={`text-[9px] px-2 py-0.5 rounded ${ch === '#BUG-892' ? 'bg-accent-red/20 text-accent-red' : 'bg-surface-3 text-text-tertiary'}`}>{ch}</span>
          ))}
        </div>
      </div>
      <div className="p-3 space-y-2.5 max-h-[300px] overflow-hidden">
        {msgs.map((m, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold mt-0.5" style={{ backgroundColor: `${m.color}20`, color: m.color }}>{m.agent[0]}</div>
            <div>
              <span className="text-[10px] font-semibold" style={{ color: m.color }}>{m.agent}</span>
              <span className="text-[9px] text-text-tertiary ml-2">just now</span>
              <div className="text-[11px] text-text-secondary leading-relaxed mt-0.5">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-border flex items-center gap-2">
        <div className="flex-1 bg-surface-2 rounded px-3 py-1.5 text-[11px] text-text-tertiary border border-border">@Bilda can you hot-fix the location resolver to read per-request?</div>
        <div className="w-6 h-6 rounded bg-accent-green flex items-center justify-center text-[10px] text-black font-bold">↵</div>
      </div>
    </div>
  )
}

function MissionControlMockup() {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-[#0a0a0f]">
      <div className="px-3 py-1.5 border-b border-border bg-surface-1">
        <span className="text-[9px] text-text-tertiary uppercase tracking-wider font-mono">Mission Control — Ambient SDLC Mockup</span>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-px bg-border" style={{ height: 320 }}>
        {/* Pipeline Flow - spans full top */}
        <div className="col-span-3 bg-[#0a0a0f] p-3">
          <div className="text-[8px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">Pipeline Flow</div>
          <div className="flex gap-0.5 h-full items-start">
            {['Contexta', 'Plana', 'Bilda', 'QA', 'Merge'].map((stage, si) => (
              <div key={stage} className="flex-1 h-16 rounded bg-surface-1/50 border border-border/30 p-1.5 relative overflow-hidden">
                <div className="text-[7px] text-text-tertiary font-mono mb-1">{stage}</div>
                <div className="flex gap-1 flex-wrap">
                  {si === 0 && <>
                    <div className="w-5 h-4 rounded-sm bg-red-500/30 border border-red-500/50" title="BUG-892"><div className="w-full h-0.5 bg-red-500 animate-pulse" /></div>
                    <div className="w-4 h-3 rounded-sm bg-blue-500/20 border border-blue-500/30" />
                  </>}
                  {si === 1 && <div className="w-5 h-4 rounded-sm bg-blue-500/20 border border-blue-500/30" />}
                  {si === 2 && <>
                    <div className="w-5 h-4 rounded-sm bg-blue-500/30 border border-blue-500/50" />
                    <div className="w-4 h-3 rounded-sm bg-yellow-500/20 border border-yellow-500/30" />
                  </>}
                  {si === 3 && <div className="w-6 h-5 rounded-sm bg-red-500/30 border border-red-500/50"><div className="w-full h-0.5 bg-green-500 mt-1" /></div>}
                  {si === 4 && <div className="w-5 h-4 rounded-sm bg-green-500/30 border border-green-500/50">
                    <div className="text-[6px] text-green-400 text-center">✓</div>
                  </div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Agent Vital Signs - bottom left */}
        <div className="col-span-1 bg-[#0a0a0f] p-3">
          <div className="text-[8px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">Agent Vital Signs</div>
          <div className="space-y-1.5">
            {[
              { name: 'Contexta', color: '#a855f7', load: 85 },
              { name: 'Plana', color: '#3b82f6', load: 40 },
              { name: 'Bilda', color: '#f59e0b', load: 72 },
              { name: 'QA', color: '#06b6d4', load: 60 },
              { name: 'Cannabiz', color: '#22c55e', load: 30 },
            ].map(a => (
              <div key={a.name} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-[8px] text-text-tertiary w-14 font-mono">{a.name}</span>
                <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${a.load}%`, backgroundColor: a.color }} />
                </div>
                <span className="text-[8px] font-mono" style={{ color: a.color }}>{a.load}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Focus Panel - bottom center */}
        <div className="col-span-1 bg-[#0a0a0f] p-3 border-l border-r border-border/30">
          <div className="text-[8px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">Focus Panel (hover)</div>
          <div className="rounded bg-surface-1 border border-border p-2">
            <div className="text-[9px] text-red-400 font-mono mb-1">BUG-892</div>
            <div className="text-[8px] text-text-secondary mb-1.5">Order sync — multi-location</div>
            <div className="flex gap-1 mb-1.5">
              <span className="text-[7px] px-1 py-0.5 rounded bg-red-500/15 text-red-400">CRITICAL</span>
              <span className="text-[7px] px-1 py-0.5 rounded bg-surface-3 text-text-tertiary">28%</span>
            </div>
            <div className="h-6 bg-surface-2 rounded font-mono text-[7px] text-green-400 p-1 overflow-hidden">$ investigating cache TTL...</div>
          </div>
        </div>
        {/* Alert Feed - bottom right */}
        <div className="col-span-1 bg-[#0a0a0f] p-3">
          <div className="text-[8px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">Alert Feed</div>
          <div className="space-y-1.5">
            {[
              { text: 'BUG-892 needs human input', color: '#ef4444', time: '2m' },
              { text: 'PF-1239 ready to merge', color: '#22c55e', time: '5m' },
              { text: 'QA confidence dropped 91→85', color: '#f59e0b', time: '8m' },
              { text: 'Compliance: Metrc divergence', color: '#ef4444', time: '12m' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <span className="text-[8px] text-text-secondary flex-1 truncate">{a.text}</span>
                <span className="text-[7px] text-text-tertiary shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GardenMockup() {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-[#0a0a0f] p-4">
      <div className="text-[9px] text-text-tertiary uppercase tracking-wider mb-3 font-mono">The Garden — Organic SDLC Mockup</div>
      <svg viewBox="0 0 800 350" className="w-full" style={{ height: 260 }}>
        {/* Ground */}
        <rect x={0} y={280} width={800} height={70} fill="#1a1208" rx={0} />
        <rect x={0} y={280} width={800} height={3} fill="#2d4a1a" opacity={0.5} />
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050510" />
            <stop offset="100%" stopColor="#0a0f0a" />
          </linearGradient>
          <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d1f0a" />
            <stop offset="100%" stopColor="#1a1208" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={800} height={280} fill="url(#sky)" />
        {/* BUG-892: wilting red rose (critical, low confidence) */}
        <g transform="translate(100, 180)">
          <line x1={0} y1={100} x2={-5} y2={30} stroke="#3d5a2a" strokeWidth={2} />
          <line x1={-5} y1={50} x2={-20} y2={35} stroke="#3d5a2a" strokeWidth={1} />
          <circle cx={-5} cy={25} r={10} fill="#ef4444" opacity={0.6} />
          <circle cx={-5} cy={25} r={6} fill="#ef4444" opacity={0.8} />
          <line x1={-20} y1={30} x2={-25} y2={45} stroke="#8b4513" strokeWidth={0.5} />
          <text x={-5} y={115} textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">BUG-892</text>
          <text x={-5} y={125} textAnchor="middle" fill="#a1a1aa" fontSize="7">wilting 🥀</text>
          {/* Rain (Contexta investigating) */}
          {[0,1,2].map(j => (
            <line key={j} x1={-15 + j * 15} y1={-10} x2={-18 + j * 15} y2={0} stroke="#a855f7" strokeWidth={0.5} opacity={0.4}>
              <animate attributeName="y1" values="-20;5" dur={`${0.8 + j * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="y2" values="-10;15" dur={`${0.8 + j * 0.2}s`} repeatCount="indefinite" />
            </line>
          ))}
        </g>
        {/* PF-1247: growing sunflower (high, medium confidence) */}
        <g transform="translate(270, 140)">
          <line x1={0} y1={140} x2={0} y2={30} stroke="#3d7a2a" strokeWidth={3} />
          <line x1={0} y1={80} x2={-25} y2={60} stroke="#3d7a2a" strokeWidth={1.5} />
          <ellipse cx={-28} cy={58} rx={8} ry={5} fill="#2d5a1a" />
          <line x1={0} y1={60} x2={20} y2={45} stroke="#3d7a2a" strokeWidth={1.5} />
          <ellipse cx={23} cy={43} rx={8} ry={5} fill="#2d5a1a" />
          <circle cx={0} cy={22} r={16} fill="#f59e0b" opacity={0.7} />
          <circle cx={0} cy={22} r={9} fill="#92400e" />
          <text x={0} y={155} textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">PF-1247</text>
          <text x={0} y={165} textAnchor="middle" fill="#a1a1aa" fontSize="7">flowering 🌻</text>
        </g>
        {/* PF-1251: healthy plant in Bilda (sunlight) */}
        <g transform="translate(430, 150)">
          <line x1={0} y1={130} x2={0} y2={40} stroke="#3d7a2a" strokeWidth={2.5} />
          <line x1={0} y1={70} x2={-18} y2={55} stroke="#3d7a2a" strokeWidth={1.5} />
          <ellipse cx={-22} cy={52} rx={9} ry={5} fill="#2d6a1a" />
          <circle cx={0} cy={32} r={12} fill="#3b82f6" opacity={0.6} />
          <circle cx={0} cy={32} r={7} fill="#3b82f6" opacity={0.9} />
          {/* Sunlight (Bilda building) */}
          {[0,1,2,3].map(j => (
            <line key={j} x1={-15 + j * 10} y1={-10} x2={-10 + j * 8} y2={10} stroke="#f59e0b" strokeWidth={0.5} opacity={0.3} />
          ))}
          <text x={0} y={145} textAnchor="middle" fill="#3b82f6" fontSize="8" fontFamily="monospace">PF-1251</text>
          <text x={0} y={155} textAnchor="middle" fill="#a1a1aa" fontSize="7">leafing 🌿</text>
        </g>
        {/* BUG-901: nearly fruiting (QA wind) */}
        <g transform="translate(580, 120)">
          <line x1={0} y1={160} x2={3} y2={30} stroke="#3d8a2a" strokeWidth={3} />
          <line x1={2} y1={60} x2={25} y2={40} stroke="#3d8a2a" strokeWidth={2} />
          <ellipse cx={30} cy={37} rx={10} ry={6} fill="#2d6a1a" />
          <line x1={1} y1={90} x2={-22} y2={75} stroke="#3d8a2a" strokeWidth={2} />
          <ellipse cx={-27} cy={72} rx={10} ry={6} fill="#2d6a1a" />
          <circle cx={3} cy={22} r={14} fill="#22c55e" opacity={0.7} />
          <circle cx={3} cy={22} r={8} fill="#22c55e" />
          <text x={3} y={175} textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace">BUG-901</text>
          <text x={3} y={185} textAnchor="middle" fill="#a1a1aa" fontSize="7">fruiting 🍎</text>
          {/* Wind lines (QA testing) */}
          {[0,1,2].map(j => (
            <path key={j} d={`M ${-30 + j * 20},${20 + j * 10} Q ${-15 + j * 20},${15 + j * 10} ${j * 20},${20 + j * 10}`} fill="none" stroke="#06b6d4" strokeWidth={0.5} opacity={0.3} />
          ))}
        </g>
        {/* PF-1239: harvest ready */}
        <g transform="translate(720, 130)">
          <line x1={0} y1={150} x2={0} y2={20} stroke="#4d9a3a" strokeWidth={3.5} />
          <line x1={0} y1={50} x2={-28} y2={30} stroke="#4d9a3a" strokeWidth={2} />
          <ellipse cx={-33} cy={27} rx={11} ry={6} fill="#3d7a2a" />
          <line x1={0} y1={70} x2={25} y2={55} stroke="#4d9a3a" strokeWidth={2} />
          <ellipse cx={30} cy={52} rx={11} ry={6} fill="#3d7a2a" />
          <circle cx={0} cy={12} r={16} fill="#22c55e" opacity={0.9} />
          <text x={0} y={15} textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">✓</text>
          <text x={0} y={165} textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace">PF-1239</text>
          <text x={0} y={175} textAnchor="middle" fill="#22c55e" fontSize="7">harvest! 🌾</text>
        </g>
        {/* Harvest basket */}
        <rect x={650} y={300} width={130} height={40} rx={8} fill="#1a1a0f" stroke="#22c55e" strokeWidth={0.5} opacity={0.6} />
        <text x={715} y={322} textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace" opacity={0.6}>🧺 3 harvested this sprint</text>
      </svg>
    </div>
  )
}

const departureMockups = [CanvasMockup, WarRoomMockup, MissionControlMockup, GardenMockup]

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
                      {/* Hi-fi mockup */}
                      {(() => { const Mockup = departureMockups[i]; return Mockup ? <Mockup /> : null })()}

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
