import { cn } from '@/lib/utils'
import { Link, ExternalLink, Globe } from 'lucide-react'

/**
 * QuickLinks Widget
 * Display a list of quick access links
 */
export default function QuickLinks({
    title = 'Quick Links',
    links = []
}) {
    const defaultLinks = [
        { label: 'Documentation', url: '#', icon: '📚' },
        { label: 'API Reference', url: '#', icon: '🔧' },
        { label: 'Support Center', url: '#', icon: '💬' },
        { label: 'Status Page', url: '#', icon: '✅' },
        { label: 'Changelog', url: '#', icon: '📝' },
        { label: 'Community', url: '#', icon: '👥' },
    ]

    const items = links.length > 0 ? links : defaultLinks

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Link className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-2">
                {items.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors group"
                    >
                        <span className="text-lg">{link.icon}</span>
                        <span className="text-sm text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] truncate">
                            {link.label}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    )
}
