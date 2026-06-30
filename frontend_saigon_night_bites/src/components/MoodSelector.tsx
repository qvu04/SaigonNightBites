import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { Mood } from '../types'

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'tired', emoji: '😴', label: 'Mệt mỏi' },
  { value: 'happy', emoji: '😄', label: 'Vui vẻ' },
  { value: 'date', emoji: '💕', label: 'Hẹn hò' },
  { value: 'group', emoji: '👥', label: 'Đi nhóm' },
  { value: 'sweet', emoji: '🍮', label: 'Thèm ngọt' },
  { value: 'savory', emoji: '🍜', label: 'Thèm mặn' },
]

interface Props {
  value: Mood | null
  onChange: (mood: Mood) => void
}

export default function MoodSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MOODS.map((mood) => {
        const isSelected = value === mood.value
        return (
          <motion.button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            whileTap={{ scale: 0.92 }}
            animate={isSelected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'flex flex-col items-center justify-center gap-1.5 rounded-2xl py-4 px-2 border-2 transition-all duration-200 cursor-pointer select-none',
              isSelected
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-400 shadow-md shadow-orange-100 dark:shadow-orange-900/20'
                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-orange-300 dark:hover:border-orange-600'
            )}
          >
            <span className="text-3xl leading-none">{mood.emoji}</span>
            <span className={clsx('text-xs font-semibold', isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-400')}>
              {mood.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
