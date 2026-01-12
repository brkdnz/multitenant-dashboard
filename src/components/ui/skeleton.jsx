import { cn } from '@/lib/utils'

/**
 * Skeleton - Loading placeholder component
 */
export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-[hsl(var(--muted))]',
                className
            )}
            {...props}
        />
    )
}

/**
 * SkeletonCard - Card-shaped skeleton
 */
export function SkeletonCard({ className }) {
    return (
        <div className={cn('rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4', className)}>
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
            </div>
        </div>
    )
}

/**
 * SkeletonWidget - Widget-shaped skeleton
 */
export function SkeletonWidget({ className }) {
    return (
        <div className={cn('h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4', className)}>
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-16 w-full mb-4" />
            <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    )
}

/**
 * SkeletonTable - Table-shaped skeleton
 */
export function SkeletonTable({ rows = 5, className }) {
    return (
        <div className={cn('rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden', className)}>
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-[hsl(var(--border))] last:border-b-0">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    )
}

/**
 * SkeletonDashboard - Full dashboard skeleton
 */
export function SkeletonDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-12 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="col-span-12 md:col-span-3">
                        <SkeletonWidget />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8">
                    <SkeletonCard className="h-64" />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <SkeletonCard className="h-64" />
                </div>
            </div>
        </div>
    )
}

/**
 * PageLoader - Full page loading state
 */
export function PageLoader({ message = 'Loading...' }) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-[hsl(var(--muted))]" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[hsl(var(--primary))] animate-spin" />
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{message}</p>
            </div>
        </div>
    )
}

export default Skeleton
