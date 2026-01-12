import { cn } from '@/lib/utils'
import { Newspaper } from 'lucide-react'

/**
 * NewsFeed Widget
 * Display news or blog posts
 */
export default function NewsFeed({
    title = 'Latest News',
    articles = []
}) {
    const defaultArticles = [
        {
            title: 'New Dashboard Features Released',
            source: 'Company Blog',
            time: '2 hours ago',
            category: 'Product'
        },
        {
            title: 'Q4 Performance Report Available',
            source: 'Finance',
            time: '5 hours ago',
            category: 'Report'
        },
        {
            title: 'Security Update: Two-Factor Auth',
            source: 'Security Team',
            time: '1 day ago',
            category: 'Security'
        },
    ]

    const items = articles.length > 0 ? articles : defaultArticles

    const categoryColors = {
        Product: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        Report: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        Security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        Update: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Newspaper className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 space-y-3">
                {items.map((article, index) => (
                    <div
                        key={index}
                        className="group cursor-pointer"
                    >
                        <div className="flex items-start gap-2 mb-1">
                            <span className={cn(
                                'text-xs px-1.5 py-0.5 rounded shrink-0',
                                categoryColors[article.category] || 'bg-gray-100 text-gray-700'
                            )}>
                                {article.category}
                            </span>
                        </div>
                        <h4 className="text-sm font-medium text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                            {article.title}
                        </h4>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                            {article.source} • {article.time}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
