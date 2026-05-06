import { notFound, redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchTask, fetchTaskAssignments, fetchTaskHistory } from '../../lib/tasks'
import { fetchProjectMembers } from '../../lib/projects'
import TaskDetailClient from './TaskDetailClient'

export const dynamic = 'force-dynamic'

export default async function TaskDetailPage({
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
    const task = await fetchTask(id)
    const assignments = await fetchTaskAssignments(id)
    const projectMembers = await fetchProjectMembers(task.project_id)
    const history = await fetchTaskHistory(id)

    return (
      <AppShell currentUser={currentUser}>
        <TaskDetailClient
          task={task}
          currentUserId={currentUser.id}
          currentUserRole={currentUser.role}
          assignments={assignments}
          projectMembers={projectMembers}
          history={history}
        />
      </AppShell>
    )
  } catch (error) {
    console.error('Task fetch error:', error)
    return notFound()
  }
}
