import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage.js'

function initialDark() {
  if (typeof window === 'undefined') return false
  const stored = readStorage('theme')
  if (stored) return stored === 'dark'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export default function useDarkMode() {
  const [dark, setDark] = useState(initialDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    writeStorage('theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, setDark]
}
