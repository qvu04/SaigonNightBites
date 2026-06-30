import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiCompass, FiHeart, FiClock, type IconType } from 'react-icons/fi'
import { clsx } from 'clsx'
import DarkModeSwitch from '../DarkModeSwitch'

interface NavItem {
  path: string
  icon: IconType
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', icon: FiHome, label: 'Trang chủ' },
  { path: '/discovery', icon: FiCompass, label: 'Kết quả' },
  { path: '/saved', icon: FiHeart, label: 'Yêu thích' },
  { path: '/history', icon: FiClock, label: 'Lịch sử' },
]

export default function Header() {
  const [visible, setVisible] = useState(true)
  const [lastY, setLastY] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      setVisible(currentY < lastY || currentY < 60)
      setLastY(currentY)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🍜</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                SaigonNightBites
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <DarkModeSwitch />
        </div>
      </div>
    </header>
  )
}
