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

  let task, assignments, projectMembers, history
  try {
    task = await fetchTask(id)
    assignments = await fetchTaskAssignments(id)
    projectMembers = await fetchProjectMembers(task.project_id)
    history = await fetchTaskHistory(id)
  } catch (error) {
    console.error('Task fetch error:', error)
    return notFound()
  }

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
}
