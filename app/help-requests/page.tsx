import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchHelpRequests, type HelpRequest } from '../lib/help-requests'
import HelpRequestsClient from './HelpRequestsClient'

export const dynamic = 'force-dynamic'

export default async function HelpRequestsPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  let helpRequests: HelpRequest[] = []
  let fetchError = ''

  try {
    helpRequests = await fetchHelpRequests()
  } catch (error) {
    console.error('Help requests fetch error:', error)
    fetchError = 'Failed to load help requests from API.'
  }

  return (
    <AppShell currentUser={currentUser}>
      <HelpRequestsClient helpRequests={helpRequests} fetchError={fetchError} />
    </AppShell>
  )
}
