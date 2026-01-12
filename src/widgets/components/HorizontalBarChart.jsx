import { cn } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'

/**
 * HorizontalBarChart Widget - Horizontal bar chart
 */
export default function HorizontalBarChart({
    title = 'Top Categories',
    data = []
}) {
    const defaultData = [
        { label: 'Electronics', value: 85, color: 'blue' },
        { label: 'Clothing', value: 72, color: 'green' },
        { label: 'Home & Garden', value: 58, color: 'purple' },
        { label: 'Sports', value: 45, color: 'yellow' },
        { label: 'Books', value: 32, color: 'red' },
    ]

    const items = data.length > 0 ? data : defaultData
    const maxValue = Math.max(...items.map(d => d.value))

    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
        purple: 'bg-purple-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        pink: 'bg-pink-500',
        cyan: 'bg-cyan-500',
        orange: 'bg-orange-500',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 space-y-3">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-[hsl(var(--foreground))]">{item.label}</span>
                            <span className="text-sm font-medium text-[hsl(var(--foreground))]">{item.value}</span>
                        </div>
                        <div className="h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                            <div
                                className={cn('h-full rounded-full transition-all', colorClasses[item.color] || 'bg-blue-500')}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
