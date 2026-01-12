import { Clock, Calendar, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

/**
 * WorldClock Widget
 * Shows current time in different timezones
 */
export default function WorldClock({
    title = 'World Clock',
    cities = []
}) {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const defaultCities = [
        { name: 'Istanbul', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
        { name: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
        { name: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
        { name: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    ]

    const items = cities.length > 0 ? cities : defaultCities

    const getTimeInTimezone = (timezone) => {
        try {
            return time.toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        } catch {
            return '--:--'
        }
    }

    const getDateInTimezone = (timezone) => {
        try {
            return time.toLocaleDateString('en-US', {
                timeZone: timezone,
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return '--'
        }
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3">
                {items.map((city, index) => (
                    <div
                        key={index}
                        className="rounded-lg bg-[hsl(var(--muted)/0.5)] p-3 flex flex-col justify-center"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{city.flag}</span>
                            <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                                {city.name}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-[hsl(var(--foreground))] font-mono">
                            {getTimeInTimezone(city.timezone)}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">
                            {getDateInTimezone(city.timezone)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
