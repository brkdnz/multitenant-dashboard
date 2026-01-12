import { cn } from '@/lib/utils'
import { Gauge } from 'lucide-react'

/**
 * GaugeWidget - Speedometer style gauge
 */
export default function GaugeWidget({
    title = 'Performance',
    value = 75,
    min = 0,
    max = 100,
    unit = '%',
    thresholds = { low: 30, medium: 70 }
}) {
    const percentage = ((value - min) / (max - min)) * 100
    const angle = (percentage / 100) * 180 - 90 // -90 to 90 degrees

    const getColor = () => {
        if (percentage < thresholds.low) return 'text-red-500'
        if (percentage < thresholds.medium) return 'text-yellow-500'
        return 'text-emerald-500'
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm">{title}</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Gauge */}
                <div className="relative w-32 h-16 overflow-hidden">
                    {/* Background arc */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-8 border-[hsl(var(--muted))] border-b-transparent" />

                    {/* Progress arc */}
                    <div
                        className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-8 border-transparent transition-all', getColor().replace('text', 'border'))}
                        style={{
                            borderTopColor: 'currentColor',
                            borderRightColor: percentage > 50 ? 'currentColor' : 'transparent',
                            transform: `translateX(-50%) rotate(${percentage > 50 ? 45 : -45 + (percentage / 50) * 90}deg)`,
                        }}
                    />

                    {/* Needle */}
                    <div
                        className="absolute bottom-0 left-1/2 w-1 h-12 bg-[hsl(var(--foreground))] origin-bottom transition-transform rounded-full"
                        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                    />

                    {/* Center dot */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[hsl(var(--foreground))] rounded-full" />
                </div>

                {/* Value */}
                <div className="mt-2 text-center">
                    <span className={cn('text-2xl font-bold', getColor())}>{value}</span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">{unit}</span>
                </div>
            </div>
        </div>
    )
}
