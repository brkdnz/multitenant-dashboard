import { useState, useEffect } from 'react'
import { Server, Database, Cloud, Wifi, HardDrive, Cpu, MemoryStick, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Server Monitor Widget
 * Real-time server/infrastructure monitoring
 */
export default function ServerMonitor({
    title = 'Server Status',
    servers = null,
    refreshInterval = 5000,
    showMetrics = true
}) {
    const [lastPing, setLastPing] = useState(Date.now())

    // Default servers if not provided
    const defaultServers = [
        {
            name: 'Production API',
            type: 'api',
            status: 'healthy',
            uptime: '99.9%',
            cpu: 45,
            memory: 62,
            responseTime: 42
        },
        {
            name: 'Database Primary',
            type: 'database',
            status: 'healthy',
            uptime: '99.99%',
            cpu: 28,
            memory: 78,
            responseTime: 8
        },
        {
            name: 'CDN Edge',
            type: 'cdn',
            status: 'healthy',
            uptime: '100%',
            cpu: 12,
            memory: 34,
            responseTime: 15
        },
        {
            name: 'Worker Queue',
            type: 'worker',
            status: 'warning',
            uptime: '99.5%',
            cpu: 85,
            memory: 71,
            responseTime: 156
        },
        {
            name: 'Backup Server',
            type: 'backup',
            status: 'healthy',
            uptime: '99.9%',
            cpu: 5,
            memory: 42,
            responseTime: 89
        }
    ]

    const data = servers || defaultServers

    // Simulate refresh
    useEffect(() => {
        const interval = setInterval(() => {
            setLastPing(Date.now())
        }, refreshInterval)
        return () => clearInterval(interval)
    }, [refreshInterval])

    const getIcon = (type) => {
        switch (type) {
            case 'api': return Server
            case 'database': return Database
            case 'cdn': return Cloud
            case 'worker': return Cpu
            case 'backup': return HardDrive
            default: return Server
        }
    }

    const statusConfig = {
        healthy: { color: 'bg-emerald-500', text: 'text-emerald-500', label: 'Healthy', pulse: false },
        warning: { color: 'bg-yellow-500', text: 'text-yellow-500', label: 'Warning', pulse: true },
        critical: { color: 'bg-red-500', text: 'text-red-500', label: 'Critical', pulse: true },
        offline: { color: 'bg-gray-500', text: 'text-gray-500', label: 'Offline', pulse: false }
    }

    const getMetricColor = (value) => {
        if (value >= 90) return 'bg-red-500'
        if (value >= 70) return 'bg-yellow-500'
        return 'bg-emerald-500'
    }

    const healthyCount = data.filter(s => s.status === 'healthy').length
    const totalCount = data.length

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                            {healthyCount}/{totalCount} healthy
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">Live</span>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
                {data.map(server => {
                    const Icon = getIcon(server.type)
                    const config = statusConfig[server.status] || statusConfig.healthy

                    return (
                        <div
                            key={server.name}
                            className="p-3 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.5)] transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                    <span className="font-medium text-[hsl(var(--foreground))] text-sm">
                                        {server.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        'w-2 h-2 rounded-full',
                                        config.color,
                                        config.pulse && 'animate-pulse'
                                    )} />
                                    <span className={cn('text-xs font-medium', config.text)}>
                                        {config.label}
                                    </span>
                                </div>
                            </div>

                            {showMetrics && (
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                        <div className="text-[hsl(var(--muted-foreground))] mb-1">CPU</div>
                                        <div className="h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                                            <div
                                                className={cn('h-full rounded-full transition-all', getMetricColor(server.cpu))}
                                                style={{ width: `${server.cpu}%` }}
                                            />
                                        </div>
                                        <div className="mt-0.5 text-[hsl(var(--foreground))]">{server.cpu}%</div>
                                    </div>
                                    <div>
                                        <div className="text-[hsl(var(--muted-foreground))] mb-1">Memory</div>
                                        <div className="h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                                            <div
                                                className={cn('h-full rounded-full transition-all', getMetricColor(server.memory))}
                                                style={{ width: `${server.memory}%` }}
                                            />
                                        </div>
                                        <div className="mt-0.5 text-[hsl(var(--foreground))]">{server.memory}%</div>
                                    </div>
                                    <div>
                                        <div className="text-[hsl(var(--muted-foreground))] mb-1">Latency</div>
                                        <div className="font-mono text-[hsl(var(--foreground))]">
                                            {server.responseTime}ms
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
