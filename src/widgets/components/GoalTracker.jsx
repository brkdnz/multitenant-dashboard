import { cn } from '@/lib/utils'
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * GoalTracker Widget
 * Track multiple goals with progress
 */
export default function GoalTracker({
    title = 'Goals',
    goals = []
}) {
    const defaultGoals = [
        { name: 'Monthly Revenue', current: 85000, target: 100000, color: 'blue' },
        { name: 'New Customers', current: 180, target: 200, color: 'green' },
        { name: 'Satisfaction Score', current: 4.5, target: 5, color: 'yellow' },
    ]

    const items = goals.length > 0 ? goals : defaultGoals

    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 space-y-4">
                {items.map((goal, index) => {
                    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100))
                    const isCompleted = percentage >= 100
                    const isOnTrack = percentage >= 80

                    return (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                                    {goal.name}
                                </span>
                                <div className="flex items-center gap-1">
                                    {isCompleted ? (
                                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    ) : isOnTrack ? (
                                        <Minus className="h-3 w-3 text-yellow-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                    )}
                                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {percentage}%
                                    </span>
                                </div>
                            </div>

                            <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all',
                                        colorClasses[goal.color] || colorClasses.blue
                                    )}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <div className="flex justify-between mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                                <span>{goal.current.toLocaleString()}</span>
                                <span>{goal.target.toLocaleString()}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
