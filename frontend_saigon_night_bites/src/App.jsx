import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LocationProvider } from './context/LocationContext'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import SavedPlaces from './pages/SavedPlaces'
import History from './pages/History'
import Auth from './pages/Auth'
import ApiKeyTest from './pages/ApiKeyTest'

function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth()
  if (isLoading) return null
  if (!token) return <Navigate to="/auth" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discovery"
        element={
          <ProtectedRoute>
            <Discovery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <SavedPlaces />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path="/test" element={<ApiKeyTest />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

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
