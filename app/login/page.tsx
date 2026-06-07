import { redirect } from 'next/navigation'
import { Command, KeyRound, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import LoginForm from '../components/LoginForm'
import { fetchCurrentUser } from '../lib/auth'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const currentUser = await fetchCurrentUser()

  if (currentUser) {
    redirect('/dashboard')
  }

  return (
    <main className='relative flex min-h-screen w-full overflow-hidden bg-[#f7f8fb] text-zinc-950 dark:bg-[#05070d] dark:text-white'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(99,102,241,0.22),transparent_30%),radial-gradient(circle_at_84%_12%,rgba(45,212,191,0.20),transparent_28%),radial-gradient(circle_at_70%_82%,rgba(244,114,182,0.16),transparent_32%)]' />
      <div className='absolute inset-0 premium-grid opacity-70 dark:opacity-40' />
      <div className='absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-white/40 blur-3xl dark:bg-indigo-500/10' />

      <section className='relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8'>
        <div className='hidden space-y-8 lg:block'>
          <div className='inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-zinc-200'>
            <Sparkles className='h-4 w-4 text-indigo-500' />
            Material 3 × Apple HIG × Glassmorphism
          </div>

          <div className='max-w-2xl space-y-6'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl shadow-zinc-950/20 dark:bg-white dark:text-zinc-950'>
                <Command className='h-7 w-7' />
              </div>
              <div>
                <p className='text-xl font-semibold tracking-tight'>Architect System</p>
                <p className='text-sm text-zinc-500 dark:text-zinc-400'>Production command center</p>
              </div>
            </div>

            <h1 className='text-6xl font-semibold leading-[0.95] tracking-[-0.07em] text-zinc-950 dark:text-white'>Ultra premium mobile-first project operations.</h1>
            <p className='max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300'>Authenticate through the backend API, keep credentials in secure HTTP-only cookies, and land directly inside the role-based dashboard after success.</p>
          </div>

          <div className='grid max-w-2xl gap-4 sm:grid-cols-3'>
            {[
              { icon: ShieldCheck, title: 'Secure cookies', body: 'HTTP-only, SameSite session storage.' },
              { icon: KeyRound, title: 'API verified', body: 'Backend auth + /auth/me validation.' },
              { icon: Layers3, title: 'Role aware', body: 'Admin, manager and worker routes.' },
            ].map((item) => (
              <article key={item.title} className='rounded-3xl border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5'>
                <item.icon className='h-6 w-6 text-indigo-500 dark:text-indigo-300' />
                <h2 className='mt-4 text-sm font-semibold text-zinc-950 dark:text-white'>{item.title}</h2>
                <p className='mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className='mx-auto flex w-full max-w-[480px] flex-col items-center gap-6 lg:ml-auto'>
          <div className='flex items-center gap-3 lg:hidden'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl dark:bg-white dark:text-zinc-950'>
              <Command className='h-6 w-6' />
            </div>
            <div>
              <p className='text-lg font-semibold tracking-tight'>Architect System</p>
              <p className='text-xs text-zinc-500 dark:text-zinc-400'>Secure mobile workspace</p>
            </div>
          </div>

          <LoginForm />

          <p className='max-w-sm text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400'>Need access? Ask an administrator to create your account and assign the correct role before signing in.</p>
        </div>
      </section>
    </main>
  )
}
