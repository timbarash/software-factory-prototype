import { ArrowLeft, Zap, GitBranch, Eye, Shield, Brain, Terminal, Users, TrendingUp, CheckCircle2, Play } from 'lucide-react'

interface MarketingSiteProps {
  onBack: () => void;
  onWalkthrough: () => void;
}

export function MarketingSite({ onBack, onWalkthrough }: MarketingSiteProps) {

  return (
    <div className="h-screen w-screen bg-surface-0 overflow-y-auto">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[12px] text-text-secondary hover:text-accent-green transition-colors bg-transparent border-none cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to App
            </button>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent-green flex items-center justify-center">
                <Zap size={14} color="#000" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight">Rubicon</span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-[12px] bg-accent-green text-surface-0 px-4 py-1.5 rounded-md font-medium hover:bg-accent-green-dim transition-colors border-none cursor-pointer"
          >
            Open App →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[11px] text-accent-green bg-accent-green/10 px-3 py-1 rounded-full border border-accent-green/20 mb-6">
            <Zap size={11} />
            AI-Native Software Development
          </div>
          <h1 className="text-[42px] font-bold text-text-primary leading-tight tracking-tight mb-4">
            Ship production code<br />
            <span className="text-accent-green">with agents that think.</span>
          </h1>
          <p className="text-[16px] text-text-secondary leading-relaxed max-w-xl mx-auto mb-8">
            Rubicon orchestrates four specialized AI agents through your entire SDLC — from context gathering to merge. Every bug and feature request gets triaged, planned, built, and QA'd with persistent expert oversight.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onBack}
              className="text-[13px] bg-accent-green text-surface-0 px-6 py-2.5 rounded-md font-medium hover:bg-accent-green-dim transition-colors border-none cursor-pointer"
            >
              See it in action →
            </button>
            <button
              onClick={onWalkthrough}
              className="text-[13px] text-text-secondary hover:text-text-primary transition-colors border border-border hover:border-border-bright rounded-md px-5 py-2.5 bg-surface-1 cursor-pointer flex items-center gap-2"
            >
              <Play size={13} className="text-accent-green" />
              Watch the Walkthrough
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-border bg-surface-1/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-[28px] font-bold text-text-primary">4</div>
              <div className="text-[12px] text-text-tertiary">Specialized Agents</div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-accent-green">5</div>
              <div className="text-[12px] text-text-tertiary">SDLC Stages Covered</div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-text-primary">74%</div>
              <div className="text-[12px] text-text-tertiary">Avg Confidence Score</div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-accent-amber">7</div>
              <div className="text-[12px] text-text-tertiary">Expert Review Agents</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-text-primary mb-3">Agents that understand your SDLC</h2>
            <p className="text-[14px] text-text-secondary max-w-lg mx-auto">
              Not another chatbot bolted onto your IDE. Four purpose-built agents that own stages of your development pipeline.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                stage: '1',
                name: 'Contexta',
                desc: 'Context & Discovery',
                detail: 'Gathers requirements from feedback requests, scans your codebase for existing patterns, identifies related incidents, and produces a structured context package. Knows what to look for because it understands your architecture.',
                icon: Eye,
                color: '#a855f7',
              },
              {
                stage: '2',
                name: 'Plana',
                desc: 'Architecture & Planning',
                detail: 'Takes Contexta\'s output and generates an implementation plan — component architecture, API changes, database migrations, and dependency analysis. Flags where human decisions are needed before code is written.',
                icon: GitBranch,
                color: '#3b82f6',
              },
              {
                stage: '3',
                name: 'Bilda',
                desc: 'Implementation',
                detail: 'Executes the plan with full codebase awareness. Generates code that matches your existing patterns, creates tests alongside implementation, and provides a Claude Code terminal interface for real-time interaction.',
                icon: Terminal,
                color: '#22c55e',
              },
              {
                stage: '4',
                name: 'QA',
                desc: 'Testing & Validation',
                detail: 'Comprehensive quality gate — functional tests, edge cases, performance validation, cross-browser checks, accessibility audit. Produces a test report with specific pass/fail results.',
                icon: Shield,
                color: '#06b6d4',
              },
            ].map(agent => (
              <div key={agent.name} className="flex gap-4 p-5 rounded-lg bg-surface-1 border border-border hover:border-border-bright transition-colors">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${agent.color}15` }}
                  >
                    <agent.icon size={18} style={{ color: agent.color }} />
                  </div>
                  <span className="text-[10px] font-mono text-text-tertiary">Stage {agent.stage}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-text-primary">{agent.name}</h3>
                    <span className="text-[11px] text-text-tertiary">— {agent.desc}</span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">{agent.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Agents Section */}
      <section className="py-20 px-6 bg-surface-1/30 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-text-primary mb-3">Persistent expert oversight</h2>
            <p className="text-[14px] text-text-secondary max-w-lg mx-auto">
              While your code moves through the pipeline, seven specialized review agents watch everything — from architecture patterns to regulatory compliance.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Design Lead', desc: 'VP-level design review. Linear-inspired patterns, dark-first theming, keyboard-first UX, agent UI patterns.', icon: '◆', color: '#a855f7' },
              { name: 'QA Engineer', desc: 'Edge cases, error states, accessibility, cross-browser. Tests what agents build.', icon: '◇', color: '#06b6d4' },
              { name: 'SWE', desc: 'Code readability, maintainability, pattern consistency. The "will I maintain this?" gut check.', icon: '⬡', color: '#3b82f6' },
              { name: 'Cannabiz SME', desc: 'Industry context — how bugs and features impact real dispensaries, brands, and compliance workflows.', icon: '◈', color: '#f59e0b' },
              { name: 'Architect', desc: 'System design, performance, type safety, React/Go patterns, security review.', icon: '⬢', color: '#22c55e' },
              { name: 'Product Marketing', desc: 'Positioning, messaging, developer experience. How does this feature tell your story?', icon: '◉', color: '#ef4444' },
              { name: 'Compliance Ghost', desc: 'Invisible regulatory auditor. Scans every change for compliance risk across jurisdictions — Metrc, BioTrack, OLCC, DCC. Flags violations before they reach production.', icon: '👻', color: '#ec4899' },
            ].map(agent => (
              <div key={agent.name} className="flex items-start gap-3 p-4 rounded-lg bg-surface-2 border border-border">
                <span style={{ color: agent.color }} className="text-[16px] mt-0.5">{agent.icon}</span>
                <div>
                  <h3 className="text-[13px] font-semibold text-text-primary">{agent.name}</h3>
                  <p className="text-[12px] text-text-secondary leading-relaxed mt-0.5">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-bold text-text-primary mb-3">Built for how you actually work</h2>
            <p className="text-[14px] text-text-secondary max-w-lg mx-auto">
              Not a demo. A workflow tool that handles the grunt work so you can focus on the decisions that matter.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Brain, title: 'Confidence Scoring', desc: 'Every ticket gets a confidence score based on agent consensus. Know before you start whether this needs you or not.' },
              { icon: Users, title: 'Human Input Tracking', desc: 'Agents explicitly flag where they need human decisions. No guessing about what\'s blocking progress.' },
              { icon: Terminal, title: 'Claude Code Terminal', desc: 'Full terminal interface centered in the detail view. Watch agents work in real-time, intervene when needed.' },
              { icon: Shield, title: 'Compliance Ghost', desc: 'Invisible regulatory auditor scans every change across Metrc, BioTrack, OLCC, and DCC. Flags violations before they reach production.' },
              { icon: GitBranch, title: 'SDLC Stage Tracking', desc: 'Visual pipeline from Contexta through Merge. Always know exactly where every ticket stands.' },
              { icon: CheckCircle2, title: 'Next Logical Action', desc: 'The queue is sorted by what matters. Critical bugs first, then highest-confidence items. Stop triaging, start shipping.' },
            ].map(feature => (
              <div key={feature.title} className="p-4 rounded-lg bg-surface-1 border border-border hover:border-border-bright transition-colors">
                <feature.icon size={18} className="text-accent-green mb-2" />
                <h3 className="text-[13px] font-semibold text-text-primary mb-1">{feature.title}</h3>
                <p className="text-[12px] text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[24px] font-bold text-text-primary mb-3">
            Stop context-switching. Start shipping.
          </h2>
          <p className="text-[14px] text-text-secondary mb-6 max-w-md mx-auto">
            Your bugs and feature requests are already waiting. The agents are ready. The pipeline is clear.
          </p>
          <button
            onClick={onBack}
            className="text-[13px] bg-accent-green text-surface-0 px-8 py-3 rounded-md font-medium hover:bg-accent-green-dim transition-colors border-none cursor-pointer"
          >
            Open Rubicon →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-surface-1/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[11px] text-text-tertiary">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent-green flex items-center justify-center">
              <Zap size={10} color="#000" />
            </div>
            <span>Rubicon</span>
            <span className="text-text-tertiary/50">|</span>
            <span>AI-Native SDLC</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Contexta. Plana. Bilda. QA. Merge.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
