import { cn } from '@/lib/utils'
import { Star, Users } from 'lucide-react'

/**
 * TeamMemberCard Widget
 * Display team member information
 */
export default function TeamMemberCard({
    name = 'John Doe',
    role = 'Software Engineer',
    avatar = '',
    status = 'online',
    rating = 4.8,
    tasks = 12
}) {
    const statusColors = {
        online: 'bg-emerald-500',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
        offline: 'bg-gray-400',
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            {/* Avatar & Status */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] flex items-center justify-center text-white font-bold">
                            {initials}
                        </div>
                    )}
                    <span className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[hsl(var(--card))]',
                        statusColors[status] || statusColors.offline
                    )} />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[hsl(var(--foreground))] truncate">{name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">{role}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[hsl(var(--muted)/0.5)] p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-[hsl(var(--foreground))]">{rating}</span>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Rating</p>
                </div>

                <div className="rounded-lg bg-[hsl(var(--muted)/0.5)] p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="font-bold text-[hsl(var(--foreground))]">{tasks}</span>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Tasks</p>
                </div>
            </div>
        </div>
    )
}
