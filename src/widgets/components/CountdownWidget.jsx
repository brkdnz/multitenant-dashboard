import { cn } from '@/lib/utils'

/**
 * Countdown Widget
 * Countdown to a specific date/event
 */
export default function CountdownWidget({
    title = 'Launch Day',
    targetDate = null,
    theme = 'default'
}) {
    const target = targetDate ? new Date(targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const diff = target - now

    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
    const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))
    const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000))

    const themeClasses = {
        default: 'from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)]',
        success: 'from-emerald-500 to-emerald-600',
        warning: 'from-yellow-500 to-orange-500',
        danger: 'from-red-500 to-pink-500',
    }

    const TimeBlock = ({ value, label }) => (
        <div className="text-center">
            <div className="text-3xl font-bold font-mono">
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-xs opacity-80">{label}</div>
        </div>
    )

    return (
        <div className={cn(
            'h-full rounded-[var(--radius)] p-4 flex flex-col text-white bg-gradient-to-br',
            themeClasses[theme] || themeClasses.default
        )}>
            <h3 className="font-semibold text-center mb-4">{title}</h3>

            <div className="flex-1 flex items-center justify-center">
                <div className="flex gap-4">
                    <TimeBlock value={days} label="DAYS" />
                    <span className="text-2xl">:</span>
                    <TimeBlock value={hours} label="HRS" />
                    <span className="text-2xl">:</span>
                    <TimeBlock value={minutes} label="MIN" />
                    <span className="text-2xl">:</span>
                    <TimeBlock value={seconds} label="SEC" />
                </div>
            </div>

            <p className="text-center text-sm opacity-80 mt-2">
                {target.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </p>
        </div>
    )
}
