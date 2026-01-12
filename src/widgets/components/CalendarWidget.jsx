import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react'
import { useState } from 'react'

/**
 * CalendarWidget Component
 * Mini calendar showing current month
 */
export default function CalendarWidget({
    title = 'Calendar',
    events = []
}) {
    const [currentDate] = useState(new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const today = currentDate.getDate()

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }

    const defaultEvents = [5, 12, 18, 25] // Days with events
    const eventDays = events.length > 0 ? events : defaultEvents

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    {monthNames[month]} {year}
                </h3>
            </div>

            <div className="flex-1">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-xs text-[hsl(var(--muted-foreground))] font-medium">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={cn(
                                'aspect-square flex items-center justify-center text-xs rounded-full relative',
                                day === today && 'bg-[hsl(var(--primary))] text-white font-bold',
                                day && day !== today && 'hover:bg-[hsl(var(--muted))]',
                                !day && 'invisible'
                            )}
                        >
                            {day}
                            {day && eventDays.includes(day) && day !== today && (
                                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[hsl(var(--primary))]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
