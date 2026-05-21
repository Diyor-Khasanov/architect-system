import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchTasks, fetchMyTasks, fetchManagerTasks, type Task } from '../lib/tasks'
import { fetchUsers, type User } from '../lib/users'
import TasksClient from './TasksClient'

export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  let tasks: Task[] = []
  let userNameMap: Record<number, string> = {}
  let fetchError = ''

  const isWorker = currentUser.role === 'worker'
  const isManager = currentUser.role === 'manager'

  let title = 'Tasks'
  let subtitle = 'Overview of all tasks across projects.'

  if (isWorker) {
    title = 'My Tasks'
    subtitle = 'Overview of tasks assigned to you.'
  } else if (isManager) {
    title = 'Managed Tasks'
    subtitle = 'Overview of tasks in projects you manage.'
  }

  try {
    const [fetchedTasks, allUsers] = await Promise.all([
      isWorker ? fetchMyTasks() : isManager ? fetchManagerTasks() : fetchTasks(),
      fetchUsers().catch(() => []),
    ])

    tasks = fetchedTasks
    userNameMap = Object.fromEntries(
      (allUsers as User[]).map((u) => [u.id, u.profile?.full_name || u.username])
    )
  } catch (error) {
    console.error('Tasks fetch error:', error)
    fetchError = 'Failed to load tasks from API.'
  }

  return (
    <AppShell currentUser={currentUser}>
      <TasksClient
        tasks={tasks}
        userNameMap={userNameMap}
        fetchError={fetchError}
        title={title}
        subtitle={subtitle}
      />
    </AppShell>
  )
}
