import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * StockTicker Widget - Stock market style ticker
 */
export default function StockTicker({
    title = 'Market Watch',
    stocks = []
}) {
    const defaultStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, change: 2.45, changePercent: 1.39 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.85, changePercent: -0.60 },
        { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 5.12, changePercent: 1.37 },
        { symbol: 'AMZN', name: 'Amazon', price: 178.35, change: 0, changePercent: 0 },
    ]

    const items = stocks.length > 0 ? stocks : defaultStocks

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 space-y-3">
                {items.map((stock, index) => {
                    const isPositive = stock.change > 0
                    const isNeutral = stock.change === 0

                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-[hsl(var(--foreground))] text-sm">{stock.symbol}</p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{stock.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-[hsl(var(--foreground))]">
                                    ${stock.price.toFixed(2)}
                                </p>
                                <div className={cn(
                                    'flex items-center justify-end gap-1 text-xs',
                                    isPositive && 'text-emerald-500',
                                    !isPositive && !isNeutral && 'text-red-500',
                                    isNeutral && 'text-[hsl(var(--muted-foreground))]'
                                )}>
                                    {isPositive && <TrendingUp className="h-3 w-3" />}
                                    {!isPositive && !isNeutral && <TrendingDown className="h-3 w-3" />}
                                    {isNeutral && <Minus className="h-3 w-3" />}
                                    <span>
                                        {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
