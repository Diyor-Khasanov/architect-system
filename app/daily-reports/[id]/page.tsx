import { fetchDailyReport, fetchReportFiles } from '../../lib/reports'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchUserById } from '../../lib/users'
import { fetchProject } from '../../lib/projects'
import { fetchTask } from '../../lib/tasks'
import DailyReportDetailClient from './DailyReportDetailClient'
import { redirect, notFound } from 'next/navigation'
import AppShell from '../../components/AppShell'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DailyReportDetailPage({ params }: PageProps) {
  const currentUser = await fetchCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  const { id } = await params

  let report
  try {
    report = await fetchDailyReport(id)
  } catch {
    notFound()
  }

  // Fetch related names and files
  const [reporter, project, task, files] = await Promise.all([
    fetchUserById(report.user_id).catch(() => null),
    fetchProject(report.project_id.toString()).catch(() => null),
    fetchTask(report.task_id).catch(() => null),
    fetchReportFiles(report.id).catch(() => []),
  ])

  const userName = reporter?.profile?.full_name || reporter?.username || `User #${report.user_id}`
  const projectName = project?.name || `Project #${report.project_id}`
  const taskName = task?.title || `Task #${report.task_id}`

  return (
    <AppShell currentUser={currentUser}>
      <DailyReportDetailClient
        report={report}
        canEdit={currentUser.role === 'worker' && currentUser.id === report.user_id}
        userName={userName}
        projectName={projectName}
        taskName={taskName}
        files={files}
      />
    </AppShell>
  )
}
