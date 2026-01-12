import { cn } from '@/lib/utils'

/**
 * Avatar Group Widget
 * Display team members in a compact row with overlap
 */
export default function AvatarGroup({
    title = 'Team',
    members = null,
    maxVisible = 5,
    size = 'md', // sm, md, lg
    showCount = true,
    showOnlineStatus = true
}) {
    // Default members if not provided
    const defaultMembers = [
        { name: 'Alice Johnson', avatar: null, status: 'online', role: 'Lead Developer' },
        { name: 'Bob Smith', avatar: null, status: 'online', role: 'Designer' },
        { name: 'Carol Davis', avatar: null, status: 'away', role: 'Product Manager' },
        { name: 'David Wilson', avatar: null, status: 'offline', role: 'Backend Dev' },
        { name: 'Eva Martinez', avatar: null, status: 'online', role: 'QA Engineer' },
        { name: 'Frank Brown', avatar: null, status: 'busy', role: 'DevOps' },
        { name: 'Grace Lee', avatar: null, status: 'online', role: 'Frontend Dev' },
    ]

    const data = members || defaultMembers
    const visibleMembers = data.slice(0, maxVisible)
    const remainingCount = data.length - maxVisible

    const sizes = {
        sm: { avatar: 'w-8 h-8', text: 'text-xs', overlap: '-ml-2' },
        md: { avatar: 'w-10 h-10', text: 'text-sm', overlap: '-ml-3' },
        lg: { avatar: 'w-12 h-12', text: 'text-base', overlap: '-ml-4' }
    }

    const sizeConfig = sizes[size] || sizes.md

    const statusColors = {
        online: 'bg-emerald-500',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
        offline: 'bg-gray-400'
    }

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    }

    const getAvatarColor = (name) => {
        const colors = [
            'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-cyan-500', 'bg-teal-500',
            'bg-orange-500', 'bg-rose-500'
        ]
        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }

    const onlineCount = data.filter(m => m.status === 'online').length

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                {showCount && (
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        <span className="text-emerald-500">{onlineCount}</span>/{data.length} online
                    </span>
                )}
            </div>

            {/* Avatar Row */}
            <div className="flex items-center mb-4">
                {visibleMembers.map((member, index) => (
                    <div
                        key={member.name}
                        className={cn(
                            'relative rounded-full border-2 border-[hsl(var(--background))] cursor-pointer transition-transform hover:scale-110 hover:z-10',
                            sizeConfig.avatar,
                            index > 0 && sizeConfig.overlap
                        )}
                        title={`${member.name} - ${member.role || 'Team Member'}`}
                    >
                        {member.avatar ? (
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className={cn(
                                'w-full h-full rounded-full flex items-center justify-center text-white font-medium',
                                sizeConfig.text,
                                getAvatarColor(member.name)
                            )}>
                                {getInitials(member.name)}
                            </div>
                        )}

                        {showOnlineStatus && (
                            <div className={cn(
                                'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[hsl(var(--background))]',
                                statusColors[member.status] || statusColors.offline
                            )} />
                        )}
                    </div>
                ))}

                {remainingCount > 0 && (
                    <div
                        className={cn(
                            'rounded-full border-2 border-[hsl(var(--background))] bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--muted-foreground))] font-medium cursor-pointer hover:bg-[hsl(var(--accent))] transition-colors',
                            sizeConfig.avatar,
                            sizeConfig.text,
                            sizeConfig.overlap
                        )}
                        title={`${remainingCount} more members`}
                    >
                        +{remainingCount}
                    </div>
                )}
            </div>

            {/* Member List */}
            <div className="flex-1 space-y-2 overflow-y-auto">
                {data.slice(0, 4).map(member => (
                    <div key={member.name} className="flex items-center gap-2 text-sm">
                        <div className={cn(
                            'w-2 h-2 rounded-full',
                            statusColors[member.status] || statusColors.offline
                        )} />
                        <span className="text-[hsl(var(--foreground))] truncate flex-1">
                            {member.name}
                        </span>
                        <span className="text-[hsl(var(--muted-foreground))] text-xs truncate">
                            {member.role}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
