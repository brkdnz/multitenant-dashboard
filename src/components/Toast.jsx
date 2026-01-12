import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Toast Context
 */
const ToastContext = createContext(null)

/**
 * Toast types with icons and styles
 */
const toastTypes = {
    success: {
        icon: CheckCircle2,
        className: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
        iconClass: 'text-emerald-500',
    },
    error: {
        icon: AlertCircle,
        className: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        iconClass: 'text-red-500',
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
        iconClass: 'text-yellow-500',
    },
    info: {
        icon: Info,
        className: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
        iconClass: 'text-blue-500',
    },
}

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random()

        setToasts((prev) => [...prev, { id, type, title, message }])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const toast = {
        success: (title, message) => addToast({ type: 'success', title, message }),
        error: (title, message) => addToast({ type: 'error', title, message }),
        warning: (title, message) => addToast({ type: 'warning', title, message }),
        info: (title, message) => addToast({ type: 'info', title, message }),
        custom: addToast,
        dismiss: removeToast,
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                {toasts.map((t) => {
                    const config = toastTypes[t.type] || toastTypes.info
                    const Icon = config.icon

                    return (
                        <div
                            key={t.id}
                            className={cn(
                                'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-5 fade-in duration-300',
                                config.className
                            )}
                            role="alert"
                        >
                            <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.iconClass)} />
                            <div className="flex-1 min-w-0">
                                {t.title && (
                                    <p className="font-semibold text-[hsl(var(--foreground))] text-sm">
                                        {t.title}
                                    </p>
                                )}
                                {t.message && (
                                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                                        {t.message}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}

/**
 * Hook to use toast
 */
export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }

    return context
}

export default ToastProvider
