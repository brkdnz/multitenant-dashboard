import { cn } from '@/lib/utils'

/**
 * Funnel Chart Widget
 * Sales/Conversion funnel visualization
 */
export default function FunnelChart({
    title = 'Conversion Funnel',
    stages = null,
    showPercentage = true,
    colorScheme = 'blue' // blue, green, purple, gradient
}) {
    // Default stages if not provided
    const defaultStages = [
        { label: 'Visitors', value: 10000, color: '#3b82f6' },
        { label: 'Leads', value: 5200, color: '#6366f1' },
        { label: 'Qualified', value: 2800, color: '#8b5cf6' },
        { label: 'Proposals', value: 1400, color: '#a855f7' },
        { label: 'Customers', value: 680, color: '#d946ef' }
    ]

    const data = stages || defaultStages
    const maxValue = Math.max(...data.map(s => s.value))

    // Color schemes
    const schemes = {
        blue: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
        green: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
        purple: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
        gradient: ['#f97316', '#ef4444', '#ec4899', '#a855f7', '#6366f1']
    }

    const getColor = (index) => {
        if (data[index]?.color) return data[index].color
        const colors = schemes[colorScheme] || schemes.blue
        return colors[index % colors.length]
    }

    const getWidth = (value) => {
        const minWidth = 40 // Minimum 40% width
        const calculatedWidth = (value / maxValue) * 100
        return Math.max(minWidth, calculatedWidth)
    }

    const getConversionRate = (index) => {
        if (index === 0) return 100
        return ((data[index].value / data[0].value) * 100).toFixed(1)
    }

    const getDropRate = (index) => {
        if (index === 0) return null
        const prev = data[index - 1].value
        const curr = data[index].value
        return ((1 - curr / prev) * 100).toFixed(0)
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-4">{title}</h3>

            <div className="flex-1 flex flex-col justify-center space-y-2">
                {data.map((stage, index) => (
                    <div key={stage.label} className="flex items-center gap-3">
                        {/* Funnel bar */}
                        <div
                            className="h-10 rounded-lg flex items-center justify-center text-white font-medium text-sm transition-all hover:opacity-90 relative overflow-hidden"
                            style={{
                                width: `${getWidth(stage.value)}%`,
                                backgroundColor: getColor(index),
                                marginLeft: `${(100 - getWidth(stage.value)) / 2}%`
                            }}
                        >
                            <span className="z-10">{stage.label}</span>
                            <div
                                className="absolute inset-0 bg-white/10"
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'
                                }}
                            />
                        </div>

                        {/* Stats */}
                        <div className="w-24 text-right shrink-0">
                            <div className="font-semibold text-[hsl(var(--foreground))]">
                                {stage.value.toLocaleString()}
                            </div>
                            {showPercentage && (
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                    {getConversionRate(index)}%
                                    {getDropRate(index) && (
                                        <span className="text-red-500 ml-1">
                                            ↓{getDropRate(index)}%
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] flex justify-between text-sm">
                <span className="text-[hsl(var(--muted-foreground))]">Overall Conversion</span>
                <span className="font-semibold text-emerald-500">
                    {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
                </span>
            </div>
        </div>
    )
}
