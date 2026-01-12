import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Palette, Globe, LayoutGrid, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Onboarding steps configuration
 */
const steps = [
    {
        id: 'welcome',
        title: 'Welcome to Your Dashboard! 🎉',
        description: 'This multi-tenant dashboard builder lets you create beautiful, customizable dashboards for your organization.',
        icon: Sparkles,
        content: (
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.5)]">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Let's get you started</h3>
                <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
                    We'll walk you through the main features so you can get the most out of your dashboard.
                </p>
            </div>
        )
    },
    {
        id: 'widgets',
        title: 'Drag & Drop Widgets',
        description: 'Build your perfect dashboard by adding and arranging widgets.',
        icon: LayoutGrid,
        content: (
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    {['Stats', 'Charts', 'Tables'].map((type) => (
                        <div key={type} className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-center">
                            <LayoutGrid className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--primary))]" />
                            <span className="text-sm font-medium">{type}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 rounded-lg bg-[hsl(var(--muted))] text-sm">
                    <strong>Tip:</strong> Visit the <em>Widget Gallery</em> to browse 35+ widget types and add them to your dashboard.
                </div>
            </div>
        )
    },
    {
        id: 'theme',
        title: 'Customize Your Theme',
        description: 'Make it yours with custom colors, fonts, and branding.',
        icon: Palette,
        content: (
            <div className="space-y-4">
                <div className="flex gap-3 justify-center">
                    {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
                        <div
                            key={color}
                            className="w-12 h-12 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <div className="p-4 rounded-lg bg-[hsl(var(--muted))] text-sm">
                    <strong>Tip:</strong> Go to <em>Admin Panel → Theme</em> to customize colors, presets, and dark mode.
                </div>
            </div>
        )
    },
    {
        id: 'i18n',
        title: 'Multi-Language Support',
        description: 'Your dashboard supports multiple languages out of the box.',
        icon: Globe,
        content: (
            <div className="space-y-4">
                <div className="flex gap-3 justify-center text-3xl">
                    <span>🇹🇷</span>
                    <span>🇬🇧</span>
                    <span>🇩🇪</span>
                    <span>🇫🇷</span>
                    <span>🇪🇸</span>
                </div>
                <div className="p-4 rounded-lg bg-[hsl(var(--muted))] text-sm">
                    <strong>Tip:</strong> Switch languages from the header or configure defaults in <em>Admin Panel → Language</em>.
                </div>
            </div>
        )
    },
    {
        id: 'access',
        title: 'Role-Based Access',
        description: 'Control who sees what with powerful permission settings.',
        icon: Shield,
        content: (
            <div className="space-y-4">
                <div className="flex gap-2 justify-center flex-wrap">
                    {[
                        { role: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
                        { role: 'Manager', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
                        { role: 'User', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
                        { role: 'Guest', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
                    ].map(({ role, color }) => (
                        <span key={role} className={cn('px-3 py-1 rounded-full text-sm font-medium', color)}>
                            {role}
                        </span>
                    ))}
                </div>
                <div className="p-4 rounded-lg bg-[hsl(var(--muted))] text-sm">
                    <strong>Tip:</strong> Manage roles in <em>Admin Panel → Access</em> to control widget visibility per role.
                </div>
            </div>
        )
    },
    {
        id: 'done',
        title: 'You\'re All Set! 🚀',
        description: 'Start building your dashboard now.',
        icon: Check,
        content: (
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold">Ready to go!</h3>
                <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
                    Press <kbd className="px-2 py-1 rounded bg-[hsl(var(--muted))] font-mono text-sm">Cmd+K</kbd> anytime for quick navigation.
                </p>
            </div>
        )
    },
]

/**
 * Onboarding Wizard Component
 */
export default function OnboardingWizard({ isOpen, onClose, onComplete }) {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)

    const step = steps[currentStep]
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === steps.length - 1

    const handleNext = () => {
        if (isLastStep) {
            handleComplete()
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleComplete = () => {
        // Mark onboarding as complete in localStorage
        localStorage.setItem('onboarding_completed', 'true')
        onComplete?.()
        onClose()
    }

    const handleSkip = () => {
        // Mark as skipped
        localStorage.setItem('onboarding_completed', 'skipped')
        onClose()
    }

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0)
        }
    }, [isOpen])

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
                handleNext()
            } else if (e.key === 'ArrowLeft') {
                handlePrev()
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, currentStep])

    if (!isOpen) return null

    const Icon = step.icon

    return createPortal(
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />

            {/* Modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-[hsl(var(--background))] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                    {/* Progress */}
                    <div className="h-1 bg-[hsl(var(--muted))]">
                        <div
                            className="h-full bg-[hsl(var(--primary))] transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[hsl(var(--primary)/0.1)]">
                                <Icon className="w-5 h-5 text-[hsl(var(--primary))]" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[hsl(var(--foreground))]">{step.title}</h2>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">{step.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 min-h-[200px]">
                        {step.content}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
                        <div className="flex items-center gap-1">
                            {steps.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentStep(idx)}
                                    className={cn(
                                        'w-2 h-2 rounded-full transition-colors',
                                        idx === currentStep
                                            ? 'bg-[hsl(var(--primary))]'
                                            : idx < currentStep
                                                ? 'bg-[hsl(var(--primary)/0.5)]'
                                                : 'bg-[hsl(var(--muted-foreground)/0.3)]'
                                    )}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            {!isLastStep && (
                                <Button variant="ghost" size="sm" onClick={handleSkip}>
                                    Skip
                                </Button>
                            )}
                            {!isFirstStep && (
                                <Button variant="outline" size="sm" onClick={handlePrev}>
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back
                                </Button>
                            )}
                            <Button size="sm" onClick={handleNext}>
                                {isLastStep ? 'Get Started' : 'Next'}
                                {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

/**
 * Hook to manage onboarding state
 */
export function useOnboarding() {
    const [isOpen, setIsOpen] = useState(false)
    const [hasCompleted, setHasCompleted] = useState(() => {
        return localStorage.getItem('onboarding_completed') === 'true'
    })

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])

    const checkAndShow = useCallback(() => {
        const status = localStorage.getItem('onboarding_completed')
        if (!status) {
            // First time user - show onboarding
            setTimeout(() => setIsOpen(true), 500)
        }
    }, [])

    const reset = useCallback(() => {
        localStorage.removeItem('onboarding_completed')
        setHasCompleted(false)
    }, [])

    const complete = useCallback(() => {
        setHasCompleted(true)
    }, [])

    return { isOpen, open, close, checkAndShow, reset, hasCompleted, complete }
}
