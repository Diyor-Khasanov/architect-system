import { notFound, redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchTask } from '../../lib/tasks'
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
    return (
      <AppShell currentUser={currentUser}>
        <TaskDetailClient
          task={task}
          currentUserId={currentUser.id}
          currentUserRole={currentUser.role}
        />
      </AppShell>
    )
  } catch (error) {
    console.error('Task fetch error:', error)
    return notFound()
  }
}
