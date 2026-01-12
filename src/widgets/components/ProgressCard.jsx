import { Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ProgressCard Widget
 * Shows progress towards a goal with percentage
 */
export default function ProgressCard({
    title = 'Progress',
    current = 0,
    target = 100,
    unit = '',
    color = 'primary'
}) {
    const percentage = Math.min(100, Math.round((current / target) * 100))

    const colorClasses = {
        primary: 'bg-[hsl(var(--primary))]',
        success: 'bg-emerald-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
        info: 'bg-blue-500',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                <Activity className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {/* Value */}
                <div className="mb-2">
                    <span className="text-2xl font-bold text-[hsl(var(--foreground))]">
                        {current.toLocaleString()}{unit}
                    </span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))] ml-1">
                        / {target.toLocaleString()}{unit}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                    <div
                        className={cn('h-full rounded-full transition-all', colorClasses[color] || colorClasses.primary)}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Percentage */}
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                    {percentage}% complete
                </p>
            </div>
        </div>
    )
}
