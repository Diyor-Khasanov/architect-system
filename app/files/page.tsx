import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import FilesClient from './FilesClient'

export const dynamic = 'force-dynamic'

export default async function FilesPage() {
  const user = await fetchCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <AppShell currentUser={user}>
      <FilesClient />
    </AppShell>
  )
}
