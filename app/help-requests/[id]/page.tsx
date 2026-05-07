import { notFound, redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchHelpRequest } from '../../lib/help-requests'
import HelpRequestDetailClient from './HelpRequestDetailClient'

export const dynamic = 'force-dynamic'

export default async function HelpRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  try {
    const helpRequest = await fetchHelpRequest(id)

    if (!helpRequest) {
      return notFound()
    }

    return (
      <AppShell currentUser={currentUser}>
        <HelpRequestDetailClient helpRequest={helpRequest} currentUser={currentUser} />
      </AppShell>
    )
  } catch (error) {
    console.error('Help request fetch error:', error)
    return notFound()
  }
}
