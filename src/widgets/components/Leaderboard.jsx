import { cn } from '@/lib/utils'

/**
 * Leaderboard Widget
 * Display ranked list of items/users
 */
export default function Leaderboard({
    title = 'Top Performers',
    items = []
}) {
    const defaultItems = [
        { rank: 1, name: 'Alice Johnson', value: '2,450', avatar: '👩‍💼' },
        { rank: 2, name: 'Bob Smith', value: '2,120', avatar: '👨‍💻' },
        { rank: 3, name: 'Carol White', value: '1,890', avatar: '👩‍🔬' },
        { rank: 4, name: 'David Brown', value: '1,650', avatar: '👨‍🎨' },
        { rank: 5, name: 'Emma Davis', value: '1,420', avatar: '👩‍🚀' },
    ]

    const data = items.length > 0 ? items : defaultItems

    const rankStyles = {
        1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        2: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        3: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">{title}</h3>

            <div className="flex-1 space-y-2">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--muted)/0.5)] transition-colors"
                    >
                        <span className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                            rankStyles[item.rank] || 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                        )}>
                            {item.rank}
                        </span>

                        <span className="text-xl">{item.avatar}</span>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                                {item.name}
                            </p>
                        </div>

                        <span className="text-sm font-bold text-[hsl(var(--primary))]">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
