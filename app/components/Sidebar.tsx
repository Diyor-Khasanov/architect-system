'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, BarChart3, LogOut, Command, X, ClipboardList, HelpCircle, CheckCircle2, FileText } from 'lucide-react'
import { logoutAction } from '../actions/login'
import type { UserRole } from '../lib/auth'
import { cn } from '../lib/utils'
import { useToast } from '../context/ToastContext'

interface SidebarProps {
  role: UserRole
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
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
    { name: 'Tasks', href: '/tasks', icon: CheckCircle2 },
    { name: 'Daily Reports', href: '/daily-reports', icon: FileText },
    { name: 'Monthly Reports', href: '/monthly-reports', icon: BarChart3 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Help Requests', href: '/help-requests', icon: HelpCircle },
  ],
  manager: [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Team', href: '/users', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: CheckCircle2 },
    { name: 'Daily Reports', href: '/daily-reports', icon: FileText },
    { name: 'Monthly Reports', href: '/monthly-reports', icon: BarChart3 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Help Requests', href: '/help-requests', icon: HelpCircle },
  ],
  worker: [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckCircle2 },
    { name: 'Daily Reports', href: '/daily-reports', icon: FileText },
    { name: 'Monthly Reports', href: '/monthly-reports', icon: BarChart3 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Help Requests', href: '/help-requests', icon: HelpCircle },
  ],
}

function isActivePath(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const menuItems = roleMenu[role]
  const { confirm } = useToast()

  const SidebarContent = (
    <div className='flex h-full flex-col p-6 dark:bg-zinc-900'>
      <div className='mb-8 flex items-center justify-between px-2'>
        <div className='flex items-center gap-2'>
          <Command className='h-6 w-6 text-zinc-900 dark:text-zinc-100' />
          <div>
            <span className='block text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>Architect</span>
            <span className='text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400'>{role}</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className='lg:hidden text-zinc-500 dark:text-zinc-400'>
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
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className='mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800'>
        <form action={logoutAction}>
          <button
            type='button'
            onClick={async (e) => {
              const form = e.currentTarget.form
              if (!form) return
              const confirmed = await confirm('Are you sure you want to logout?')
              if (confirmed) {
                form.requestSubmit()
              }
            }}
            className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30'
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
      <aside className='fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-900'>
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
          'fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-in-out lg:hidden dark:bg-zinc-900',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {SidebarContent}
      </aside>
    </>
  )
}
