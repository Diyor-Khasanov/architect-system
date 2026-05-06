import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchTasks, type Task } from '../lib/tasks'
import TasksClient from './TasksClient'

export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  let tasks: Task[] = []
  let fetchError = ''

  try {
    tasks = await fetchTasks()
  } catch (error) {
    console.error('Tasks fetch error:', error)
    fetchError = 'Failed to load tasks from API.'
  }

  return (
    <AppShell currentUser={currentUser}>
      <TasksClient tasks={tasks} fetchError={fetchError} />
    </AppShell>
  )
}
