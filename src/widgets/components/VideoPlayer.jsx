import { cn } from '@/lib/utils'
import { Play, Pause, Volume2 } from 'lucide-react'

/**
 * VideoPlayer Widget - Video embed placeholder
 */
export default function VideoPlayer({
    title = 'Video Player',
    videoUrl = '',
    thumbnail = '',
    duration = '4:32'
}) {
    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-black overflow-hidden flex flex-col">
            {/* Video area */}
            <div className="flex-1 relative flex items-center justify-center min-h-[120px] bg-gradient-to-b from-gray-800 to-gray-900">
                {/* Play button */}
                <button className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                </button>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-white" />
                        <div className="flex-1 h-1 bg-white/30 rounded-full">
                            <div className="w-1/3 h-full bg-red-500 rounded-full" />
                        </div>
                        <span className="text-xs text-white font-mono">{duration}</span>
                        <Volume2 className="h-4 w-4 text-white" />
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="p-3 bg-[hsl(var(--card))]">
                <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm truncate">{title}</h3>
            </div>
        </div>
    )
}
