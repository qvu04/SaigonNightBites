import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiCompass, FiHeart, FiClock } from 'react-icons/fi'
import { clsx } from 'clsx'

const NAV_ITEMS = [
  { path: '/', icon: FiHome, label: 'Trang chủ' },
  { path: '/discovery', icon: FiCompass, label: 'Kết quả' },
  { path: '/saved', icon: FiHeart, label: 'Yêu thích' },
  { path: '/history', icon: FiClock, label: 'Lịch sử' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors',
                isActive
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
