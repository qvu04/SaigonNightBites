import { clsx } from 'clsx'
import type { Budget } from '../types'

const BUDGETS: { value: Budget; label: string }[] = [
  { value: 'low', label: 'Dưới 50k' },
  { value: 'mid', label: '50k – 150k' },
  { value: 'high', label: 'Trên 150k' },
]

interface Props {
  value: Budget
  onChange: (budget: Budget) => void
}

export default function BudgetSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {BUDGETS.map((budget) => {
        const isSelected = value === budget.value
        return (
          <button
            key={budget.value}
            onClick={() => onChange(budget.value)}
            className={clsx(
              'flex-1 py-2.5 px-3 rounded-full text-sm font-semibold border-2 transition-all duration-200 cursor-pointer',
              isSelected
                ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-orange-600'
            )}
          >
            {budget.label}
          </button>
        )
      })}
    </div>
  )
}
