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
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const onMessageRef = useRef(onMessage)
    onMessageRef.current = onMessage

    const connect = useCallback(() => {
        if (!isAuthenticated) return
        if (wsRef.current?.readyState === WebSocket.OPEN) return

        // Use environment variable for WebSocket URL, fallback to current host with port 3001
        const wsUrl = import.meta.env.VITE_WS_URL || 
            `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:3001/ws`
        const ws = new WebSocket(wsUrl)

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
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            if (wsRef.current) {
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [connect])

    return wsRef
}
