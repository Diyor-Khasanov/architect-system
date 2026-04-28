import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  return <AppShell currentUser={currentUser}>{children}</AppShell>
}
