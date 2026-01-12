import { cn } from '@/lib/utils'

/**
 * ComparisonCard Widget
 * Compare two values side by side
 */
export default function ComparisonCard({
    title = 'Comparison',
    leftLabel = 'This Period',
    leftValue = '1,234',
    rightLabel = 'Last Period',
    rightValue = '987',
    unit = '',
    showDifference = true
}) {
    const leftNum = typeof leftValue === 'string' ? parseFloat(leftValue.replace(/,/g, '')) : leftValue
    const rightNum = typeof rightValue === 'string' ? parseFloat(rightValue.replace(/,/g, '')) : rightValue

    const difference = leftNum - rightNum
    const percentChange = rightNum > 0 ? ((difference / rightNum) * 100).toFixed(1) : 0
    const isPositive = difference > 0

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-4">{title}</h3>

            <div className="flex-1 flex items-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Left */}
                    <div className="text-center p-3 rounded-lg bg-[hsl(var(--primary)/0.1)]">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                            {leftLabel}
                        </p>
                        <p className="text-2xl font-bold text-[hsl(var(--primary))]">
                            {leftValue}{unit}
                        </p>
                    </div>

                    {/* Right */}
                    <div className="text-center p-3 rounded-lg bg-[hsl(var(--muted)/0.5)]">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                            {rightLabel}
                        </p>
                        <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                            {rightValue}{unit}
                        </p>
                    </div>
                </div>
            </div>

            {/* Difference */}
            {showDifference && (
                <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] text-center">
                    <span className={cn(
                        'text-sm font-medium',
                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}>
                        {isPositive ? '↑' : '↓'} {Math.abs(difference).toLocaleString()}{unit} ({isPositive ? '+' : ''}{percentChange}%)
                    </span>
                </div>
            )}
        </div>
    )
}
