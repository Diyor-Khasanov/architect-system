import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchNotifications } from '../lib/notifications'
import { Bell, Calendar, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const notifications = await fetchNotifications()

  return (
    <AppShell currentUser={currentUser}>
      <div className='space-y-6'>
        <header>
          <h1 className='text-2xl font-semibold tracking-tight'>Notifications</h1>
          <p className='text-sm text-zinc-500'>Stay updated with your latest alerts and activities.</p>
        </header>

        <div className='rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          {notifications.length > 0 ? (
            <div className='divide-y divide-zinc-100 dark:divide-zinc-800'>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-6 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                    !notification.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div
                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      !notification.is_read
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    <Bell className='h-5 w-5' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <p className={`text-sm ${!notification.is_read ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>
                      {notification.message}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400'>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className='mt-2 h-2 w-2 rounded-full bg-blue-600' />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
              <div className='mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800'>
                <Bell className='h-8 w-8 text-zinc-400' />
              </div>
              <h3 className='text-lg font-medium text-zinc-900 dark:text-zinc-100'>No notifications</h3>
              <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>You&apos;re all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
