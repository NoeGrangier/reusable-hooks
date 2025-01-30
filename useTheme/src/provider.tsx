import { useLocalStorage } from '@noeg/uselocalstorage'
import { createContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export const ThemeProviderContext = createContext<ThemeProviderState>(null)

type SystemTheme = Omit<Theme, 'system'>

type ThemeProviderState = {
  theme: Theme
  systemTheme: SystemTheme
  setTheme: (theme: Theme) => void
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(storageKey, defaultTheme)
  const [systemTheme, setSystemTheme] = useState<SystemTheme>(() =>
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      setSystemTheme(systemTheme)
      return
    }

    root.classList.add(theme)
    setSystemTheme(theme)
  }, [theme])

  const value = {
    theme,
    systemTheme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
