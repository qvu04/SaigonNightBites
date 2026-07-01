import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
}

interface ThemeActions {
  initTheme: () => void
  toggleTheme: () => void
}

function getInitialDark(): boolean {
  const stored = localStorage.getItem('snb_theme')
  if (stored !== null) return stored === 'dark'
  const hour = new Date().getHours()
  return hour >= 18 || hour < 6
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('snb_theme', isDark ? 'dark' : 'light')
}

export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
  isDark: false,

  initTheme: () => {
    const isDark = getInitialDark()
    applyTheme(isDark)
    set({ isDark })
  },

  toggleTheme: () => {
    const isDark = !get().isDark
    applyTheme(isDark)
    set({ isDark })
  },
}))
