import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchProjects, type Project } from '../lib/projects'
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
  let fetchError = ''

  try {
    projects = await fetchProjects()
  } catch {
    fetchError = 'Failed to load projects from API.'
  }

  return (
    <AppShell currentUser={currentUser}>
      <ProjectsClient projects={projects} currentUser={currentUser} fetchError={fetchError} />
    </AppShell>
  )
}
