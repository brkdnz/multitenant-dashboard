import { cn } from '@/lib/utils'
import { MessageCircle, ThumbsUp, Share2 } from 'lucide-react'

/**
 * SocialPost Widget - Social media style post
 */
export default function SocialPost({
    author = 'John Doe',
    handle = '@johndoe',
    avatar = '',
    content = 'Just launched our new dashboard builder! 🚀 Check it out and let me know what you think.',
    likes = 234,
    comments = 45,
    shares = 12,
    time = '2h ago'
}) {
    const initials = author.split(' ').map(n => n[0]).join('').toUpperCase()

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                {avatar ? (
                    <img src={avatar} alt={author} className="w-10 h-10 rounded-full" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[hsl(var(--foreground))] text-sm truncate">{author}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{handle} • {time}</p>
                </div>
            </div>

            {/* Content */}
            <p className="text-sm text-[hsl(var(--foreground))] flex-1 line-clamp-3">
                {content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[hsl(var(--border))]">
                <button className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs">{likes}</span>
                </button>
                <button className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{comments}</span>
                </button>
                <button className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] hover:text-green-500 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">{shares}</span>
                </button>
            </div>
        </div>
    )
}
