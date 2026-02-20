import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'

type WSMessage = {
    type: string
    notification?: {
        id: string
        userId: string
        type: string
        title: string
        message: string
        read: boolean
        metadata?: Record<string, unknown>
        createdAt: string
    }
    requestId?: string
    status?: string
    [key: string]: unknown
}

/**
 * Custom hook that opens a WebSocket connection to the server
 * and dispatches incoming notifications to the notification store.
 * Also accepts an optional onMessage callback for page-specific handling.
 */
export function useWebSocket(onMessage?: (msg: WSMessage) => void) {
    const { isAuthenticated } = useAuthStore()
    const { addNotification, incrementUnread } = useNotificationStore()
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
    const onMessageRef = useRef(onMessage)
    onMessageRef.current = onMessage

    const connect = useCallback(() => {
        if (!isAuthenticated) return
        if (wsRef.current?.readyState === WebSocket.OPEN) return

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const ws = new WebSocket(`${protocol}//${window.location.hostname}:3001/ws`)

        ws.onopen = () => {
            // console.log('WebSocket connected')
        }

        ws.onmessage = (event) => {
            try {
                const data: WSMessage = JSON.parse(event.data)

                // If a notification payload is present, add it to the store
                if (data.notification) {
                    addNotification(data.notification)
                    incrementUnread()
                }

                // Forward to page-specific handler
                if (onMessageRef.current) {
                    onMessageRef.current(data)
                }
            } catch {
                // ignore malformed messages
            }
        }

        ws.onclose = (event) => {
            // Auto-reconnect unless intentionally closed
            if (event.code !== 4001 && isAuthenticated) {
                reconnectTimeoutRef.current = setTimeout(connect, 3000)
            }
        }

        ws.onerror = () => {
            ws.close()
        }

        wsRef.current = ws
    }, [isAuthenticated, addNotification, incrementUnread])

    useEffect(() => {
        connect()

        return () => {
            clearTimeout(reconnectTimeoutRef.current)
            if (wsRef.current) {
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [connect])

    return wsRef
}
