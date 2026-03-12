import { useState, useEffect } from 'react'
import { Hotlist } from './components/Hotlist'
import { DetailView } from './components/DetailView'
import { MarketingSite } from './components/MarketingSite'
import { Walkthrough } from './components/Walkthrough'
import { AgentReview } from './components/AgentReview'
import { tickets } from './data'

type View = 'app' | 'marketing' | 'walkthrough' | 'review'

function getInitialView(): View {
  const hash = window.location.hash
  if (hash === '#/walkthrough') return 'walkthrough'
  if (hash === '#/marketing' || hash === '#/site') return 'marketing'
  if (hash === '#/review' || hash === '#/agents') return 'review'
  return 'app'
}

export default function App() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [view, setView] = useState<View>(getInitialView)
  const [walkthroughAutoStart, setWalkthroughAutoStart] = useState(false)

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash
      if (hash === '#/walkthrough') setView('walkthrough')
      else if (hash === '#/marketing' || hash === '#/site') setView('marketing')
      else if (hash === '#/review' || hash === '#/agents') setView('review')
      else if (hash === '' || hash === '#/' || hash === '#/app') setView('app')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (v: View) => {
    setView(v)
    if (v === 'walkthrough') window.location.hash = '#/walkthrough'
    else if (v === 'marketing') window.location.hash = '#/marketing'
    else if (v === 'review') window.location.hash = '#/review'
    else window.location.hash = '#/app'
  }

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) ?? null

  if (view === 'walkthrough') {
    return (
      <Walkthrough
        onClose={() => { setWalkthroughAutoStart(false); navigate('marketing') }}
        musicSrc={`${import.meta.env.BASE_URL}tiger-tracks.mp3`}
        autoStart={walkthroughAutoStart}
      />
    )
  }

  if (view === 'review') {
    return <AgentReview onBack={() => navigate('app')} />
  }

  if (view === 'marketing') {
    return <MarketingSite onBack={() => navigate('app')} onWalkthrough={() => { setWalkthroughAutoStart(true); navigate('walkthrough') }} />
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-0 overflow-hidden">
      {selectedTicket ? (
        <DetailView
          ticket={selectedTicket}
          onBack={() => setSelectedTicketId(null)}
          onSelectTicket={setSelectedTicketId}
          onShowMarketing={() => navigate('marketing')}
        />
      ) : (
        <Hotlist
          tickets={tickets}
          onSelectTicket={setSelectedTicketId}
          onShowMarketing={() => navigate('marketing')}
          onShowReview={() => navigate('review')}
        />
      )}
    </div>
  )
}
