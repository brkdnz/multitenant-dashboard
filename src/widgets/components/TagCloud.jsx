import { cn } from '@/lib/utils'
import { Tag } from 'lucide-react'

/**
 * TagCloud Widget - Display tags/keywords
 */
export default function TagCloud({
    title = 'Popular Tags',
    tags = []
}) {
    const defaultTags = [
        { name: 'React', count: 234, color: 'blue' },
        { name: 'Dashboard', count: 189, color: 'green' },
        { name: 'Analytics', count: 156, color: 'purple' },
        { name: 'Charts', count: 134, color: 'yellow' },
        { name: 'Widgets', count: 98, color: 'red' },
        { name: 'UI/UX', count: 87, color: 'pink' },
        { name: 'API', count: 76, color: 'cyan' },
        { name: 'Data', count: 65, color: 'orange' },
    ]

    const items = tags.length > 0 ? tags : defaultTags

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
        purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400',
        yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
        red: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400',
        pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-400',
        cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400',
        orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 flex flex-wrap gap-2 content-start">
                {items.map((tag, index) => (
                    <span
                        key={index}
                        className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors',
                            colorClasses[tag.color] || colorClasses.blue
                        )}
                    >
                        {tag.name}
                        <span className="ml-1 opacity-60">({tag.count})</span>
                    </span>
                ))}
            </div>
        </div>
    )
}
