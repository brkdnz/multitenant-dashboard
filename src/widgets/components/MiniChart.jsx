import { cn } from '@/lib/utils'

/**
 * Color variants for charts
 */
const colorVariants = {
    primary: 'bg-gradient-to-t from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.6)]',
    blue: 'bg-gradient-to-t from-blue-500 to-blue-400',
    green: 'bg-gradient-to-t from-emerald-500 to-emerald-400',
    purple: 'bg-gradient-to-t from-purple-500 to-purple-400',
    orange: 'bg-gradient-to-t from-orange-500 to-orange-400',
}

/**
 * MiniChart Widget
 * Displays a simple bar chart visualization
 * 
 * @param {object} props
 * @param {string} props.title - Chart title
 * @param {Array} props.data - Array of numbers for bar heights
 * @param {string} props.color - Color variant
 */
export default function MiniChart({
    title = 'Weekly Activity',
    data = [40, 65, 35, 80, 55, 90, 70],
    color = 'primary'
}) {
    const maxValue = Math.max(...data, 1)
    const gradientClass = colorVariants[color] || colorVariants.primary
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

    return (
        <div className="h-full flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {title}
                </h3>
                <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-1 rounded-full">
                    Last 7 days
                </span>
            </div>

            {/* Chart */}
            <div className="flex-1 flex items-end justify-between gap-2 pb-6 relative">
                {data.map((value, index) => {
                    const height = (value / maxValue) * 100
                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-2 group"
                        >
                            {/* Bar */}
                            <div className="w-full relative flex items-end justify-center h-full min-h-[60px]">
                                <div
                                    className={cn(
                                        'w-full max-w-[32px] rounded-t-lg transition-all duration-300',
                                        'group-hover:opacity-80 group-hover:scale-105',
                                        gradientClass
                                    )}
                                    style={{ height: `${Math.max(height, 8)}%` }}
                                />
                                {/* Tooltip on hover */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-medium bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-2 py-1 rounded">
                                        {value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="border-b border-dashed border-[hsl(var(--border)/0.5)]"
                        />
                    ))}
                </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between px-1">
                {days.slice(0, data.length).map((day, index) => (
                    <span
                        key={index}
                        className="text-xs text-[hsl(var(--muted-foreground))] w-8 text-center"
                    >
                        {day}
                    </span>
                ))}
            </div>
        </div>
    )
}
