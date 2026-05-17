import { notFound, redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchTask, fetchTaskAssignments } from '../../lib/tasks'
import { fetchProject, fetchProjectMembers } from '../../lib/projects'
import TaskDetailClient from './TaskDetailClient'
import { fetchTaskReport, fetchReportFiles } from '../../lib/reports'

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

  let task
  let assignments
  let projectMembers
  let project
  let report = null
  let reportFiles = []

  try {
    const fetchedTask = await fetchTask(id)
    if (!fetchedTask) {
      return notFound()
    }
    task = fetchedTask

    const [fetchedAssignments, fetchedMembers, fetchedProject, fetchedReport] = await Promise.all([
      fetchTaskAssignments(id).catch(() => []),
      fetchProjectMembers(fetchedTask.project_id || 0).catch(() => []),
      fetchProject((fetchedTask.project_id || 0).toString()).catch(() => undefined),
      fetchTaskReport(id).catch(() => null),
    ])

    assignments = fetchedAssignments
    projectMembers = fetchedMembers
    project = fetchedProject
    report = fetchedReport

    if (report) {
      reportFiles = await fetchReportFiles(report.id).catch(() => [])
    }
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
        project={project}
        report={report}
        reportFiles={reportFiles}
      />
    </AppShell>
  )
}
