import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

/**
 * RatingWidget - Display rating with stars
 */
export default function RatingWidget({
    title = 'Customer Rating',
    rating = 4.5,
    totalReviews = 1234,
    breakdown = []
}) {
    const defaultBreakdown = [
        { stars: 5, percentage: 70 },
        { stars: 4, percentage: 20 },
        { stars: 3, percentage: 6 },
        { stars: 2, percentage: 2 },
        { stars: 1, percentage: 2 },
    ]

    const data = breakdown.length > 0 ? breakdown : defaultBreakdown

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">{title}</h3>

            <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                    <div className="text-4xl font-bold text-[hsl(var(--foreground))]">{rating}</div>
                    <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    'h-4 w-4',
                                    star <= Math.floor(rating)
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : star === Math.ceil(rating) && rating % 1 > 0
                                            ? 'text-yellow-500 fill-yellow-500/50'
                                            : 'text-gray-300'
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                        {totalReviews.toLocaleString()} reviews
                    </p>
                </div>

                <div className="flex-1 space-y-1">
                    {data.map((item) => (
                        <div key={item.stars} className="flex items-center gap-2">
                            <span className="text-xs w-3">{item.stars}</span>
                            <div className="flex-1 h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-[hsl(var(--muted-foreground))] w-8">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
