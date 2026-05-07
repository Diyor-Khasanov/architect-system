import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchTasks, fetchMyTasks, type Task } from '../lib/tasks'
import TasksClient from './TasksClient'

export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  let tasks: Task[] = []
  let fetchError = ''

  const isWorker = currentUser.role === 'worker'
  const title = isWorker ? 'My Tasks' : 'Tasks'
  const subtitle = isWorker ? 'Overview of tasks assigned to you.' : 'Overview of all tasks across projects.'

  try {
    if (isWorker) {
      tasks = await fetchMyTasks()
    } else {
      tasks = await fetchTasks()
    }
  } catch (error) {
    console.error('Tasks fetch error:', error)
    fetchError = 'Failed to load tasks from API.'
  }

  return (
    <AppShell currentUser={currentUser}>
      <TasksClient tasks={tasks} fetchError={fetchError} title={title} subtitle={subtitle} />
    </AppShell>
  )
}
