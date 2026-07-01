import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { SessionExpiryHandler } from './components/SessionExpiryHandler'
import AppRoutes from './AppRoute'
import { useAuthStore, useLocationStore, useThemeStore } from './stores'

export default function App() {
  const initFromStorage = useAuthStore((s) => s.initFromStorage)
  const initTheme = useThemeStore((s) => s.initTheme)
  const initGPS = useLocationStore((s) => s.initGPS)

  useEffect(() => {
    initFromStorage()
    initTheme()
    initGPS()
  }, [initFromStorage, initTheme, initGPS])

  return (
    <>
      <AppRoutes />
      <SessionExpiryHandler />
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700',
          duration: 3000,
        }}
      />
    </>
  )
}
