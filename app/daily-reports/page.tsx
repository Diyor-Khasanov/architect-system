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

  const reports = await fetchDailyReports()
  const users = await fetchUsers()
  const projects = await fetchProjects()
  const tasks = await fetchTasks()

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
