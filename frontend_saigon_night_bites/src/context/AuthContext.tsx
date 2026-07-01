import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type { User } from '../types'
import { authService } from '../services'
import { ConfirmModal, CountdownDisplay } from '../components'
import { FiClock } from 'react-icons/fi'

const WARNING_MS_BEFORE_EXPIRY = 24 * 60 * 60 * 1000 // warn 24h before refresh token expires
// const WARNING_MS_BEFORE_EXPIRY = 6 * 1000;
interface AuthContextValue {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (accessToken: string, user: User, refreshToken: string, refreshExpiresAt: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionExpireAt, setSessionExpireAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [renewLoading, setRenewLoading] = useState(false);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleExpiryWarning = (refreshExpiresAt: string) => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    const expiresAt = new Date(refreshExpiresAt).getTime();
    const delay = expiresAt - WARNING_MS_BEFORE_EXPIRY - Date.now();
    if (delay > 0) {
      warningTimerRef.current = setTimeout(() => {
        setSessionExpireAt(refreshExpiresAt);
        setShowSessionModal(true);
      }, delay)
    }
  }
  const handleDismissSession = async () => {
    setShowSessionModal(false)
    await logout()
    window.location.replace('/auth')
  }

  const handleRenewSession = async () => {
    const refreshToken = localStorage.getItem('snb_refresh_token')
    if (!refreshToken) return
    setRenewLoading(true)
    try {
      const res = await authService.refresh(refreshToken)
      const { accessToken, refreshToken: newRefreshToken, refreshExpiresAt } = res.data
      localStorage.setItem('snb_token', accessToken)
      localStorage.setItem('snb_refresh_token', newRefreshToken)
      localStorage.setItem('snb_refresh_expires_at', refreshExpiresAt)
      setToken(accessToken)
      setShowSessionModal(false)
      scheduleExpiryWarning(refreshExpiresAt)
      toast.success('Phiên đăng nhập đã được gia hạn!')
    } catch {
      setShowSessionModal(false)
      toast.error('Không thể gia hạn phiên, vui lòng đăng nhập lại.')
      await logout()
    } finally {
      setRenewLoading(false)
    }
  }
  useEffect(() => {
    const storedToken = localStorage.getItem('snb_token')
    const storedUser = localStorage.getItem('snb_user')
    const storedRefreshExpiry = localStorage.getItem('snb_refresh_expires_at')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser) as User)
        if (storedRefreshExpiry) scheduleExpiryWarning(storedRefreshExpiry)
      } catch {
        localStorage.removeItem('snb_token')
        localStorage.removeItem('snb_refresh_token')
        localStorage.removeItem('snb_refresh_expires_at')
        localStorage.removeItem('snb_user')
      }
    }
    setIsLoading(false)

    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    }
  }, [])

  const login = (
    accessToken: string,
    newUser: User,
    refreshToken: string,
    refreshExpiresAt: string
  ) => {
    localStorage.setItem('snb_token', accessToken)
    localStorage.setItem('snb_refresh_token', refreshToken)
    localStorage.setItem('snb_refresh_expires_at', refreshExpiresAt)
    localStorage.setItem('snb_user', JSON.stringify(newUser))
    setToken(accessToken)
    setUser(newUser)
    scheduleExpiryWarning(refreshExpiresAt)
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('snb_refresh_token')
    if (refreshToken) {
      await authService.logout(refreshToken);
    };
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    localStorage.removeItem('snb_token')
    localStorage.removeItem('snb_refresh_token')
    localStorage.removeItem('snb_refresh_expires_at')
    localStorage.removeItem('snb_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
      <ConfirmModal
        open={showSessionModal}
        variant="session"
        icon={<FiClock size={28} />}
        title="Phiên đăng nhập sắp hết hạn"
        description="Phiên làm việc của bạn sắp hết hạn. Bạn có muốn gia hạn không?"
        cancelText="Để sau"
        confirmText="Gia hạn ngay"
        extra={sessionExpireAt ? <CountdownDisplay expiresAt={sessionExpireAt} /> : undefined}
        confirmLoading={renewLoading}
        onClose={handleDismissSession}
        onConfirm={handleRenewSession}
      />
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
