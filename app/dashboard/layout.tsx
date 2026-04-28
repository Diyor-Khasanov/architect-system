import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  return <AppShell currentUser={currentUser}>{children}</AppShell>
import Sidebar from '../components/Sidebar'
import { fetchCurrentUser } from '../lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900'>
      <Sidebar
        role={currentUser.role}
        fullName={currentUser.profile?.full_name ?? currentUser.username}
      />

      <main className='flex-1 lg:pl-72'>
        <div className='h-full px-4 py-8 lg:px-10'>{children}</div>
      </main>
    </div>
  )
}
