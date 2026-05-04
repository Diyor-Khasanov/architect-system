'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import type { MeResponse } from '../lib/auth'
import Sidebar from './Sidebar'
import { ThemeToggle } from './ThemeToggle'

interface AppShellProps {
  currentUser: MeResponse
  children: React.ReactNode
}

export default function AppShell({ currentUser, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50'>
      <Sidebar
        role={currentUser.role}
        fullName={currentUser.profile?.full_name ?? currentUser.username}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className='flex flex-1 flex-col lg:pl-72'>
        {/* Top Navbar */}
        <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 lg:px-8'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 lg:hidden'
            >
              <Menu className='h-6 w-6' />
            </button>
            <div className='hidden lg:block'>
              <h2 className='text-sm font-medium text-zinc-500 dark:text-zinc-400'>Dashboard</h2>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <ThemeToggle />
            <div className='h-8 w-px bg-zinc-200 dark:bg-zinc-800' />
            <div className='flex items-center gap-3'>
              <div className='hidden flex-col items-end sm:flex'>
                <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                  {currentUser.profile?.full_name ?? currentUser.username}
                </span>
                <span className='text-xs capitalize text-zinc-500 dark:text-zinc-400'>{currentUser.role}</span>
              </div>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'>
                {(currentUser.profile?.full_name ?? currentUser.username).charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className='flex-1 p-4 lg:p-8'>{children}</div>
      </main>
    </div>
  )
}
