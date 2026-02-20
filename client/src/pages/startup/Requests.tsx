import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import * as Tabs from '@radix-ui/react-tabs'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
import { api } from '../../api/client'

export default function StartupRequests() {
  const [data, setData] = useState<{ sent: unknown[]; received: unknown[] }>({ sent: [], received: [] })

  useEffect(() => {
    api.get('/requests').then((res) => setData(res.data))
  }, [])

  const received = (data.received || []) as Array<{ id: string; status: string; investorSender?: { fullName: string; firmName?: string } }>
  const sent = (data.sent || []) as Array<{ id: string; status: string }>

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-[4.5rem] p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[800px] mx-auto">
          <h1 className="font-display text-3xl font-bold text-forest-ink mb-6">Connection Requests</h1>
          <Tabs.Root defaultValue="received">
            <Tabs.List className="flex gap-0 border border-border rounded-lg p-0.5 mb-6">
              <Tabs.Trigger value="received" className="flex-1 font-body py-2 data-[state=active]:bg-terracotta data-[state=active]:text-chalk-white rounded-md">
                Received ({received.length})
              </Tabs.Trigger>
              <Tabs.Trigger value="sent" className="flex-1 font-body py-2 data-[state=active]:bg-terracotta data-[state=active]:text-chalk-white rounded-md">
                Sent ({sent.length})
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="received">
              {received.length === 0 ? (
                <NeoCard className="p-8 text-center font-body text-forest-ink/80">No requests received yet.</NeoCard>
              ) : (
                <div className="space-y-4">
                  {received.map((r) => (
                    <NeoCard key={r.id} className="p-4 flex items-center gap-4 flex-wrap">
                      <div className="w-12 h-12 rounded-lg bg-terracotta/90 flex items-center justify-center font-display font-bold text-chalk-white">?</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-forest-ink">{r.investorSender?.fullName || 'Investor'}</p>
                        <p className="font-body text-xs text-forest-ink/70">{r.investorSender?.firmName || '—'}</p>
                      </div>
                      <Badge variant={r.status === 'accepted' ? 'sector' : r.status === 'declined' ? 'status' : 'stage'}>{r.status}</Badge>
                      {r.status === 'pending' && (
                        <div className="flex gap-2">
                          <NeoButton variant="primary" className="bg-dusty-sage/90 text-forest-ink" onClick={() => api.post(`/requests/${r.id}/accept`).then(() => api.get('/requests').then((res) => setData(res.data)))}>Accept ✓</NeoButton>
                          <NeoButton variant="primary" className="bg-clay-red/90 text-chalk-white" onClick={() => api.post(`/requests/${r.id}/decline`).then(() => api.get('/requests').then((res) => setData(res.data)))}>Decline ✗</NeoButton>
                        </div>
                      )}
                    </NeoCard>
                  ))}
                </div>
              )}
            </Tabs.Content>
            <Tabs.Content value="sent">
              {sent.length === 0 ? (
                <NeoCard className="p-8 text-center font-body text-forest-ink/80">No requests sent yet.</NeoCard>
              ) : (
                <div className="space-y-4">
                  {sent.map((r) => (
                    <NeoCard key={r.id} className="p-4 flex items-center gap-4">
                      <Badge variant="stage">{r.status}</Badge>
                    </NeoCard>
                  ))}
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </motion.div>
      </main>
    </div>
  )
}
