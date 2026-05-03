import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchMyProfile } from '../lib/users'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  let userProfile = null
  try {
    userProfile = await fetchMyProfile()
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }

  if (!userProfile) {
    return (
      <AppShell currentUser={currentUser}>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700'>
          <h2 className='text-lg font-semibold'>Error</h2>
          <p className='mt-2'>Failed to load your profile information. Please try again later.</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentUser={currentUser}>
      <ProfileClient user={userProfile} />
    </AppShell>
  )
}
