import { fetchDailyReports } from '../lib/reports'
import { fetchCurrentUser } from '../lib/auth'
import { fetchUsers } from '../lib/users'
import { fetchProjects } from '../lib/projects'
import { fetchTasks } from '../lib/tasks'
import DailyReportsClient from './DailyReportsClient'
import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'

export default async function DailyReportsPage() {
  const currentUser = await fetchCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  const [reportsResult, usersResult, projectsResult, tasksResult] = await Promise.allSettled([
    fetchDailyReports(),
    fetchUsers(),
    fetchProjects(),
    fetchTasks()
  ])

  const reports = reportsResult.status === 'fulfilled' ? reportsResult.value : []
  const users = usersResult.status === 'fulfilled' ? usersResult.value : []
  const projects = projectsResult.status === 'fulfilled' ? projectsResult.value : []
  const tasks = tasksResult.status === 'fulfilled' ? tasksResult.value : []

  const userNameMap = Object.fromEntries(users.map((u) => [u.id, u.profile?.full_name || u.username]))
  const projectNameMap = Object.fromEntries(projects.map((p) => [p.id, p.name]))
  const taskNameMap = Object.fromEntries(tasks.map((t) => [t.id, t.title]))

  return (
    <AppShell currentUser={currentUser}>
      <DailyReportsClient
        reports={reports}
        canCreate={currentUser.role === 'worker'}
        userNameMap={userNameMap}
        projectNameMap={projectNameMap}
        taskNameMap={taskNameMap}
      />
    </AppShell>
  )
}
