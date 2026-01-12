import { cn } from '@/lib/utils'
import { Zap, Battery, Server, Wifi } from 'lucide-react'

/**
 * StatusIndicator Widget
 * Show system/service status
 */
export default function StatusIndicator({
    title = 'System Status',
    services = []
}) {
    const defaultServices = [
        { name: 'API Server', status: 'operational', latency: '45ms' },
        { name: 'Database', status: 'operational', latency: '12ms' },
        { name: 'CDN', status: 'degraded', latency: '125ms' },
        { name: 'Auth Service', status: 'operational', latency: '28ms' },
    ]

    const items = services.length > 0 ? services : defaultServices

    const statusConfig = {
        operational: { color: 'bg-emerald-500', label: 'Operational' },
        degraded: { color: 'bg-yellow-500', label: 'Degraded' },
        outage: { color: 'bg-red-500', label: 'Outage' },
        maintenance: { color: 'bg-blue-500', label: 'Maintenance' },
    }

    const overallStatus = items.some(s => s.status === 'outage')
        ? 'outage'
        : items.some(s => s.status === 'degraded')
            ? 'degraded'
            : 'operational'

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', statusConfig[overallStatus].color)} />
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {statusConfig[overallStatus].label}
                    </span>
                </div>
            </div>

            <div className="flex-1 space-y-2">
                {items.map((service, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-[hsl(var(--muted)/0.3)]"
                    >
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'w-2 h-2 rounded-full',
                                statusConfig[service.status]?.color || 'bg-gray-500'
                            )} />
                            <span className="text-sm text-[hsl(var(--foreground))]">
                                {service.name}
                            </span>
                        </div>
                        <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
                            {service.latency}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
