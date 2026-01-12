import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Euro, PoundSterling } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Currency Exchange Widget
 * Display live currency exchange rates
 */
export default function CurrencyExchange({
    title = 'Exchange Rates',
    baseCurrency = 'USD',
    currencies = null,
    showTrend = true,
    compact = false
}) {
    const [lastUpdated, setLastUpdated] = useState(new Date())

    // Default currencies if not provided
    const defaultCurrencies = [
        { code: 'EUR', name: 'Euro', rate: 0.92, change: 0.3, symbol: '€' },
        { code: 'GBP', name: 'British Pound', rate: 0.79, change: -0.2, symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', rate: 149.50, change: 0.8, symbol: '¥' },
        { code: 'TRY', name: 'Turkish Lira', rate: 32.45, change: 1.2, symbol: '₺' },
        { code: 'CHF', name: 'Swiss Franc', rate: 0.88, change: -0.1, symbol: 'Fr' },
        { code: 'CAD', name: 'Canadian Dollar', rate: 1.36, change: 0.4, symbol: 'C$' }
    ]

    const data = currencies || defaultCurrencies

    const handleRefresh = () => {
        setLastUpdated(new Date())
        // In real app, this would fetch new rates
    }

    const getCurrencyIcon = (code) => {
        switch (code) {
            case 'EUR': return Euro
            case 'GBP': return PoundSterling
            default: return DollarSign
        }
    }

    const formatRate = (rate) => {
        if (rate >= 100) return rate.toFixed(2)
        if (rate >= 10) return rate.toFixed(3)
        return rate.toFixed(4)
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Base: {baseCurrency}
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                    title="Refresh rates"
                >
                    <RefreshCw className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
                {data.map(currency => (
                    <div
                        key={currency.code}
                        className={cn(
                            'flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-[hsl(var(--muted))]',
                            compact ? 'py-1' : 'py-2'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
                                <span className="text-sm font-bold text-[hsl(var(--primary))]">
                                    {currency.symbol}
                                </span>
                            </div>
                            <div>
                                <div className="font-medium text-[hsl(var(--foreground))]">
                                    {currency.code}
                                </div>
                                {!compact && (
                                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {currency.name}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-mono font-semibold text-[hsl(var(--foreground))]">
                                {formatRate(currency.rate)}
                            </div>
                            {showTrend && (
                                <div className={cn(
                                    'flex items-center justify-end gap-1 text-xs',
                                    currency.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                                )}>
                                    {currency.change >= 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    {currency.change >= 0 ? '+' : ''}{currency.change}%
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))] text-center">
                Updated: {lastUpdated.toLocaleTimeString()}
            </div>
        </div>
    )
}
