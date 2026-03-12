import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'

interface WalkthroughProps {
  onClose: () => void;
  musicSrc?: string;
  autoStart?: boolean;
}

interface Slide {
  label: string;
  headline: string;
  subtext?: string;
  visual: 'problem' | 'hotlist' | 'terminal' | 'compliance' | 'agents' | 'outcome';
  hasPeon?: boolean;
  duration: number;
}

const slides: Slide[] = [
  {
    label: 'THE PROBLEM',
    headline: 'Your backlog has 347 tickets. Your team has 4 engineers.',
    subtext: 'Triage takes longer than building. Context is scattered. Every ticket feels urgent.',
    visual: 'problem',
    duration: 4500,
  },
  {
    label: 'THE HOTLIST',
    headline: 'Rubicon triages everything. You work on what matters.',
    subtext: 'Four AI agents assess every bug and feature request — readiness scores, complexity, human input needed.',
    visual: 'hotlist',
    duration: 5000,
  },
  {
    label: 'THE TERMINAL',
    headline: 'Claude Code at the center. Agents at the edges.',
    subtext: 'A terminal processes each ticket through 5 SDLC stages while expert agents watch every move.',
    visual: 'terminal',
    duration: 5500,
  },
  {
    label: 'THE COMPLIANCE GHOST',
    headline: 'An invisible auditor watches every change.',
    subtext: 'The Compliance Ghost scans for regulatory risk across Metrc, BioTrack, OLCC, and DCC — flagging violations before they reach production.',
    visual: 'compliance',
    duration: 5500,
  },
  {
    label: 'THE AGENTS',
    headline: 'Seven persistent experts. Zero meetings.',
    subtext: 'Each reviewing from their domain. Real-time thoughts, not async reviews.',
    visual: 'agents',
    hasPeon: true,
    duration: 5000,
  },
  {
    label: 'THE OUTCOME',
    headline: 'From ticket to merge. Agents think. You decide.',
    subtext: 'Confidence scores tell you when to trust. Human input flags tell you when they need you.',
    visual: 'outcome',
    duration: 5000,
  },
]

/* ── Visual Components ────────────────────────────────── */

function ProblemVisual() {
  const items = [
    { id: 'BUG-341', text: 'Login fails on Safari', age: '12d', status: '???' },
    { id: 'PF-892', text: 'Add bulk export', age: '34d', status: 'needs spec' },
    { id: 'BUG-127', text: 'Race condition in sync', age: '3d', status: 'P0??' },
    { id: 'PF-445', text: 'Dashboard redesign', age: '67d', status: 'blocked' },
    { id: 'BUG-903', text: 'Memory leak in worker', age: '1d', status: 'no repro' },
    { id: 'PF-661', text: 'API rate limiting', age: '21d', status: 'who owns this' },
  ]
  return (
    <div className="bg-surface-2 rounded-lg border border-border p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-3 text-[11px] text-text-tertiary">
        <div className="w-2.5 h-2.5 rounded-full bg-accent-red" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
        <span className="ml-2 font-mono">backlog_FINAL_v3_USE_THIS.csv</span>
      </div>
      <div className="space-y-1">
        <div className="grid grid-cols-5 gap-2 text-[10px] text-text-tertiary uppercase tracking-wider pb-1 border-b border-border">
          <span>Ticket</span><span>Title</span><span>Age</span><span>Status</span><span>Owner</span>
        </div>
        {items.map((item, i) => (
          <div key={item.id} className="grid grid-cols-5 gap-2 text-[12px] py-1.5 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <span className="font-mono text-text-tertiary">{item.id}</span>
            <span className="text-text-secondary">{item.text}</span>
            <span className="text-accent-red">{item.age}</span>
            <span className="text-accent-amber">{item.status}</span>
            <span className="text-text-tertiary">—</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-border text-[11px] text-accent-red text-center">
        347 tickets. 0 confidence scores. No agent analysis. Pure chaos.
      </div>
    </div>
  )
}

function HotlistVisual() {
  const items = [
    { id: 'BUG-901', title: 'Payment timeout >$5K', severity: 'critical', confidence: 91, stage: 'QA', color: '#ef4444' },
    { id: 'BUG-892', title: 'Sync fails multi-location', severity: 'critical', confidence: 28, stage: 'Contexta', color: '#ef4444' },
    { id: 'PF-1247', title: 'Bulk action toolbar', severity: 'high', confidence: 74, stage: 'Plana', color: '#f59e0b' },
  ]
  return (
    <div className="max-w-2xl mx-auto space-y-2">
      {items.map((item, i) => (
        <div key={item.id} className="bg-surface-2 rounded-lg border border-border p-3 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.color }} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-text-tertiary">{item.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase" style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.severity}</span>
              </div>
              <span className="text-[13px] text-text-primary">{item.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-accent-green">{item.stage}</span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.confidence}%`, backgroundColor: item.confidence >= 80 ? '#22c55e' : item.confidence >= 50 ? '#f59e0b' : '#ef4444' }} />
              </div>
              <span className="text-[11px] font-mono" style={{ color: item.confidence >= 80 ? '#22c55e' : item.confidence >= 50 ? '#f59e0b' : '#ef4444' }}>{item.confidence}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TerminalVisual() {
  const [line, setLine] = useState(0)
  const lines = [
    { text: '> claude --ticket BUG-892 --stage contexta', color: '#4ade80' },
    { text: '', color: '' },
    { text: '* Contexta Agent - Investigating...', color: '#a855f7' },
    { text: '  \u2713 Queried Datadog: 847 orders stuck in pending', color: '#22c55e' },
    { text: '  \u2713 Root cause: stale location cache (TTL: 24h)', color: '#22c55e' },
    { text: '  \u2717 Missing: error logging in sync worker', color: '#ef4444' },
    { text: '  ! HUMAN INPUT NEEDED: Confirm cache TTL change', color: '#f59e0b' },
  ]
  useEffect(() => {
    const timer = setInterval(() => setLine(l => l < lines.length ? l + 1 : l), 250)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="bg-terminal-bg rounded-lg border border-border max-w-2xl mx-auto overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-2 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-accent-red/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent-amber/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent-green/70" />
        <span className="text-[11px] text-text-tertiary font-mono ml-2">claude - BUG-892 - Contexta</span>
      </div>
      <div className="p-4 font-mono text-[12px] space-y-1">
        {lines.slice(0, line).map((l, i) => (
          <div key={i} className="animate-fade-in-up" style={{ color: l.color || '#a1a1aa', animationDelay: `${i * 80}ms` }}>{l.text || '\u00A0'}</div>
        ))}
        {line >= lines.length && <div><span className="text-terminal-green">{'>'}</span> <span className="terminal-cursor" /></div>}
      </div>
    </div>
  )
}

function AgentsVisual({ hasPeon }: { hasPeon?: boolean }) {
  const agents = [
    { icon: '\u25C6', name: 'Design Lead', thought: 'Silent failures are critical UX debt', color: '#a855f7' },
    { icon: '\u25C7', name: 'QA Engineer', thought: 'Need 3-location test fixture', color: '#06b6d4' },
    { icon: '\u2B21', name: 'SWE', thought: 'Check TTL on location-resolver cache', color: '#3b82f6' },
    { icon: '\u25C8', name: 'Cannabiz SME', thought: 'Dispensaries losing $12K/day — customers order online, show up, product isn\'t there', color: '#f59e0b' },
    { icon: '\u2B22', name: 'Architect', thought: 'Add circuit breaker pattern', color: '#22c55e' },
    { icon: '\u25C9', name: 'Product Marketing', thought: 'Reliability is our brand story', color: '#ef4444' },
    { icon: '👻', name: 'Compliance Ghost', thought: '3 jurisdictions at active violation risk — block merge', color: '#ec4899' },
  ]
  return (
    <div className="max-w-2xl mx-auto grid grid-cols-2 gap-2 relative">
      {agents.map((agent, i) => (
        <div key={agent.name} className="bg-surface-2 rounded-lg border border-border p-3 flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
          <span style={{ color: agent.color }} className="text-[14px]">{agent.icon}</span>
          <div>
            <div className="text-[12px] font-medium text-text-primary">{agent.name}</div>
            <div className="text-[11px] text-text-secondary mt-0.5">"{agent.thought}"</div>
          </div>
        </div>
      ))}
      {hasPeon && (
        <div className="absolute -bottom-8 right-4 text-[10px] text-text-tertiary/50 italic cursor-help animate-fade-in-up" style={{ animationDelay: '800ms' }} title="Work work.">
          <span className="inline-block" style={{ transform: 'scaleX(-1)' }}><span className="text-[16px]">&#x1F528;</span></span>
          <span className="ml-1 opacity-60">"Something need doing?"</span>
          <span className="ml-2 opacity-40">"Work work."</span>
        </div>
      )}
    </div>
  )
}

function ComplianceVisual() {
  const [scanLine, setScanLine] = useState(0)
  const flags = [
    { jurisdiction: 'Colorado', system: 'MED/Metrc', risk: 'violation', detail: 'Order sync failure causing Metrc report divergence' },
    { jurisdiction: 'Oregon', system: 'OLCC/Metrc', risk: 'violation', detail: 'Unsynced orders not reporting to state track-and-trace' },
    { jurisdiction: 'California', system: 'DCC/CCTT', risk: 'warning', detail: 'Multi-location inventory counts may mismatch state records' },
  ]
  useEffect(() => {
    const timer = setInterval(() => setScanLine(l => l < flags.length ? l + 1 : l), 600)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface-2 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-3 border-b border-border">
          <span className="text-[16px]">👻</span>
          <span className="text-[12px] font-medium text-pink-400">Compliance Ghost</span>
          <span className="text-[10px] text-text-tertiary">— Scanning BUG-892</span>
          <span className="ml-auto text-[10px] text-accent-red font-mono" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}>● SCANNING</span>
        </div>
        <div className="p-4 space-y-2">
          {flags.slice(0, scanLine).map((flag, i) => (
            <div key={i} className={`rounded p-3 border animate-fade-in-up ${
              flag.risk === 'violation' ? 'bg-accent-red/5 border-accent-red/20' : 'bg-accent-amber/5 border-accent-amber/20'
            }`} style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-mono font-bold ${flag.risk === 'violation' ? 'text-accent-red' : 'text-accent-amber'}`}>
                  {flag.risk.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-tertiary">{flag.system}</span>
                  <span className="text-[11px] text-text-secondary font-medium">{flag.jurisdiction}</span>
                </div>
              </div>
              <div className={`text-[12px] ${flag.risk === 'violation' ? 'text-accent-red' : 'text-accent-amber'}`}>
                {flag.detail}
              </div>
            </div>
          ))}
          {scanLine >= flags.length && (
            <div className="text-center pt-2 text-[11px] text-pink-400 animate-fade-in-up">
              👻 3 jurisdictions at risk — recommend blocking merge until reconciliation complete
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OutcomeVisual() {
  const stages = ['Contexta', 'Plana', 'Bilda', 'QA', 'Merge']
  const [activeStage, setActiveStage] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setActiveStage(s => s < stages.length - 1 ? s + 1 : s), 500)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono transition-all duration-300 ${i <= activeStage ? 'bg-accent-green text-surface-0' : 'bg-surface-3 text-text-tertiary'}`}>
              {i < activeStage ? '\u2713' : i + 1}
            </div>
            <span className={`text-[12px] transition-colors duration-300 ${i <= activeStage ? 'text-accent-green' : 'text-text-tertiary'}`}>{stage}</span>
            {i < stages.length - 1 && <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${i < activeStage ? 'bg-accent-green' : 'bg-surface-3'}`} />}
          </div>
        ))}
      </div>
      <div className="bg-surface-2 rounded-lg border border-border p-4 text-center animate-fade-in-up">
        <div className="text-[32px] font-bold text-accent-green mb-1">91%</div>
        <div className="text-[13px] text-text-secondary">Confidence Score</div>
        <div className="text-[11px] text-text-tertiary mt-2">Agents recommend: ready for merge. No human input required.</div>
      </div>
    </div>
  )
}

/* ── Main Walkthrough ─────────────────────────────────── */

export function Walkthrough({ onClose, musicSrc, autoStart }: WalkthroughProps) {
  const [started, setStarted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [slideProgress, setSlideProgress] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const slideStartRef = useRef(Date.now())

  const fadeOutRef = useRef<number | null>(null)

  // Direct DOM play — called synchronously from click handler
  const playAudio = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = 0.35
    el.play().then(() => {
      console.log('Audio playing successfully')
    }).catch((e) => {
      console.warn('Audio play blocked:', e)
    })
  }, [])

  // Gradual music fadeout over ~3 seconds
  const fadeOutMusic = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    if (fadeOutRef.current) clearInterval(fadeOutRef.current)
    const steps = 30
    const stepDuration = 100 // 3s total
    let step = 0
    const startVol = el.volume
    fadeOutRef.current = window.setInterval(() => {
      step++
      el.volume = Math.max(0, startVol * (1 - step / steps))
      if (step >= steps) {
        if (fadeOutRef.current) clearInterval(fadeOutRef.current)
        el.pause()
        el.volume = 0.35 // reset for potential replay
      }
    }, stepDuration)
  }, [])

  // Click handler for splash screen
  const handleStart = useCallback(() => {
    setStarted(true)
    playAudio()
  }, [playAudio])

  // Auto-start from marketing page (user already clicked)
  useEffect(() => {
    if (autoStart && audioRef.current) {
      setStarted(true)
      // Small delay to ensure DOM is ready
      setTimeout(() => playAudio(), 50)
    }
  }, [autoStart, playAudio])

  // Slide navigation
  const changeSlide = useCallback((idx: number) => {
    if (idx === currentSlide || idx < 0 || idx >= slides.length) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(idx)
      slideStartRef.current = Date.now()
      setSlideProgress(0)
      setTimeout(() => setTransitioning(false), 30)
    }, 150)
  }, [currentSlide])

  const nextSlide = useCallback(() => changeSlide(currentSlide + 1), [currentSlide, changeSlide])
  const prevSlide = useCallback(() => changeSlide(currentSlide - 1), [currentSlide, changeSlide])

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || !started) return
    slideStartRef.current = Date.now()
    const dur = slides[currentSlide].duration
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) nextSlide()
      else {
        fadeOutMusic()
        setIsPlaying(false)
      }
    }, dur)
    const prog = setInterval(() => {
      const elapsed = Date.now() - slideStartRef.current
      setSlideProgress(Math.min(elapsed / dur, 1))
    }, 50)
    return () => { clearTimeout(timer); clearInterval(prog) }
  }, [isPlaying, currentSlide, nextSlide, started, fadeOutMusic])

  // Play/pause/mute sync
  useEffect(() => {
    const el = audioRef.current
    if (!el || !started) return
    el.muted = isMuted
    if (isPlaying) el.play().catch(() => {})
    else el.pause()
  }, [isPlaying, isMuted, started])

  // Cleanup fadeout on unmount
  useEffect(() => {
    return () => { if (fadeOutRef.current) clearInterval(fadeOutRef.current) }
  }, [])

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === ' ') { e.preventDefault(); setIsPlaying(p => !p) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, nextSlide, prevSlide])

  const slide = slides[currentSlide]

  // SINGLE return — audio element is ALWAYS in the DOM, never destroyed
  return (
    <div className="fixed inset-0 z-50 bg-surface-0 flex flex-col overflow-hidden">
      {/* Audio element — always mounted, never conditional */}
      {musicSrc && (
        <audio
          ref={audioRef}
          src={musicSrc}
          loop
          preload="auto"
          playsInline
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
        />
      )}

      {/* SPLASH SCREEN */}
      {!started && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary cursor-pointer">
            <X size={18} />
          </button>
          <button onClick={handleStart} className="group flex flex-col items-center gap-6 bg-transparent border-none cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-accent-green/10 border-2 border-accent-green flex items-center justify-center group-hover:bg-accent-green/20 transition-all group-hover:scale-110 duration-200">
              <Play size={32} className="text-accent-green ml-1" />
            </div>
            <div className="text-center">
              <h2 className="text-[24px] font-bold text-text-primary mb-2">Rubicon Walkthrough</h2>
              <p className="text-[14px] text-text-secondary">Click to play with music</p>
            </div>
          </button>
        </div>
      )}

      {/* WALKTHROUGH CONTENT (behind splash until started) */}
      {started && (
        <>
          <button onClick={onClose} className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary cursor-pointer">
            <X size={18} />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full transition-all duration-150" style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(12px) scale(0.98)' : 'translateY(0) scale(1)' }}>
              <div className="text-[11px] text-accent-green bg-accent-green/10 px-3 py-1 rounded-full border border-accent-green/20 mb-4 uppercase tracking-wider">
                {slide.label}
                <span className="ml-2 text-text-tertiary">{currentSlide + 1} / {slides.length}</span>
              </div>
              <h2 className="text-[28px] font-bold text-text-primary text-center max-w-3xl mb-3 leading-tight tracking-tight">{slide.headline}</h2>
              {slide.subtext && <p className="text-[14px] text-text-secondary text-center max-w-xl mb-8">{slide.subtext}</p>}
              <div className="w-full max-w-3xl" key={currentSlide}>
                {slide.visual === 'problem' && <ProblemVisual />}
                {slide.visual === 'hotlist' && <HotlistVisual />}
                {slide.visual === 'terminal' && <TerminalVisual />}
                {slide.visual === 'compliance' && <ComplianceVisual />}
                {slide.visual === 'agents' && <AgentsVisual hasPeon={slide.hasPeon} />}
                {slide.visual === 'outcome' && <OutcomeVisual />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsPlaying(p => !p)} className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary cursor-pointer">
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={() => setIsMuted(m => !m)} className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary cursor-pointer">
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 items-center">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => changeSlide(i)} className="h-1.5 rounded-full transition-all duration-300 cursor-pointer border-none" style={{ width: i === currentSlide ? '24px' : '8px', backgroundColor: i <= currentSlide ? '#22c55e' : '#27272a' }} />
                ))}
              </div>
              {isPlaying && (
                <svg width="24" height="24" className="rotate-[-90deg]">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#27272a" strokeWidth="2" />
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray={2 * Math.PI * 10} strokeDashoffset={2 * Math.PI * 10 * (1 - slideProgress)} strokeLinecap="round" />
                </svg>
              )}
              <button onClick={prevSlide} disabled={currentSlide === 0} className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary cursor-pointer disabled:opacity-30">
                <ChevronLeft size={14} />
              </button>
              <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary cursor-pointer disabled:opacity-30">
                <ChevronRight size={14} />
              </button>
              <span className="text-[11px] text-text-tertiary font-mono">{currentSlide + 1} / {slides.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
