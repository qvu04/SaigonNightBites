import { create } from 'zustand'
import type { User } from '../types'
import { authService } from '../services'
interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  showSessionModal: boolean
  sessionExpireAt: string | null
  renewLoading: boolean
  _warningTimer: ReturnType<typeof setTimeout> | null
}

interface AuthActions {
  login: (accessToken: string, user: User, refreshToken: string, refreshExpiresAt: string) => void
  logout: () => Promise<void>
  initFromStorage: () => void
  scheduleExpiryWarning: (refreshExpiresAt: string) => void
  handleRenewSession: () => Promise<void>
  handleDismissSession: () => Promise<void>
  setShowSessionModal: (show: boolean) => void
}

type AuthStore = AuthState & AuthActions
const WARNING_MS_BEFORE_EXPIRY = 24 * 60 * 60 * 1000;
// const WARNING_MS_BEFORE_EXPIRY = 6 * 1000;
export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,
  showSessionModal: false,
  sessionExpireAt: null,
  renewLoading: false,
  _warningTimer: null,
  initFromStorage: () => {
    const storedToken = localStorage.getItem('snb_token')
    const storedUser = localStorage.getItem('snb_user')
    const storedRefreshExpiry = localStorage.getItem('snb_refresh_expires_at')

    if (storedToken && storedUser) {
      try {
        set({ token: storedToken, user: JSON.parse(storedUser) as User })
        if (storedRefreshExpiry) get().scheduleExpiryWarning(storedRefreshExpiry)
      } catch {
        localStorage.removeItem('snb_token')
        localStorage.removeItem('snb_refresh_token')
        localStorage.removeItem('snb_refresh_expires_at')
        localStorage.removeItem('snb_user')
      }
    }
    set({ isLoading: false })
  },

  scheduleExpiryWarning: (refreshExpiresAt) => {
    const current = get()._warningTimer
    if (current) clearTimeout(current)

    const delay = new Date(refreshExpiresAt).getTime() - WARNING_MS_BEFORE_EXPIRY - Date.now()
    if (delay > 0) {
      const timer = setTimeout(() => {
        set({ showSessionModal: true, sessionExpireAt: refreshExpiresAt })
      }, delay)
      set({ _warningTimer: timer })
    }
  },

  login: (accessToken, newUser, refreshToken, refreshExpiresAt) => {
    localStorage.setItem('snb_token', accessToken)
    localStorage.setItem('snb_refresh_token', refreshToken)
    localStorage.setItem('snb_refresh_expires_at', refreshExpiresAt)
    localStorage.setItem('snb_user', JSON.stringify(newUser))
    set({ token: accessToken, user: newUser })
    get().scheduleExpiryWarning(refreshExpiresAt)
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('snb_refresh_token')
    if (refreshToken) await authService.logout(refreshToken)

    const timer = get()._warningTimer
    if (timer) clearTimeout(timer)

    localStorage.removeItem('snb_token')
    localStorage.removeItem('snb_refresh_token')
    localStorage.removeItem('snb_refresh_expires_at')
    localStorage.removeItem('snb_user')
    set({ token: null, user: null, _warningTimer: null })
  },

  handleRenewSession: async () => {
    const refreshToken = localStorage.getItem('snb_refresh_token')
    if (!refreshToken) return

    set({ renewLoading: true })
    try {
      const res = await authService.refresh(refreshToken)
      const { accessToken, refreshToken: newRefreshToken, refreshExpiresAt } = res.data
      localStorage.setItem('snb_token', accessToken)
      localStorage.setItem('snb_refresh_token', newRefreshToken)
      localStorage.setItem('snb_refresh_expires_at', refreshExpiresAt)
      set({ token: accessToken, showSessionModal: false })
      get().scheduleExpiryWarning(refreshExpiresAt)
    } catch {
      set({ showSessionModal: false })
      await get().logout()
    } finally {
      set({ renewLoading: false })
    }
  },

  handleDismissSession: async () => {
    set({ showSessionModal: false })
    await get().logout()
    window.location.replace('/auth')
  },

  setShowSessionModal: (show) => set({ showSessionModal: show }),
}))
