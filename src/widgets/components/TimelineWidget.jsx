import { cn } from '@/lib/utils'
import { Milestone } from 'lucide-react'

/**
 * Timeline Widget - Vertical timeline
 */
export default function TimelineWidget({
    title = 'Timeline',
    events = []
}) {
    const defaultEvents = [
        { title: 'Project Started', description: 'Initial planning phase', date: 'Jan 1', status: 'completed' },
        { title: 'Design Phase', description: 'UI/UX wireframes', date: 'Jan 15', status: 'completed' },
        { title: 'Development', description: 'Core features', date: 'Feb 1', status: 'current' },
        { title: 'Testing', description: 'QA & bug fixes', date: 'Mar 1', status: 'upcoming' },
        { title: 'Launch', description: 'Go live!', date: 'Mar 15', status: 'upcoming' },
    ]

    const items = events.length > 0 ? events : defaultEvents

    const statusColors = {
        completed: 'bg-emerald-500',
        current: 'bg-blue-500 animate-pulse',
        upcoming: 'bg-gray-300 dark:bg-gray-600',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Milestone className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[hsl(var(--border))]" />

                <div className="space-y-3">
                    {items.map((event, index) => (
                        <div key={index} className="flex gap-3 relative">
                            {/* Dot */}
                            <div className={cn(
                                'w-4 h-4 rounded-full shrink-0 mt-0.5 z-10',
                                statusColors[event.status] || statusColors.upcoming
                            )} />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className={cn(
                                        'text-sm font-medium truncate',
                                        event.status === 'upcoming'
                                            ? 'text-[hsl(var(--muted-foreground))]'
                                            : 'text-[hsl(var(--foreground))]'
                                    )}>
                                        {event.title}
                                    </p>
                                    <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">
                                        {event.date}
                                    </span>
                                </div>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
