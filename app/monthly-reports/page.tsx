import { fetchMonthlyReports } from '../lib/reports'
import { fetchCurrentUser } from '../lib/auth'
import { fetchUsers } from '../lib/users'
import { fetchProjects } from '../lib/projects'
import MonthlyReportsClient from './MonthlyReportsClient'
import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'

export default async function MonthlyReportsPage() {
  const currentUser = await fetchCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  const [reportsResult, usersResult, projectsResult] = await Promise.allSettled([
    fetchMonthlyReports(),
    fetchUsers(),
    fetchProjects()
  ])

  const reports = reportsResult.status === 'fulfilled' ? reportsResult.value : []
  const users = usersResult.status === 'fulfilled' ? usersResult.value : []
  const projects = projectsResult.status === 'fulfilled' ? projectsResult.value : []

  const userNameMap = Object.fromEntries(users.map((u) => [u.id, u.profile?.full_name || u.username]))
  const projectNameMap = Object.fromEntries(projects.map((p) => [p.id, p.name]))

  return (
    <AppShell currentUser={currentUser}>
      <MonthlyReportsClient
        reports={reports}
        currentUser={currentUser}
        userNameMap={userNameMap}
        projectNameMap={projectNameMap}
        projects={projects}
      />
    </AppShell>
  )
}
