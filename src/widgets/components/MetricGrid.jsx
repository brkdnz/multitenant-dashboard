import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

/**
 * MetricGrid Widget
 * Display multiple metrics in a grid
 */
export default function MetricGrid({
    title = 'Key Metrics',
    metrics = []
}) {
    const defaultMetrics = [
        { label: 'Revenue', value: '$45.2K', change: '+12%', positive: true },
        { label: 'Users', value: '2,340', change: '+8%', positive: true },
        { label: 'Orders', value: '1,120', change: '-3%', positive: false },
        { label: 'Conversion', value: '3.2%', change: '0%', positive: null },
    ]

    const items = metrics.length > 0 ? metrics : defaultMetrics

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">{title}</h3>

            <div className="flex-1 grid grid-cols-2 gap-3">
                {items.map((metric, index) => (
                    <div
                        key={index}
                        className="rounded-lg bg-[hsl(var(--muted)/0.5)] p-3"
                    >
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                            {metric.label}
                        </p>
                        <p className="text-lg font-bold text-[hsl(var(--foreground))]">
                            {metric.value}
                        </p>
                        <div className={cn(
                            'flex items-center gap-1 text-xs mt-1',
                            metric.positive === true && 'text-emerald-500',
                            metric.positive === false && 'text-red-500',
                            metric.positive === null && 'text-[hsl(var(--muted-foreground))]'
                        )}>
                            {metric.positive === true && <ArrowUpRight className="h-3 w-3" />}
                            {metric.positive === false && <ArrowDownRight className="h-3 w-3" />}
                            {metric.positive === null && <Minus className="h-3 w-3" />}
                            <span>{metric.change}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
