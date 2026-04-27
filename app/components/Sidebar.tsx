'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, Command } from 'lucide-react'
import { cn } from '../lib/utils'

const menuItems = [
  { name: 'Asosiy', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Foydalanuvchilar', href: '/dashboard/users', icon: Users },
  { name: 'Analitika', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Sozlamalar', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className='fixed inset-y-0 left-0 hidden w-64 border-r border-[#eaeaea] dark:border-[#333] bg-white dark:bg-[#000] lg:block'>
      <div className='flex h-full flex-col p-6'>
        {/* Logo section */}
        <div className='flex items-center gap-2 px-2 mb-10'>
          <Command className='h-6 w-6' />
          <span className='text-lg font-bold tracking-tighter'>ADMIN</span>
        </div>

        {/* Navigation links */}
        <nav className='flex-1 space-y-1'>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#fafafa] dark:bg-[#111] text-black dark:text-white'
                    : 'text-[#666] hover:text-black dark:hover:text-white hover:bg-[#fafafa] dark:hover:bg-[#111]'
                )}
              >
                <item.icon className='h-4 w-4' />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className='mt-auto pt-6 border-t border-[#eaeaea] dark:border-[#333]'>
          <button className='flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors'>
            <LogOut className='h-4 w-4' />
            Chiqish
          </button>
        </div>
      </div>
    </aside>
  )
}
