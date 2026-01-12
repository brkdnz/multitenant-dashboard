import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

/**
 * SparklineCard Widget
 * Compact sparkline chart with value
 */
export default function SparklineCard({
    title = 'Metric',
    value = '1,234',
    data = [40, 45, 35, 50, 49, 60, 70, 65, 80, 75, 85, 90],
    color = 'primary',
    trend = null
}) {
    const colorClasses = {
        primary: 'stroke-[hsl(var(--primary))]',
        success: 'stroke-emerald-500',
        warning: 'stroke-yellow-500',
        danger: 'stroke-red-500',
    }

    const fillClasses = {
        primary: 'fill-[hsl(var(--primary)/0.1)]',
        success: 'fill-emerald-500/10',
        warning: 'fill-yellow-500/10',
        danger: 'fill-red-500/10',
    }

    // Normalize data for SVG path
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 100
    const height = 30
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((d - min) / range) * height
    }))

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">{title}</span>
                {trend && (
                    <span className={cn(
                        'text-xs font-medium',
                        trend.positive ? 'text-emerald-500' : 'text-red-500'
                    )}>
                        {trend.value}
                    </span>
                )}
            </div>

            <div className="flex items-end justify-between gap-4 flex-1">
                <span className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    {value}
                </span>

                <svg viewBox={`0 0 ${width} ${height}`} className="w-24 h-8">
                    <path d={areaPath} className={fillClasses[color]} />
                    <path d={linePath} className={cn('fill-none stroke-2', colorClasses[color])} />
                </svg>
            </div>
        </div>
    )
}
