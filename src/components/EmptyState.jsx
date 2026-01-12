import { cn } from '@/lib/utils'
import {
    Inbox,
    FileX,
    Search,
    FolderOpen,
    LayoutGrid,
    Users,
    Settings,
    PlusCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Empty state illustrations by type
 */
const illustrations = {
    inbox: { icon: Inbox, color: 'text-blue-500' },
    noResults: { icon: Search, color: 'text-orange-500' },
    noData: { icon: FileX, color: 'text-gray-500' },
    noFiles: { icon: FolderOpen, color: 'text-yellow-500' },
    noWidgets: { icon: LayoutGrid, color: 'text-purple-500' },
    noUsers: { icon: Users, color: 'text-green-500' },
    noSettings: { icon: Settings, color: 'text-cyan-500' },
}

/**
 * Empty State Component
 * Beautiful placeholder UI for empty content areas
 */
export default function EmptyState({
    type = 'noData',
    icon: CustomIcon,
    title = 'No data yet',
    description = 'Get started by adding your first item.',
    action,
    actionLabel = 'Add Item',
    secondaryAction,
    secondaryLabel,
    className,
    size = 'default', // 'small' | 'default' | 'large'
}) {
    const config = illustrations[type] || illustrations.noData
    const Icon = CustomIcon || config.icon

    const sizeClasses = {
        small: {
            container: 'py-6',
            icon: 'w-10 h-10',
            iconWrapper: 'w-16 h-16',
            title: 'text-base',
            description: 'text-sm',
        },
        default: {
            container: 'py-12',
            icon: 'w-12 h-12',
            iconWrapper: 'w-24 h-24',
            title: 'text-lg',
            description: 'text-sm',
        },
        large: {
            container: 'py-20',
            icon: 'w-16 h-16',
            iconWrapper: 'w-32 h-32',
            title: 'text-xl',
            description: 'text-base',
        },
    }

    const sizes = sizeClasses[size]

    return (
        <div className={cn(
            'flex flex-col items-center justify-center text-center',
            sizes.container,
            className
        )}>
            {/* Icon */}
            <div className={cn(
                'flex items-center justify-center rounded-full bg-[hsl(var(--muted))] mb-4',
                sizes.iconWrapper
            )}>
                <Icon className={cn(sizes.icon, config.color)} />
            </div>

            {/* Title */}
            <h3 className={cn(
                'font-semibold text-[hsl(var(--foreground))] mb-1',
                sizes.title
            )}>
                {title}
            </h3>

            {/* Description */}
            <p className={cn(
                'text-[hsl(var(--muted-foreground))] max-w-sm mb-4',
                sizes.description
            )}>
                {description}
            </p>

            {/* Actions */}
            {(action || secondaryAction) && (
                <div className="flex items-center gap-3">
                    {action && (
                        <Button onClick={action}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            {actionLabel}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button variant="outline" onClick={secondaryAction}>
                            {secondaryLabel}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * Preset Empty States for common use cases
 */
export function EmptyWidgets({ onAdd }) {
    return (
        <EmptyState
            type="noWidgets"
            title="No widgets added yet"
            description="Start building your dashboard by adding widgets from the gallery."
            action={onAdd}
            actionLabel="Browse Widgets"
        />
    )
}

export function EmptySearchResults({ query, onClear }) {
    return (
        <EmptyState
            type="noResults"
            title={`No results for "${query}"`}
            description="Try adjusting your search terms or filters."
            action={onClear}
            actionLabel="Clear Search"
        />
    )
}

export function EmptyUsers({ onInvite }) {
    return (
        <EmptyState
            type="noUsers"
            title="No users assigned"
            description="Invite team members to collaborate on this dashboard."
            action={onInvite}
            actionLabel="Invite User"
        />
    )
}

export function EmptyInbox() {
    return (
        <EmptyState
            type="inbox"
            title="You're all caught up!"
            description="No new notifications or items to review."
        />
    )
}

export function EmptyFiles({ onUpload }) {
    return (
        <EmptyState
            type="noFiles"
            title="No files uploaded"
            description="Upload files to share with your team."
            action={onUpload}
            actionLabel="Upload File"
        />
    )
}
