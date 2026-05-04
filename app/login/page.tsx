import { redirect } from 'next/navigation'
import LoginForm from '../components/LoginForm'
import { fetchCurrentUser } from '../lib/auth'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const currentUser = await fetchCurrentUser()

  if (currentUser) {
    redirect('/dashboard')
  }

  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950'>
      <div className='mb-8 flex items-center gap-2'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 dark:bg-zinc-100'>
          <div className='h-3 w-3 rotate-45 bg-white dark:bg-zinc-900' />
        </div>
        <span className='text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Architect Dashboard
        </span>
      </div>

      <LoginForm />
    </main>
  )
}
