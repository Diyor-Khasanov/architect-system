'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, BarChart3, Wrench, LogOut, Command } from 'lucide-react'
import { logoutAction } from '../actions/login'
import type { UserRole } from '../lib/auth'
import { cn } from '../lib/utils'

interface SidebarProps {
  role: UserRole
  fullName: string
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
    { name: 'Assigned Tasks', href: '/dashboard/tasks', icon: Wrench },
  ],
}

function isActivePath(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Sidebar({ role, fullName }: SidebarProps) {
  const pathname = usePathname()
  const menuItems = roleMenu[role]

  return (
    <aside className='fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-white lg:block'>
      <div className='flex h-full flex-col p-6'>
        <div className='mb-8 flex items-center gap-2 px-2'>
          <Command className='h-6 w-6' />
          <div>
            <span className='block text-lg font-semibold tracking-tight'>Architect</span>
            <span className='text-xs uppercase tracking-[0.2em] text-zinc-500'>{role}</span>
          </div>
        </div>

        <nav className='flex-1 space-y-1'>
          {menuItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
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
    </aside>
  )
}
