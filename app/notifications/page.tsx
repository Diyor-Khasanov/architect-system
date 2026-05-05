import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchNotifications } from '../lib/notifications'
import NotificationsClient from './NotificationsClient'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const notifications = await fetchNotifications()

  return (
    <AppShell currentUser={currentUser}>
      <NotificationsClient notifications={notifications} />
    </AppShell>
  )
}
