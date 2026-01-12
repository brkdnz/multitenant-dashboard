import { cn } from '@/lib/utils'
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react'

/**
 * WeatherCard Widget
 * Display weather information
 */
export default function WeatherCard({
    city = 'Istanbul',
    temperature = 22,
    condition = 'sunny',
    humidity = 65,
    wind = 12,
    forecast = []
}) {
    const conditions = {
        sunny: { icon: Sun, label: 'Sunny', color: 'text-yellow-500' },
        cloudy: { icon: Cloud, label: 'Cloudy', color: 'text-gray-500' },
        rainy: { icon: CloudRain, label: 'Rainy', color: 'text-blue-500' },
        snowy: { icon: CloudSnow, label: 'Snowy', color: 'text-blue-300' },
        windy: { icon: Wind, label: 'Windy', color: 'text-cyan-500' },
    }

    const current = conditions[condition] || conditions.sunny
    const Icon = current.icon

    const defaultForecast = [
        { day: 'Mon', temp: 20, condition: 'cloudy' },
        { day: 'Tue', temp: 18, condition: 'rainy' },
        { day: 'Wed', temp: 22, condition: 'sunny' },
        { day: 'Thu', temp: 24, condition: 'sunny' },
        { day: 'Fri', temp: 21, condition: 'cloudy' },
    ]

    const forecastData = forecast.length > 0 ? forecast : defaultForecast

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-gradient-to-br from-blue-500 to-blue-600 p-4 flex flex-col text-white">
            {/* Current */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{city}</h3>
                    <p className="text-blue-100 text-sm">{current.label}</p>
                </div>
                <Icon className={cn('h-10 w-10', current.color)} />
            </div>

            {/* Temperature */}
            <div className="flex-1 flex items-center">
                <span className="text-5xl font-bold">{temperature}°</span>
            </div>

            {/* Details */}
            <div className="flex gap-4 text-sm text-blue-100 mb-3">
                <span>💧 {humidity}%</span>
                <span>💨 {wind} km/h</span>
            </div>

            {/* Forecast */}
            <div className="flex justify-between pt-3 border-t border-blue-400/30">
                {forecastData.slice(0, 5).map((day, i) => {
                    const DayIcon = conditions[day.condition]?.icon || Cloud
                    return (
                        <div key={i} className="text-center">
                            <p className="text-xs text-blue-200">{day.day}</p>
                            <DayIcon className="h-4 w-4 mx-auto my-1" />
                            <p className="text-sm font-medium">{day.temp}°</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
