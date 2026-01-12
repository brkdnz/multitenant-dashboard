import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

/**
 * MapWidget - Placeholder for map display
 */
export default function MapWidget({
    title = 'Location',
    location = 'Istanbul, Turkey',
    coordinates = { lat: 41.0082, lng: 28.9784 }
}) {
    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden flex flex-col">
            {/* Map placeholder */}
            <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center relative min-h-[100px]">
                <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>
                <MapPin className="h-8 w-8 text-red-500 relative z-10" />
            </div>

            {/* Info */}
            <div className="p-3 bg-[hsl(var(--card))]">
                <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm">{title}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{location}</p>
            </div>
        </div>
    )
}
