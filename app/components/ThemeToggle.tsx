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
    <div className='flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50/50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50'>
      <button
        onClick={() => setTheme('light')}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        }`}
        title='Light mode'
      >
        <Sun className='h-4 w-4' />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        }`}
        title='Dark mode'
      >
        <Moon className='h-4 w-4' />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          theme === 'system'
            ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        }`}
        title='System settings'
      >
        <Laptop className='h-4 w-4' />
      </button>
    </div>
  )
}
