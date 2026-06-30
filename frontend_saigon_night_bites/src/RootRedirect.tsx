import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from './context'

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

export default function RootRedirect() {
  const { token, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  return token ? <Navigate to="/home" replace /> : <Navigate to="/auth" replace />
}
