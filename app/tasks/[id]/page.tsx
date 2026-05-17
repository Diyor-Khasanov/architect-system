import { notFound, redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchTask, fetchTaskAssignments } from '../../lib/tasks'
import { fetchProject, fetchProjectMembers } from '../../lib/projects'
import { fetchUsers, type User } from '../../lib/users'
import TaskDetailClient from './TaskDetailClient'
import { fetchTaskReport, fetchReportFiles, fetchDailyReports, type DailyReport } from '../../lib/reports'

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
  let users: User[] = []
  let report = null
  let reportFiles = []
  let dailyReports = []

  try {
    const fetchedTask = await fetchTask(id)
    if (!fetchedTask) {
      return notFound()
    }
    task = fetchedTask

    const [fetchedAssignments, fetchedMembers, fetchedProject, fetchedReport, allDailyReports] = await Promise.all([
      fetchTaskAssignments(id).catch(() => []),
      fetchProjectMembers(fetchedTask.project_id || 0).catch(() => []),
      fetchProject((fetchedTask.project_id || 0).toString()).catch(() => undefined),
      fetchTaskReport(id).catch(() => null),
      fetchDailyReports().catch(() => []),
    ])

    assignments = fetchedAssignments
    projectMembers = fetchedMembers
    project = fetchedProject
    report = fetchedReport
    dailyReports = (allDailyReports as DailyReport[]).filter(
      (dr) => dr.task_id === Number(id)
    )

    if (report) {
      reportFiles = await fetchReportFiles(report.id).catch(() => [])
    }

    // Attempt to fetch all users for name mapping
    try {
      users = await fetchUsers()
    } catch {
      // Fallback: use users from assignments and project members if fetchUsers fails (e.g. for workers)
      users = []
    }
  } catch (error) {
    console.error('Task fetch error:', error)
    return notFound()
  }

  // Create a mapping of user IDs to full names
  const userNameMap: Record<number, string> = {}

  // 1. Populate from fetched users if available
  users.forEach((u) => {
    userNameMap[u.id] = u.profile?.full_name || u.username
  })

  // 2. Supplement from project members
  projectMembers.forEach((m) => {
    if (!userNameMap[m.user_id]) {
      userNameMap[m.user_id] = m.full_name
    }
  })

  // 3. Supplement from assignments
  assignments.forEach((a) => {
    if (!userNameMap[a.user_id]) {
      userNameMap[a.user_id] = a.full_name
    }
  })

  return (
    <AppShell currentUser={currentUser}>
      <TaskDetailClient
        task={task}
        currentUserId={currentUser.id}
        currentUserRole={currentUser.role}
        assignments={assignments}
        projectMembers={projectMembers}
        project={project}
        userNameMap={userNameMap}
        report={report}
        reportFiles={reportFiles}
        dailyReports={dailyReports}
      />
    </AppShell>
  )
}
