import { create } from 'zustand'

export interface Notification {
    id: string
    userId: string
    type: string
    title: string
    message: string
    read: boolean
    metadata?: Record<string, unknown>
    createdAt: string
}

interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    isModalOpen: boolean
    setNotifications: (notifications: Notification[]) => void
    addNotification: (notification: Notification) => void
    setUnreadCount: (count: number) => void
    incrementUnread: () => void
    markAllRead: () => void
    markRead: (id: string) => void
    openModal: () => void
    closeModal: () => void
    toggleModal: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    isModalOpen: false,

    setNotifications: (notifications) => set({ notifications }),

    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
        })),

    setUnreadCount: (count) => set({ unreadCount: count }),

    incrementUnread: () =>
        set((state) => ({ unreadCount: state.unreadCount + 1 })),

    markAllRead: () =>
        set((state) => ({
            unreadCount: 0,
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

    markRead: (id) =>
        set((state) => ({
            unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((n) => n.id === id && !n.read) ? 1 : 0)),
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
}))
