import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import ProjectCreateForm from '../components/ProjectCreateForm'
import { fetchCurrentUser } from '../lib/auth'
import { fetchProjects, type Project } from '../lib/projects'

export default async function ProjectsPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (currentUser.role === 'worker') {
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
      <section className='space-y-6'>
        <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
          <h1 className='text-3xl font-semibold tracking-tight'>Projects</h1>
          <p className='mt-2 text-sm text-zinc-600'>
            Project list and management workspace (create + monitor projects).
          </p>
        </header>

        <ProjectCreateForm />

        <article className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-semibold tracking-tight'>Project list</h2>

          {fetchError ? <p className='mt-3 text-sm text-red-600'>{fetchError}</p> : null}

          {!fetchError && projects.length === 0 ? (
            <p className='mt-3 text-sm text-zinc-500'>No projects found.</p>
          ) : null}

          {!fetchError && projects.length > 0 ? (
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full min-w-[760px] text-left text-sm'>
                <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500'>
                  <tr>
                    <th className='px-2 py-3'>ID</th>
                    <th className='px-2 py-3'>Name</th>
                    <th className='px-2 py-3'>Manager ID</th>
                    <th className='px-2 py-3'>Status</th>
                    <th className='px-2 py-3'>Deadline</th>
                    <th className='px-2 py-3'>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className='border-b border-zinc-100'>
                      <td className='px-2 py-3 text-zinc-500'>{project.id}</td>
                      <td className='px-2 py-3'>
                        <p className='font-medium text-zinc-900'>{project.name}</p>
                        <p className='text-xs text-zinc-500'>{project.description}</p>
                      </td>
                      <td className='px-2 py-3 text-zinc-600'>{project.manager_id}</td>
                      <td className='px-2 py-3'>
                        <span className='rounded-full bg-zinc-100 px-2 py-1 text-xs capitalize text-zinc-700'>
                          {project.status}
                        </span>
                      </td>
                      <td className='px-2 py-3 text-zinc-600'>{new Date(project.deadline).toLocaleDateString()}</td>
                      <td className='px-2 py-3 text-zinc-500'>
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </article>
      </section>
    </AppShell>
  )
}
