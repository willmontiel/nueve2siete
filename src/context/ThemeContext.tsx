import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Same key and order as the inline script in index.html, which applies the theme before the first paint
const STORAGE_KEY = 'n2s_theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

// Storage can be blocked (private windows, strict settings); the site then just follows the system
function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Not saved: the choice lasts until the visitor leaves
  }
}

const systemTheme = (): Theme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light')

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => savedTheme() ?? systemTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Until the visitor picks a theme, the site keeps following the system, even when it changes
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const follow = (e: MediaQueryListEvent) => {
      if (!savedTheme()) setThemeState(e.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', follow)
    return () => media.removeEventListener('change', follow)
  }, [])

  // Only an explicit choice is remembered
  const setTheme = (t: Theme) => {
    saveTheme(t)
    setThemeState(t)
  }

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider')
  }
  return context
}
