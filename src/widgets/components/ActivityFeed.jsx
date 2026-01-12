import { cn } from '@/lib/utils'

/**
 * ActivityFeed Widget
 * Shows a list of recent activities/events
 */
export default function ActivityFeed({
    title = 'Recent Activity',
    activities = []
}) {
    const defaultActivities = [
        { id: 1, user: 'John Doe', action: 'updated', target: 'Dashboard', time: '2 min ago', color: 'blue' },
        { id: 2, user: 'Jane Smith', action: 'created', target: 'Report', time: '15 min ago', color: 'green' },
        { id: 3, user: 'Bob Wilson', action: 'deleted', target: 'Old Data', time: '1 hour ago', color: 'red' },
        { id: 4, user: 'Alice Brown', action: 'shared', target: 'Document', time: '2 hours ago', color: 'purple' },
    ]

    const items = activities.length > 0 ? activities : defaultActivities

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">{title}</h3>

            <div className="flex-1 overflow-auto space-y-3">
                {items.map((activity, index) => (
                    <div key={activity.id || index} className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                            colorClasses[activity.color] || colorClasses.blue
                        )}>
                            {activity.user?.charAt(0) || '?'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-[hsl(var(--foreground))]">
                                <span className="font-medium">{activity.user}</span>
                                {' '}{activity.action}{' '}
                                <span className="font-medium">{activity.target}</span>
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
