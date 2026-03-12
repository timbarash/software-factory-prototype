import { useState } from 'react'
import { Hotlist } from './components/Hotlist'
import { DetailView } from './components/DetailView'
import { MarketingSite } from './components/MarketingSite'
import { tickets } from './data'

export default function App() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [view, setView] = useState<'app' | 'marketing'>('app')

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) ?? null

  if (view === 'marketing') {
    return <MarketingSite onBack={() => setView('app')} />
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-0 overflow-hidden">
      {selectedTicket ? (
        <DetailView
          ticket={selectedTicket}
          onBack={() => setSelectedTicketId(null)}
          onSelectTicket={setSelectedTicketId}
          onShowMarketing={() => setView('marketing')}
        />
      ) : (
        <Hotlist
          tickets={tickets}
          onSelectTicket={setSelectedTicketId}
          onShowMarketing={() => setView('marketing')}
        />
      )}
    </div>
  )
}
