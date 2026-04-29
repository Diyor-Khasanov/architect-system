'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, BarChart3, Wrench, LogOut, Command, X } from 'lucide-react'
import { logoutAction } from '../actions/login'
import type { UserRole } from '../lib/auth'
import { cn } from '../lib/utils'

interface SidebarProps {
  role: UserRole
  fullName: string
  isOpen?: boolean
  onClose?: () => void
}

interface MenuItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
}

const roleMenu: Record<UserRole, MenuItem[]> = {
  admin: [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ],
  manager: [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  ],
  worker: [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Assigned Tasks', href: '/dashboard/tasks', icon: Wrench },
  ],
}

function isActivePath(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Sidebar({ role, fullName, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const menuItems = roleMenu[role]

  const SidebarContent = (
    <div className='flex h-full flex-col p-6'>
      <div className='mb-8 flex items-center justify-between px-2'>
        <div className='flex items-center gap-2'>
          <Command className='h-6 w-6' />
          <div>
            <span className='block text-lg font-semibold tracking-tight'>Architect</span>
            <span className='text-xs uppercase tracking-[0.2em] text-zinc-500'>{role}</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className='lg:hidden'>
            <X className='h-6 w-6' />
          </button>
        )}
      </div>

      <nav className='flex-1 space-y-1'>
        {menuItems.map((item) => {
          const isActive = isActivePath(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className='mt-auto border-t border-zinc-200 pt-4'>
        <p className='mb-3 truncate px-3 text-sm text-zinc-500'>{fullName}</p>
        <form action={logoutAction}>
          <button
            type='submit'
            className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
          >
            <LogOut className='h-4 w-4' />
            Logout
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className='fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-white lg:block'>
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {SidebarContent}
      </aside>
    </>
  )
}
