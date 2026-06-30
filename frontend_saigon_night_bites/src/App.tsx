import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'
import { LocationProvider } from './context/LocationContext'
import { AuthProvider } from './context'
import AppRoutes from './AppRoute'
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700',
              duration: 3000,
            }}
          />
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
