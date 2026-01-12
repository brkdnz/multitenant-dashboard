import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Guided Tour Context
 */
const TourContext = createContext(null)

export const useTour = () => useContext(TourContext)

/**
 * Tour Step Definition
 * @typedef {object} TourStep
 * @property {string} target - CSS selector for target element
 * @property {string} title - Step title
 * @property {string} content - Step description
 * @property {'top'|'bottom'|'left'|'right'} [placement='bottom'] - Tooltip placement
 * @property {boolean} [spotlight=true] - Highlight target element
 * @property {function} [onEnter] - Callback when step starts
 * @property {function} [onExit] - Callback when step ends
 */

/**
 * GuidedTour Provider
 */
export function GuidedTourProvider({ children, steps = [], onComplete }) {
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [targetRect, setTargetRect] = useState(null)

    const step = steps[currentStep]

    // Find and highlight target element
    useEffect(() => {
        if (!isActive || !step?.target) {
            setTargetRect(null)
            return
        }

        const findTarget = () => {
            const element = document.querySelector(step.target)
            if (element) {
                const rect = element.getBoundingClientRect()
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                })

                // Scroll into view
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })

                // Call onEnter callback
                step.onEnter?.()
            } else {
                setTargetRect(null)
            }
        }

        // Small delay to ensure DOM is ready
        const timer = setTimeout(findTarget, 100)

        // Update on resize
        window.addEventListener('resize', findTarget)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', findTarget)
            step.onExit?.()
        }
    }, [isActive, currentStep, step])

    const startTour = useCallback(() => {
        setCurrentStep(0)
        setIsActive(true)
    }, [])

    const endTour = useCallback(() => {
        setIsActive(false)
        setCurrentStep(0)
        setTargetRect(null)
    }, [])

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            endTour()
            onComplete?.()
        }
    }, [currentStep, steps.length, endTour, onComplete])

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }, [currentStep])

    const goToStep = useCallback((index) => {
        if (index >= 0 && index < steps.length) {
            setCurrentStep(index)
        }
    }, [steps.length])

    const value = {
        isActive,
        currentStep,
        totalSteps: steps.length,
        step,
        targetRect,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
    }

    return (
        <TourContext.Provider value={value}>
            {children}
            {isActive && <TourOverlay />}
        </TourContext.Provider>
    )
}

/**
 * Tour Overlay with spotlight and tooltip
 */
function TourOverlay() {
    const { step, targetRect, currentStep, totalSteps, nextStep, prevStep, endTour } = useTour()

    if (!step) return null

    const placement = step.placement || 'bottom'
    const spotlight = step.spotlight !== false

    // Calculate tooltip position
    const getTooltipStyle = () => {
        if (!targetRect) {
            return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        }

        const padding = 12
        const tooltipWidth = 320

        switch (placement) {
            case 'top':
                return {
                    bottom: `calc(100% - ${targetRect.top - padding}px)`,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translateX(-50%)',
                }
            case 'bottom':
                return {
                    top: targetRect.top + targetRect.height + padding,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translateX(-50%)',
                }
            case 'left':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    right: `calc(100% - ${targetRect.left - padding}px)`,
                    transform: 'translateY(-50%)',
                }
            case 'right':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.left + targetRect.width + padding,
                    transform: 'translateY(-50%)',
                }
            default:
                return {
                    top: targetRect.top + targetRect.height + padding,
                    left: targetRect.left + targetRect.width / 2,
                    transform: 'translateX(-50%)',
                }
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Dark overlay with spotlight cutout */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {spotlight && targetRect && (
                            <rect
                                x={targetRect.left - 8}
                                y={targetRect.top - 8}
                                width={targetRect.width + 16}
                                height={targetRect.height + 16}
                                rx="8"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.75)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Spotlight border */}
            {spotlight && targetRect && (
                <div
                    className="absolute border-2 border-[hsl(var(--primary))] rounded-lg pointer-events-none animate-pulse"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        boxShadow: '0 0 0 4px hsl(var(--primary) / 0.3)',
                    }}
                />
            )}

            {/* Tooltip */}
            <div
                className="absolute z-10 w-80 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-2xl p-4"
                style={getTooltipStyle()}
            >
                {/* Close button */}
                <button
                    onClick={endTour}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                >
                    <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>

                {/* Content */}
                <div className="pr-6">
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                        {step.title}
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                        {step.content}
                    </p>
                </div>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-1.5 mb-4">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => useTour().goToStep(i)}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all',
                                i === currentStep
                                    ? 'bg-[hsl(var(--primary))] w-4'
                                    : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground))]'
                            )}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Geri
                    </Button>

                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {currentStep + 1} / {totalSteps}
                    </span>

                    <Button
                        size="sm"
                        onClick={nextStep}
                    >
                        {currentStep === totalSteps - 1 ? 'Bitir' : 'İleri'}
                        {currentStep < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    )
}

/**
 * Tour Trigger Button
 */
export function TourTrigger({ className, children }) {
    const tour = useTour()

    if (!tour) return null

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={tour.startTour}
            className={className}
        >
            {children || (
                <>
                    <Play className="h-4 w-4 mr-2" />
                    Demo Başlat
                </>
            )}
        </Button>
    )
}

/**
 * Restart Tour Button
 */
export function TourRestart({ className }) {
    const tour = useTour()

    if (!tour) return null

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={tour.startTour}
            className={className}
        >
            <RotateCcw className="h-4 w-4 mr-2" />
            Turu Yeniden Başlat
        </Button>
    )
}

export default GuidedTourProvider
