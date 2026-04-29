'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import type { MeResponse } from '../lib/auth'
import Sidebar from './Sidebar'

interface AppShellProps {
  currentUser: MeResponse
  children: React.ReactNode
}

export default function AppShell({ currentUser, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900'>
      <Sidebar
        role={currentUser.role}
        fullName={currentUser.profile?.full_name ?? currentUser.username}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className='flex-1 lg:pl-72'>
        <div className='flex h-16 items-center border-b border-zinc-200 bg-white px-4 lg:hidden'>
          <button onClick={() => setIsSidebarOpen(true)} className='p-2'>
            <Menu className='h-6 w-6' />
          </button>
          <span className='ml-4 text-lg font-semibold'>Architect</span>
        </div>
        <div className='h-full px-4 py-8 lg:px-10'>{children}</div>
      </main>
    </div>
  )
}
