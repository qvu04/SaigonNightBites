import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useThemeStore } from '../stores'

export const DarkModeSwitch = () => {
  const isDark = useThemeStore((s) => s.isDark)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      style={{ backgroundColor: isDark ? '#F97316' : '#d4d4d8' }}
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm"
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <FiMoon className="w-3 h-3 text-orange-500" />
        ) : (
          <FiSun className="w-3 h-3 text-zinc-500" />
        )}
      </motion.div>
    </button>
  )
}
