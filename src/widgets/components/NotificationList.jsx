import { cn } from '@/lib/utils'
import { Bell, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

/**
 * NotificationList Widget
 * Display notifications with different types
 */
export default function NotificationList({
    title = 'Notifications',
    notifications = []
}) {
    const defaultNotifications = [
        { id: 1, type: 'success', message: 'Order #1234 completed successfully', time: '5 min ago' },
        { id: 2, type: 'warning', message: 'Low stock alert for Product A', time: '1 hour ago' },
        { id: 3, type: 'info', message: 'New user registered', time: '2 hours ago' },
        { id: 4, type: 'error', message: 'Payment failed for Order #5678', time: '3 hours ago' },
    ]

    const items = notifications.length > 0 ? notifications : defaultNotifications

    const typeConfig = {
        success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--primary))] text-white">
                    {items.length}
                </span>
            </div>

            <div className="flex-1 overflow-auto space-y-2">
                {items.map((notification, index) => {
                    const config = typeConfig[notification.type] || typeConfig.info
                    const Icon = config.icon

                    return (
                        <div
                            key={notification.id || index}
                            className={cn('flex items-start gap-3 p-2 rounded-lg', config.bg)}
                        >
                            <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', config.color)} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-[hsl(var(--foreground))]">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                    {notification.time}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
