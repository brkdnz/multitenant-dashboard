import { useState } from 'react'
import { CheckCircle2, Circle, Users, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Poll Widget
 * Interactive voting/survey widget
 */
export default function PollWidget({
    title = 'Quick Poll',
    question = 'What feature would you like to see next?',
    options = null,
    allowMultiple = false,
    showResults = true,
    totalVotes = null
}) {
    // Default options if not provided
    const defaultOptions = [
        { id: 1, text: 'Dark mode improvements', votes: 145 },
        { id: 2, text: 'Mobile app', votes: 89 },
        { id: 3, text: 'API integrations', votes: 67 },
        { id: 4, text: 'Custom widgets', votes: 112 }
    ]

    const [pollOptions, setPollOptions] = useState(options || defaultOptions)
    const [selectedOptions, setSelectedOptions] = useState([])
    const [hasVoted, setHasVoted] = useState(false)

    const total = totalVotes || pollOptions.reduce((sum, opt) => sum + opt.votes, 0)

    const handleVote = (optionId) => {
        if (hasVoted) return

        if (allowMultiple) {
            setSelectedOptions(prev =>
                prev.includes(optionId)
                    ? prev.filter(id => id !== optionId)
                    : [...prev, optionId]
            )
        } else {
            setSelectedOptions([optionId])
        }
    }

    const submitVote = () => {
        if (selectedOptions.length === 0) return

        setPollOptions(prev => prev.map(opt => ({
            ...opt,
            votes: selectedOptions.includes(opt.id) ? opt.votes + 1 : opt.votes
        })))
        setHasVoted(true)
    }

    const getPercentage = (votes) => {
        if (total === 0) return 0
        return ((votes / total) * 100).toFixed(1)
    }

    const maxVotes = Math.max(...pollOptions.map(o => o.votes))

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                    <Users className="h-3 w-3" />
                    {total} votes
                </div>
            </div>

            <p className="text-sm text-[hsl(var(--foreground))] mb-4">{question}</p>

            <div className="flex-1 space-y-2">
                {pollOptions.map(option => {
                    const percentage = getPercentage(option.votes)
                    const isSelected = selectedOptions.includes(option.id)
                    const isWinning = option.votes === maxVotes && hasVoted

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            disabled={hasVoted}
                            className={cn(
                                'w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden',
                                hasVoted
                                    ? 'cursor-default'
                                    : 'cursor-pointer hover:border-[hsl(var(--primary))]',
                                isSelected && !hasVoted
                                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
                                    : 'border-[hsl(var(--border))]'
                            )}
                        >
                            {/* Background bar */}
                            {(showResults || hasVoted) && (
                                <div
                                    className={cn(
                                        'absolute inset-0 transition-all duration-500',
                                        isWinning
                                            ? 'bg-emerald-500/20'
                                            : 'bg-[hsl(var(--muted))]'
                                    )}
                                    style={{ width: hasVoted ? `${percentage}%` : '0%' }}
                                />
                            )}

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {hasVoted ? (
                                        isSelected ? (
                                            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--primary))]" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                        )
                                    ) : (
                                        <div className={cn(
                                            'w-4 h-4 rounded-full border-2 transition-colors',
                                            isSelected
                                                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]'
                                                : 'border-[hsl(var(--muted-foreground))]'
                                        )}>
                                            {isSelected && (
                                                <div className="w-full h-full rounded-full flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <span className={cn(
                                        'text-sm',
                                        isWinning ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-[hsl(var(--foreground))]'
                                    )}>
                                        {option.text}
                                    </span>
                                </div>

                                {(showResults || hasVoted) && (
                                    <span className={cn(
                                        'text-sm font-medium',
                                        isWinning ? 'text-emerald-600 dark:text-emerald-400' : 'text-[hsl(var(--muted-foreground))]'
                                    )}>
                                        {percentage}%
                                    </span>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {!hasVoted && (
                <button
                    onClick={submitVote}
                    disabled={selectedOptions.length === 0}
                    className={cn(
                        'mt-4 w-full py-2 rounded-lg font-medium text-sm transition-colors',
                        selectedOptions.length > 0
                            ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90'
                            : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed'
                    )}
                >
                    Vote
                </button>
            )}

            {hasVoted && (
                <div className="mt-4 text-center text-sm text-emerald-500 font-medium">
                    ✓ Thanks for voting!
                </div>
            )}
        </div>
    )
}
