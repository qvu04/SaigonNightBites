import { clsx } from 'clsx'

const RADII: { value: number; label: string }[] = [
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
  { value: 3000, label: '3 km' },
  { value: 5000, label: '5 km' },
]

interface Props {
  value: number
  onChange: (radius: number) => void
}

export const RadiusSelector = ({ value, onChange }: Props) => {
  return (
    <div className="flex gap-2">
      {RADII.map((r) => {
        const isSelected = value === r.value
        return (
          <button
            key={r.value}
            onClick={() => onChange(r.value)}
            className={clsx(
              'flex-1 py-2.5 px-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 cursor-pointer',
              isSelected
                ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-orange-600'
            )}
          >
            {r.label}
          </button>
        )
      })}
    </div>
  )
}
