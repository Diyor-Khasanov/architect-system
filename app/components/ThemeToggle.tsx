'use client'

import * as React from 'react'
import { Moon, Sun, Laptop } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  if (!mounted) {
    return (
      <div className='flex h-9 w-24 items-center justify-around rounded-lg bg-zinc-100 dark:bg-zinc-800'>
        <div className='h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse' />
      </div>
    )
  }

  return (
    <div className='flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800'>
      <button
        onClick={() => setTheme('light')}
        className={`rounded-md p-1.5 transition-colors ${
          theme === 'light'
            ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        }`}
        title='Light mode'
      >
        <Sun className='h-4 w-4' />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`rounded-md p-1.5 transition-colors ${
          theme === 'dark'
            ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        }`}
        title='Dark mode'
      >
        <Moon className='h-4 w-4' />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`rounded-md p-1.5 transition-colors ${
          theme === 'system'
            ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        }`}
        title='System settings'
      >
        <Laptop className='h-4 w-4' />
      </button>
    </div>
  )
}
