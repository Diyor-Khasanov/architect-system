import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchAuditLogs } from '../lib/audit-logs'
import AuditLogsClient from './AuditLogsClient'

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (currentUser.role !== 'admin') {
    redirect('/dashboard')
  }

  const logs = await fetchAuditLogs()

  return (
    <AppShell currentUser={currentUser}>
      <AuditLogsClient logs={logs || []} />
    </AppShell>
  )
}
