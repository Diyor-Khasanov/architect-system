import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchProjects, type Project } from '../lib/projects'
import { fetchUsers, type User } from '../lib/users'
import { User as UserIcon, Shield, HardHat } from 'lucide-react'

export default async function TeamPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (currentUser.role === 'worker') {
    redirect('/dashboard')
  }

  let projects: Project[] = []
  try {
    projects = await fetchProjects()
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }

  // Filter projects to find those where the current user is a member or manager
  const myProjects = projects.filter((p) =>
    p.manager_id === currentUser.id ||
    p.members?.some((m) => m.user_id === currentUser.id)
  )

  // Collect all unique teammate IDs from these projects
  const teammateIds = new Set<number>()
  myProjects.forEach((p) => {
    teammateIds.add(p.manager_id)
    p.members?.forEach((m) => teammateIds.add(m.user_id))
  })

  // Try to fetch all users to get full details (role, email, status)
  // If this fails due to permissions, we'll fall back to data from myProjects
  let allUsers: User[] = []
  let fetchUsersFailed = false
  try {
    allUsers = await fetchUsers()
  } catch (error) {
    console.warn('Worker might not have permission to fetch all users:', error)
    fetchUsersFailed = true
  }

  interface TeammateDisplay {
    id: number
    name: string
    email: string
    role: string
    is_active: boolean
  }

  let teammates: TeammateDisplay[] = []

  if (!fetchUsersFailed && allUsers.length > 0) {
    // If we have the full users list, filter it to teammate IDs
    teammates = allUsers
      .filter((u) => teammateIds.has(u.id) && u.id !== currentUser.id)
      .map((u) => ({
        id: u.id,
        name: u.profile?.full_name || u.username,
        email: u.email,
        role: u.role,
        is_active: u.is_active,
      }))
  } else {
    // Fallback: Aggregate from projects data
    const teammateMap = new Map<number, TeammateDisplay>()

    myProjects.forEach((p) => {
      // Add manager
      if (p.manager_id !== currentUser.id && !teammateMap.has(p.manager_id)) {
        teammateMap.set(p.manager_id, {
          id: p.manager_id,
          name: `Manager (ID: ${p.manager_id})`,
          email: '---',
          role: 'manager',
          is_active: true,
        })
      }

      // Add members
      p.members?.forEach((m) => {
        if (m.user_id !== currentUser.id && !teammateMap.has(m.user_id)) {
          teammateMap.set(m.user_id, {
            id: m.user_id,
            name: m.full_name,
            email: '---',
            role: m.role,
            is_active: true,
          })
        }
      })
    })

    teammates = Array.from(teammateMap.values())
  }

  // Always include admins if the user can fetch all users
  if (!fetchUsersFailed && allUsers.length > 0) {
    const admins = allUsers.filter(u => u.role === 'admin' && !teammateIds.has(u.id) && u.id !== currentUser.id)
    admins.forEach(admin => {
        teammates.push({
            id: admin.id,
            name: admin.profile?.full_name || admin.username,
            email: admin.email,
            role: admin.role,
            is_active: admin.is_active
        })
    })
  }

  return (
    <AppShell currentUser={currentUser}>
      <section className='space-y-6'>
        <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
          <h1 className='text-2xl md:text-3xl font-semibold tracking-tight'>My Team</h1>
          <p className='mt-2 text-sm text-zinc-600'>
            View your teammates from assigned projects and platform administrators.
          </p>
        </header>

        <article className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-semibold tracking-tight'>Teammates</h2>

          {teammates.length === 0 ? (
            <p className='mt-3 text-sm text-zinc-500'>No teammates found.</p>
          ) : (
            <div className='mt-4 overflow-x-auto -mx-5 px-5'>
              <table className='w-full min-w-[600px] text-left text-sm'>
                <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500'>
                  <tr>
                    <th className='px-2 py-3'>Name</th>
                    <th className='px-2 py-3'>Role</th>
                    <th className='px-2 py-3'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teammates.map((teammate) => (
                    <tr key={teammate.id} className='border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors'>
                      <td className='px-2 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600'>
                            <UserIcon className='h-5 w-5' />
                          </div>
                          <div>
                            <p className='font-medium text-zinc-900'>{teammate.name}</p>
                            <p className='text-xs text-zinc-500'>{teammate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-2 py-4'>
                        <div className='flex items-center gap-1.5'>
                          {teammate.role === 'admin' ? (
                            <Shield className='h-3.5 w-3.5 text-zinc-900' />
                          ) : teammate.role === 'manager' ? (
                            <UserIcon className='h-3.5 w-3.5 text-zinc-600' />
                          ) : (
                            <HardHat className='h-3.5 w-3.5 text-zinc-400' />
                          )}
                          <span className='capitalize'>{teammate.role}</span>
                        </div>
                      </td>
                      <td className='px-2 py-4'>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            teammate.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          {teammate.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </AppShell>
  )
}
