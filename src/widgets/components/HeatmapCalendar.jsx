import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/**
 * Heatmap Calendar Widget
 * GitHub-style contribution/activity heatmap
 */
export default function HeatmapCalendar({
    title = 'Activity',
    data = null,
    colorScheme = 'green', // green, blue, purple, orange
    showMonths = true,
    showWeekdays = true
}) {
    // Generate sample data if not provided
    const activityData = useMemo(() => {
        if (data) return data

        // Generate 365 days of sample data
        const days = []
        const today = new Date()
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            days.push({
                date: date.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 10)
            })
        }
        return days
    }, [data])

    // Color schemes
    const colors = {
        green: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        blue: ['#ebedf0', '#9ecae9', '#6baed6', '#3182bd', '#08519c'],
        purple: ['#ebedf0', '#d4b9da', '#c994c7', '#df65b0', '#980043'],
        orange: ['#ebedf0', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603']
    }

    const getColor = (count) => {
        const scheme = colors[colorScheme] || colors.green
        if (count === 0) return scheme[0]
        if (count <= 2) return scheme[1]
        if (count <= 4) return scheme[2]
        if (count <= 6) return scheme[3]
        return scheme[4]
    }

    // Group by weeks
    const weeks = useMemo(() => {
        const result = []
        let currentWeek = []

        activityData.forEach((day, index) => {
            const date = new Date(day.date)
            const dayOfWeek = date.getDay()

            if (index === 0 && dayOfWeek !== 0) {
                // Pad the first week
                for (let i = 0; i < dayOfWeek; i++) {
                    currentWeek.push(null)
                }
            }

            currentWeek.push(day)

            if (dayOfWeek === 6 || index === activityData.length - 1) {
                result.push(currentWeek)
                currentWeek = []
            }
        })

        return result
    }, [activityData])

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const totalCount = activityData.reduce((sum, d) => sum + d.count, 0)

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    {totalCount} contributions
                </span>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-0.5">
                    {showWeekdays && (
                        <div className="flex flex-col gap-0.5 text-[10px] text-[hsl(var(--muted-foreground))] mr-1">
                            {weekdays.map((day, i) => (
                                <div key={day} className="h-[10px] flex items-center">
                                    {i % 2 === 1 ? day[0] : ''}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-0.5">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-0.5">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className="w-[10px] h-[10px] rounded-sm transition-all hover:ring-1 hover:ring-[hsl(var(--foreground))]"
                                        style={{ backgroundColor: day ? getColor(day.count) : 'transparent' }}
                                        title={day ? `${day.date}: ${day.count} contributions` : ''}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-[hsl(var(--muted-foreground))]">
                <span>Less</span>
                {colors[colorScheme]?.map((color, i) => (
                    <div
                        key={i}
                        className="w-[10px] h-[10px] rounded-sm"
                        style={{ backgroundColor: color }}
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    )
}
