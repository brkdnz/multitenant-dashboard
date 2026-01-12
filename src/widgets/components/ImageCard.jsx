import { cn } from '@/lib/utils'
import { Image, MapPin, ExternalLink } from 'lucide-react'

/**
 * ImageCard Widget
 * Display an image with title and description
 */
export default function ImageCard({
    title = 'Featured Image',
    description = 'A beautiful landscape photo',
    imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    aspectRatio = '16/9'
}) {
    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden flex flex-col">
            {/* Image */}
            <div
                className="relative bg-[hsl(var(--muted))] flex-1 min-h-[120px]"
                style={{ aspectRatio }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-12 w-12 text-[hsl(var(--muted-foreground))]" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm truncate">
                    {title}
                </h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 mt-1">
                    {description}
                </p>
            </div>
        </div>
    )
}
