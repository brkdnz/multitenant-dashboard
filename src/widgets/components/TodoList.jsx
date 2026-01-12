import { cn } from '@/lib/utils'
import { CheckCircle, Circle, Clock } from 'lucide-react'

/**
 * TodoList Widget
 * Simple todo list with checkboxes
 */
export default function TodoList({
    title = 'Tasks',
    tasks = []
}) {
    const defaultTasks = [
        { id: 1, text: 'Review dashboard design', done: true },
        { id: 2, text: 'Update API documentation', done: false },
        { id: 3, text: 'Fix navigation bug', done: false, priority: 'high' },
        { id: 4, text: 'Prepare release notes', done: true },
        { id: 5, text: 'Team meeting at 3pm', done: false },
    ]

    const items = tasks.length > 0 ? tasks : defaultTasks
    const completedCount = items.filter(t => t.done).length

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {completedCount}/{items.length} done
                </span>
            </div>

            <div className="flex-1 overflow-auto space-y-2">
                {items.map((task, index) => (
                    <div
                        key={task.id || index}
                        className="flex items-start gap-2 group"
                    >
                        {task.done ? (
                            <CheckCircle className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                        ) : (
                            <Circle className="h-4 w-4 mt-0.5 text-[hsl(var(--muted-foreground))] shrink-0" />
                        )}
                        <span className={cn(
                            'text-sm flex-1',
                            task.done
                                ? 'text-[hsl(var(--muted-foreground))] line-through'
                                : 'text-[hsl(var(--foreground))]'
                        )}>
                            {task.text}
                        </span>
                        {task.priority === 'high' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                High
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
