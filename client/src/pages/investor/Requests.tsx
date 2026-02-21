import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@iconify/react'
import * as Tabs from '@radix-ui/react-tabs'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
import { PdfViewerModal } from '../../components/ui/PdfViewerModal'
import { SuccessIllustration } from '../../assets/illustrations/SuccessIllustration'
import { api } from '../../api/client'
import { useWebSocket } from '../../hooks/useWebSocket'

export default function InvestorRequests() {
  const [data, setData] = useState<{ sent: unknown[]; received: unknown[] }>({ sent: [], received: [] })
  const [realtimeHighlight, setRealtimeHighlight] = useState<string | null>(null)

  const refresh = useCallback(() => {
    api.get('/requests').then((res) => setData(res.data))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // WebSocket handler for real-time updates
  const handleWSMessage = useCallback((msg: any) => {
    if (
      msg.type === 'new_request' ||
      msg.type === 'request_accepted' ||
      msg.type === 'request_declined' ||
      msg.type === 'request_status_changed'
    ) {
      refresh()

      // Highlight the updated request
      const reqId = msg.requestId || msg.notification?.metadata?.requestId
      if (reqId) {
        setRealtimeHighlight(reqId)
        setTimeout(() => setRealtimeHighlight(null), 3000)
      }
    }
  }, [refresh])

  useWebSocket(handleWSMessage)

  const statusMeta = (status: string, acceptedBy: string, declinedBy: string) => {
    if (status === 'accepted') return { label: 'Accepted', detail: acceptedBy }
    if (status === 'declined') return { label: 'Declined', detail: declinedBy }
    return { label: 'Pending', detail: 'Awaiting response' }
  }

  type ReceivedItem = {
    id: string
    status: string
    message?: string | null
    startupSender?: {
      id: string
      startupName: string
      founderName?: string
      sector?: string
      pitch?: string | null
      pitchDeckUrl?: string | null
    }
  }
  const received = (data.received || []) as ReceivedItem[]
  const sent = (data.sent || []) as Array<{
    id: string
    status: string
    startupReceiver?: { startupName?: string }
    investorReceiver?: { fullName?: string }
  }>
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null)

  const statusIcon = (status: string) => {
    if (status === 'accepted') return 'solar:check-circle-bold'
    if (status === 'declined') return 'solar:close-circle-bold'
    return 'solar:clock-circle-bold'
  }

  const statusColor = (status: string) => {
    if (status === 'accepted') return 'text-[#7a9b76]'
    if (status === 'declined') return 'text-[#c77567]'
    return 'text-[#d4a574]'
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-[4.5rem] p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="font-display text-3xl font-bold text-forest-ink">Connection Requests</h1>
            <div className="flex items-center gap-1.5 text-[10px] text-[#7a9b76] bg-[#7a9b76]/10 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a9b76] animate-pulse" />
              Live
            </div>
          </div>
          <Tabs.Root defaultValue="received">
            <Tabs.List className="flex gap-0 border border-border rounded-lg p-0.5 mb-6">
              <Tabs.Trigger value="received" className="flex-1 font-body py-2 data-[state=active]:bg-terracotta data-[state=active]:text-chalk-white rounded-md transition-colors">Received ({received.length})</Tabs.Trigger>
              <Tabs.Trigger value="sent" className="flex-1 font-body py-2 data-[state=active]:bg-terracotta data-[state=active]:text-chalk-white rounded-md transition-colors">Sent ({sent.length})</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="received">
              {received.length === 0 ? (
                <NeoCard className="p-8 text-center font-body text-forest-ink/80">No requests received yet.</NeoCard>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {received.map((r) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                      >
                        <NeoCard className={`p-5 flex flex-col gap-3 transition-all duration-500 ${realtimeHighlight === r.id ? 'ring-2 ring-[#d4a574] shadow-lg' : ''
                          }`}>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-md bg-terracotta flex items-center justify-center font-display font-bold text-chalk-white">
                                {r.startupSender?.startupName?.[0]?.toUpperCase() || 'S'}
                              </div>
                              <SuccessIllustration className="h-8 w-8 text-terracotta shrink-0" aria-hidden />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-display font-bold text-forest-ink">{r.startupSender?.startupName || 'Startup'}</p>
                              <p className="font-body text-xs text-forest-ink/60">Pitch received</p>
                              {r.startupSender?.founderName && (
                                <p className="font-body text-xs text-forest-ink/70">{r.startupSender.founderName} · {r.startupSender.sector}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Icon icon={statusIcon(r.status)} className={`text-base ${statusColor(r.status)}`} />
                              <Badge variant={r.status === 'accepted' ? 'sector' : r.status === 'declined' ? 'status' : 'stage'}>{r.status}</Badge>
                            </div>
                            {r.status === 'pending' && (
                              <div className="flex gap-2">
                                <NeoButton variant="primary" className="bg-dusty-sage/90 text-forest-ink" onClick={() => api.post(`/requests/${r.id}/accept`).then(refresh)}>Accept ✓</NeoButton>
                                <NeoButton variant="primary" className="bg-clay-red/90 text-chalk-white" onClick={() => api.post(`/requests/${r.id}/decline`).then(refresh)}>Decline ✗</NeoButton>
                              </div>
                            )}
                          </div>
                          {(r.status === 'accepted' || r.status === 'declined') && (
                            <p className="font-body text-xs text-forest-ink/60">
                              {statusMeta(r.status, 'Accepted by you', 'Declined by you').detail}
                            </p>
                          )}
                          {r.startupSender?.pitch && (
                            <p className="font-body text-sm text-forest-ink/85 border-l-2 border-terracotta/40 pl-3">{r.startupSender.pitch}</p>
                          )}
                          {r.message && (
                            <p className="font-body text-sm text-forest-ink/80"><span className="text-forest-ink/60">Personal note: </span>{r.message}</p>
                          )}
                          {r.startupSender?.pitchDeckUrl && (
                            <button
                              type="button"
                              onClick={() => setPdfViewUrl(r.startupSender!.pitchDeckUrl!)}
                              className="font-body text-sm text-terracotta underline hover:no-underline text-left"
                            >
                              View pitch deck (PDF)
                            </button>
                          )}
                        </NeoCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </Tabs.Content>
            <Tabs.Content value="sent">
              {sent.length === 0 ? (
                <NeoCard className="p-8 text-center font-body text-forest-ink/80">No requests sent yet.</NeoCard>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {sent.map((r) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                      >
                        <NeoCard className={`p-4 flex items-center gap-4 transition-all duration-500 ${realtimeHighlight === r.id ? 'ring-2 ring-[#d4a574] shadow-lg' : ''
                          }`}>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-forest-ink">
                              {(r.startupReceiver?.startupName || r.investorReceiver?.fullName || 'Recipient')}
                            </p>
                            <p className="font-body text-xs text-forest-ink/60">
                              {statusMeta(
                                r.status,
                                `Accepted by ${r.startupReceiver?.startupName || r.investorReceiver?.fullName || 'recipient'}`,
                                `Declined by ${r.startupReceiver?.startupName || r.investorReceiver?.fullName || 'recipient'}`
                              ).detail}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Icon icon={statusIcon(r.status)} className={`text-base ${statusColor(r.status)}`} />
                            <Badge variant={r.status === 'accepted' ? 'sector' : r.status === 'declined' ? 'status' : 'stage'}>
                              {statusMeta(r.status, 'Accepted', 'Declined').label}
                            </Badge>
                          </div>
                        </NeoCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </motion.div>
      </main>
      {pdfViewUrl && (
        <PdfViewerModal src={pdfViewUrl} onClose={() => setPdfViewUrl(null)} />
      )}
    </div>
  )
}
