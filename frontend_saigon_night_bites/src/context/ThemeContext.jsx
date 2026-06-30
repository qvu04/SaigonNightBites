import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

function getInitialDark() {
  const stored = localStorage.getItem('snb_theme')
  if (stored !== null) return stored === 'dark'
  const hour = new Date().getHours()
  return hour >= 18 || hour < 6
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialDark)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('snb_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
