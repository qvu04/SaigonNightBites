import { type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from './context'

function UnauthorizedScreen() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const authUrl = `/auth?from=${encodeURIComponent(pathname)}`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-sm"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <span className="text-4xl">🍜</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shadow-md">
            <FiLock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Bạn chưa đăng nhập
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
          Hãy đăng nhập để khám phá những quán ăn ngon xung quanh bạn tại TP.HCM.
        </p>

        <button
          onClick={() => navigate(authUrl, { replace: true })}
          className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm transition-colors shadow-lg shadow-orange-200 dark:shadow-orange-900/30 mb-3"
        >
          Đăng nhập ngay
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors py-2"
        >
          <FiArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </motion.div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
        <span className="text-2xl animate-pulse">🍜</span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-400 dark:bg-orange-500"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!token) return <UnauthorizedScreen />
  return <>{children}</>
}