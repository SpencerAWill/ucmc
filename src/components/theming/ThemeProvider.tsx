"use client";

import { useEffect, useState } from "react"
import { ThemeProviderContext } from "./theme-context"
import type { Theme, ThemeProviderProps } from "./theme-context"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      if (typeof window !== 'undefined') {
        const storedTheme = window.localStorage.getItem(storageKey);
        if (storedTheme === 'system') return 'system';
        if (storedTheme === 'light') return 'light';
        if (storedTheme === 'dark') return 'dark';
      }
      return defaultTheme
    }
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (th: Theme) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, th)
      }
      setTheme(th)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}