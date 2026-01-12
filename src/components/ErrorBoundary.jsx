import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Error Boundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo })

        // Log error to console (in production, send to error tracking service)
        console.error('ErrorBoundary caught an error:', error, errorInfo)

        // Call onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })

        if (this.props.onReset) {
            this.props.onReset()
        }
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default error UI
            return (
                <div className="flex h-full min-h-[200px] items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.05)] p-6">
                    <div className="text-center max-w-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--destructive)/0.1)] mx-auto mb-4">
                            <AlertTriangle className="h-6 w-6 text-[hsl(var(--destructive))]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                            {this.props.title || 'Something went wrong'}
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                            {this.props.message || 'An error occurred while rendering this component.'}
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left mb-4 p-3 rounded bg-[hsl(var(--muted)/0.5)] text-xs">
                                <summary className="cursor-pointer font-medium text-[hsl(var(--foreground))]">
                                    Error Details
                                </summary>
                                <pre className="mt-2 overflow-auto text-[hsl(var(--destructive))]">
                                    {this.state.error.toString()}
                                </pre>
                                {this.state.errorInfo && (
                                    <pre className="mt-2 overflow-auto text-[hsl(var(--muted-foreground))]">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </details>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={this.handleReset}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

/**
 * Widget Error Boundary
 * Specialized error boundary for widgets with compact UI
 */
export class WidgetErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error(`Widget "${this.props.widgetId}" error:`, error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-full items-center justify-center rounded-[var(--radius)] border border-dashed border-[hsl(var(--destructive)/0.5)] bg-[hsl(var(--destructive)/0.05)] p-4">
                    <div className="text-center">
                        <AlertTriangle className="h-8 w-8 text-[hsl(var(--destructive)/0.5)] mx-auto mb-2" />
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Widget failed to load
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="mt-2 text-xs text-[hsl(var(--primary))] hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
