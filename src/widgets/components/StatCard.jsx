import {
    Users,
    DollarSign,
    Package,
    TrendingUp,
    TrendingDown,
    Activity,
    ShoppingCart,
    Eye
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Icon mapping for dynamic icon rendering
 */
const iconMap = {
    users: Users,
    dollar: DollarSign,
    package: Package,
    trending: TrendingUp,
    activity: Activity,
    cart: ShoppingCart,
    eye: Eye,
}

/**
 * StatCard Widget
 * Displays a single metric value with optional trend indicator
 * 
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {string} props.value - Main value to display
 * @param {string} props.icon - Icon name from iconMap
 * @param {object} props.trend - Optional trend { value: string, positive: boolean }
 */
export default function StatCard({ title, value, icon = 'trending', trend }) {
    const IconComponent = iconMap[icon] || TrendingUp
    const TrendIcon = trend?.positive ? TrendingUp : TrendingDown

    return (
        <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="flex h-full items-center gap-4 p-6">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--primary)/0.1)]">
                    <IconComponent className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] truncate">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                            {value}
                        </p>
                        {trend && (
                            <span
                                className={cn(
                                    'flex items-center gap-0.5 text-xs font-medium',
                                    trend.positive
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                )}
                            >
                                <TrendIcon className="h-3 w-3" />
                                {trend.value}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
