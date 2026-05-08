import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchProjects, type Project } from '../lib/projects'
import { fetchUsers } from '../lib/users'
import ProjectsClient from './ProjectsClient'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (!['admin', 'manager'].includes(currentUser.role)) {
    redirect('/dashboard')
  }

  let projects: Project[] = []
  let managers: { id: number; username: string; full_name: string }[] = []
  let fetchError = ''

  try {
    projects = await fetchProjects()
    if (['admin', 'manager'].includes(currentUser.role)) {
      const allUsers = await fetchUsers()
      managers = allUsers
        .filter((u) => u.role === 'manager')
        .map((u) => ({
          id: u.id,
          username: u.username,
          full_name: u.profile?.full_name || u.username,
        }))
    }
  } catch {
    fetchError = 'Failed to load data from API.'
  }

  return (
    <AppShell currentUser={currentUser}>
      <ProjectsClient
        projects={projects}
        currentUser={currentUser}
        fetchError={fetchError}
        availableManagers={managers}
      />
    </AppShell>
  )
}
