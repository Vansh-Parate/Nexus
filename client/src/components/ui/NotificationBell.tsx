import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore, type Notification } from '../../store/notificationStore'
import { useAuthStore } from '../../store/authStore'
import { api } from '../../api/client'

function timeAgo(dateStr: string): string {
    const now = Date.now()
    const diff = now - new Date(dateStr).getTime()
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function notificationIcon(type: string) {
    switch (type) {
        case 'new_request':
            return 'solar:letter-unread-linear'
        case 'request_accepted':
            return 'solar:check-circle-linear'
        case 'request_declined':
            return 'solar:close-circle-linear'
        default:
            return 'solar:bell-linear'
    }
}

function notificationColor(type: string) {
    switch (type) {
        case 'new_request':
            return 'text-[#d4a574]'
        case 'request_accepted':
            return 'text-[#7a9b76]'
        case 'request_declined':
            return 'text-[#c77567]'
        default:
            return 'text-[#9b918a]'
    }
}

function notificationBgColor(type: string) {
    switch (type) {
        case 'new_request':
            return 'bg-[#d4a574]/10'
        case 'request_accepted':
            return 'bg-[#7a9b76]/10'
        case 'request_declined':
            return 'bg-[#c77567]/10'
        default:
            return 'bg-[#e8e3dc]/50'
    }
}

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (notification: Notification) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => onRead(notification)}
            className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${notification.read
                ? 'bg-transparent border-transparent hover:bg-[#f7f4f0]'
                : 'bg-[#fffbf8] border-[#e8e3dc] hover:bg-[#f7f4f0] shadow-[0_1px_3px_rgba(62,53,48,0.06)]'
                }`}
        >
            <div className={`w-9 h-9 rounded-lg ${notificationBgColor(notification.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon icon={notificationIcon(notification.type)} className={`text-lg ${notificationColor(notification.type)}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold leading-tight truncate ${notification.read ? 'text-[#6b615b]' : 'text-[#3e3530]'}`}>
                        {notification.title}
                    </p>
                    {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-[#d4a574] shrink-0 animate-pulse" />
                    )}
                </div>
                <p className={`text-xs leading-relaxed ${notification.read ? 'text-[#9b918a]' : 'text-[#6b615b]'}`}>
                    {notification.message}
                </p>
                <p className="text-[10px] text-[#9b918a] mt-1">{timeAgo(notification.createdAt)}</p>
            </div>
        </motion.div>
    )
}

export function NotificationBell() {
    const { notifications, unreadCount, isModalOpen, setNotifications, setUnreadCount, markAllRead, markRead, toggleModal, closeModal } = useNotificationStore()
    const { user } = useAuthStore()
    const modalRef = useRef<HTMLDivElement>(null)
    const bellRef = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate()

    // Fetch notifications on mount
    useEffect(() => {
        api.get('/notifications')
            .then((res) => {
                setNotifications(res.data.notifications || [])
                setUnreadCount(res.data.unreadCount || 0)
            })
            .catch(() => { })
    }, [setNotifications, setUnreadCount])

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                isModalOpen &&
                modalRef.current &&
                !modalRef.current.contains(e.target as Node) &&
                bellRef.current &&
                !bellRef.current.contains(e.target as Node)
            ) {
                closeModal()
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [isModalOpen, closeModal])

    const handleMarkAllRead = () => {
        markAllRead()
        api.post('/notifications/mark-all-read').catch(() => { })
    }

    const handleRead = (notification: Notification) => {
        if (!notification.read) {
            markRead(notification.id)
            api.post(`/notifications/${notification.id}/read`).catch(() => { })
        }

        // Navigate based on notification type/metadata
        if (notification.type.includes('request') && user?.role) {
            closeModal()
            navigate(`/${user.role}/requests`)
        }
    }

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                ref={bellRef}
                onClick={toggleModal}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-full py-2.5 rounded-xl transition-all duration-200 ${isModalOpen
                    ? 'bg-[#e8e3dc] text-[#d4a574]'
                    : 'text-[#9b918a] hover:bg-[#e8e3dc]/50 hover:text-[#3e3530]'
                    }`}
                aria-label="Notifications"
            >
                <div className="relative">
                    <Icon icon="solar:bell-linear" className="text-[1.2rem]" strokeWidth={1.5} />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 500 }}
                                className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-[#c77567] text-white text-[9px] font-bold rounded-full px-1 leading-none"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                <span className="text-[0.6rem] font-medium leading-none tracking-wide hidden md:block">Alerts</span>
            </button>

            {/* Notification Modal / Dropdown */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed md:absolute z-50 bottom-20 left-2 right-2 md:bottom-auto md:left-full md:right-auto md:ml-3 md:top-0 w-auto md:w-[380px] max-h-[70vh] md:max-h-[520px] bg-white border border-[#e8e3dc] rounded-2xl shadow-[0_8px_32px_rgba(62,53,48,0.12)] overflow-hidden flex flex-col"
                        style={{ backdropFilter: 'blur(16px)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e3dc]/60">
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:bell-bold" className="text-[#d4a574] text-lg" />
                                <h3 className="font-display text-base font-semibold text-[#3e3530]">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-[#d4a574]/15 text-[#d4a574] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[11px] text-[#d4a574] hover:text-[#b8865a] font-medium transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={closeModal}
                                    className="w-7 h-7 rounded-lg hover:bg-[#e8e3dc]/60 flex items-center justify-center text-[#9b918a] hover:text-[#3e3530] transition-colors"
                                >
                                    <Icon icon="solar:close-circle-linear" className="text-base" />
                                </button>
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-[#f7f4f0] flex items-center justify-center mb-4">
                                        <Icon icon="solar:bell-off-linear" className="text-2xl text-[#9b918a]" />
                                    </div>
                                    <p className="text-sm font-medium text-[#6b615b] mb-1">All caught up!</p>
                                    <p className="text-xs text-[#9b918a]">No notifications yet.</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {notifications.map((n) => (
                                        <NotificationItem key={n.id} notification={n} onRead={handleRead} />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="border-t border-[#e8e3dc]/60 px-5 py-3 text-center">
                                <p className="text-[10px] text-[#9b918a]">
                                    Showing {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
