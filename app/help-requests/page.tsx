import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchHelpRequests, type HelpRequest } from '../lib/help-requests'
import { fetchTasks, fetchMyTasks, fetchManagerTasks, type Task } from '../lib/tasks'
import HelpRequestsClient from './HelpRequestsClient'

export const dynamic = 'force-dynamic'

export default async function HelpRequestsPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  let helpRequests: HelpRequest[] = []
  let tasks: Task[] = []
  let fetchError = ''

  try {
    helpRequests = await fetchHelpRequests()

    // Fetch tasks based on role to allow creating help requests for specific tasks
    if (currentUser.role === 'worker') {
      tasks = await fetchMyTasks()
    } else if (currentUser.role === 'manager') {
      tasks = await fetchManagerTasks()
    } else {
      tasks = await fetchTasks()
    }
  } catch (error) {
    console.error('Help requests fetch error:', error)
    fetchError = 'Failed to load data from API.'
  }

  return (
    <AppShell currentUser={currentUser}>
      <HelpRequestsClient helpRequests={helpRequests} tasks={tasks} fetchError={fetchError} />
    </AppShell>
  )
}
