"use client";

import { useContext } from "react"
import { ThemeProviderContext } from "./theme-context"

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}