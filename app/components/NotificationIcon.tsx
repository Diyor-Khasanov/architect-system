'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { getUnreadCountAction } from '../actions/notifications'

export default function NotificationIcon() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function loadUnreadCount() {
      const count = await getUnreadCountAction()
      setUnreadCount(count)
    }

    loadUnreadCount()
    // Optional: Refresh every minute
    const interval = setInterval(loadUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link
      href='/notifications'
      className='relative rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
      aria-label='View notifications'
    >
      <Bell className='h-6 w-6' />
      {unreadCount > 0 && (
        <span className='absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white'>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
