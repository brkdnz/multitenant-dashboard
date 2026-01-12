import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * QuoteCard Widget
 * Displays an inspirational quote
 */
export default function QuoteCard({
    quote = "The only way to do great work is to love what you do.",
    author = "Steve Jobs",
    role = "Co-founder of Apple"
}) {
    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--primary)/0.1)] to-[hsl(var(--primary)/0.05)] p-4 flex flex-col">
            <Quote className="h-8 w-8 text-[hsl(var(--primary)/0.3)] mb-2" />

            <blockquote className="flex-1 flex flex-col justify-center">
                <p className="text-lg italic text-[hsl(var(--foreground))] leading-relaxed mb-4">
                    "{quote}"
                </p>

                <footer className="mt-auto">
                    <cite className="not-italic">
                        <span className="font-semibold text-[hsl(var(--foreground))]">
                            {author}
                        </span>
                        {role && (
                            <span className="text-sm text-[hsl(var(--muted-foreground))] block">
                                {role}
                            </span>
                        )}
                    </cite>
                </footer>
            </blockquote>
        </div>
    )
}
