import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DarkModeSwitch from '../DarkModeSwitch'

export default function Header() {
  const [visible, setVisible] = useState(true)
  const [lastY, setLastY] = useState(0)

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
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🍜</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              SaigonNightBites
            </span>
          </Link>
          <DarkModeSwitch />
        </div>
      </div>
    </header>
  )
}
