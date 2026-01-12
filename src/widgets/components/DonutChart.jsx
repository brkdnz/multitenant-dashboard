import { cn } from '@/lib/utils'

/**
 * DonutChart Widget
 * Simple donut/pie chart for data visualization
 */
export default function DonutChart({
    title = 'Distribution',
    data = [],
    showLegend = true
}) {
    const defaultData = [
        { label: 'Desktop', value: 45, color: '#3b82f6' },
        { label: 'Mobile', value: 35, color: '#10b981' },
        { label: 'Tablet', value: 20, color: '#f59e0b' },
    ]

    const items = data.length > 0 ? data : defaultData
    const total = items.reduce((sum, item) => sum + item.value, 0)

    // Calculate stroke-dasharray for each segment
    const radius = 40
    const circumference = 2 * Math.PI * radius
    let currentOffset = 0

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">{title}</h3>

            <div className="flex-1 flex items-center justify-center gap-6">
                {/* Donut */}
                <div className="relative">
                    <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
                        {items.map((item, index) => {
                            const percentage = (item.value / total) * 100
                            const strokeDasharray = (percentage / 100) * circumference
                            const offset = currentOffset
                            currentOffset += strokeDasharray

                            return (
                                <circle
                                    key={index}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="16"
                                    strokeDasharray={`${strokeDasharray} ${circumference}`}
                                    strokeDashoffset={-offset}
                                    className="transition-all duration-300"
                                />
                            )
                        })}
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-[hsl(var(--foreground))]">
                            {total}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                {showLegend && (
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                                    {item.label}
                                </span>
                                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
