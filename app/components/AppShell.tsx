import type { MeResponse } from '../lib/auth'
import Sidebar from './Sidebar'

interface AppShellProps {
  currentUser: MeResponse
  children: React.ReactNode
}

export default function AppShell({ currentUser, children }: AppShellProps) {
  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900'>
      <Sidebar role={currentUser.role} fullName={currentUser.profile?.full_name ?? currentUser.username} />

      <main className='flex-1 lg:pl-72'>
        <div className='h-full px-4 py-8 lg:px-10'>{children}</div>
      </main>
    </div>
  )
}
