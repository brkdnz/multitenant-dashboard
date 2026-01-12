import { cn } from '@/lib/utils'
import { CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

/**
 * TransactionList Widget - Recent transactions
 */
export default function TransactionList({
    title = 'Recent Transactions',
    transactions = []
}) {
    const defaultTransactions = [
        { id: 1, name: 'Spotify Premium', amount: -9.99, type: 'expense', category: 'Subscription', date: 'Today' },
        { id: 2, name: 'Salary Deposit', amount: 5000, type: 'income', category: 'Income', date: 'Yesterday' },
        { id: 3, name: 'Amazon Purchase', amount: -67.50, type: 'expense', category: 'Shopping', date: '2 days ago' },
        { id: 4, name: 'Freelance Payment', amount: 850, type: 'income', category: 'Income', date: '3 days ago' },
    ]

    const items = transactions.length > 0 ? transactions : defaultTransactions

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 space-y-3">
                {items.map((tx, index) => (
                    <div key={tx.id || index} className="flex items-center gap-3">
                        <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            tx.type === 'income'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-red-100 dark:bg-red-900/30'
                        )}>
                            {tx.type === 'income' ? (
                                <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                                {tx.name}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                {tx.category} • {tx.date}
                            </p>
                        </div>
                        <span className={cn(
                            'text-sm font-semibold',
                            tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        )}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
