import { AlertTriangle, CheckCircle2, Clock, FolderKanban, HelpCircle, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react'
import { fetchCurrentUser, type UserRole } from '../lib/auth'
import { fetchDashboardData } from '../lib/dashboard'

interface StatCard {
  title: string
  value: string
  tone: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'zinc'
  icon: typeof Users
}

const toneClasses: Record<StatCard['tone'], string> = {
  indigo: 'from-indigo-500/18 to-indigo-500/5 text-indigo-600 dark:text-indigo-300',
  emerald: 'from-emerald-500/18 to-emerald-500/5 text-emerald-600 dark:text-emerald-300',
  amber: 'from-amber-500/18 to-amber-500/5 text-amber-600 dark:text-amber-300',
  rose: 'from-rose-500/18 to-rose-500/5 text-rose-600 dark:text-rose-300',
  sky: 'from-sky-500/18 to-sky-500/5 text-sky-600 dark:text-sky-300',
  violet: 'from-violet-500/18 to-violet-500/5 text-violet-600 dark:text-violet-300',
  zinc: 'from-zinc-500/14 to-zinc-500/5 text-zinc-600 dark:text-zinc-300',
}

function valueOf(data: Record<string, number>, key: string) {
  return (data[key] ?? 0).toLocaleString('en-US')
}

function formatStats(role: UserRole, data: Record<string, number> | null): StatCard[] {
  if (!data) return []

  switch (role) {
    case 'admin':
      return [
        { title: 'Total Users', value: valueOf(data, 'total_users'), tone: 'indigo', icon: Users },
        { title: 'Active Users', value: valueOf(data, 'active_users'), tone: 'emerald', icon: ShieldCheck },
        { title: 'Total Projects', value: valueOf(data, 'total_projects'), tone: 'sky', icon: FolderKanban },
        { title: 'Active Projects', value: valueOf(data, 'active_projects'), tone: 'violet', icon: TrendingUp },
        { title: 'Total Tasks', value: valueOf(data, 'total_tasks'), tone: 'zinc', icon: CheckCircle2 },
        { title: 'Completed Tasks', value: valueOf(data, 'completed_tasks'), tone: 'emerald', icon: CheckCircle2 },
        { title: 'Pending Help Requests', value: valueOf(data, 'pending_help_requests'), tone: 'amber', icon: HelpCircle },
      ]
    case 'manager':
      return [
        { title: 'Total Projects', value: valueOf(data, 'total_projects'), tone: 'sky', icon: FolderKanban },
        { title: 'Active Projects', value: valueOf(data, 'active_projects'), tone: 'violet', icon: TrendingUp },
        { title: 'Total Workers', value: valueOf(data, 'total_workers'), tone: 'indigo', icon: Users },
        { title: 'Total Tasks', value: valueOf(data, 'total_tasks'), tone: 'zinc', icon: CheckCircle2 },
        { title: 'Completed Tasks', value: valueOf(data, 'completed_tasks'), tone: 'emerald', icon: CheckCircle2 },
        { title: 'Pending Help Requests', value: valueOf(data, 'pending_help_requests'), tone: 'amber', icon: HelpCircle },
      ]
    case 'worker':
      return [
        { title: 'Total Assigned Tasks', value: valueOf(data, 'total_assigned_tasks'), tone: 'indigo', icon: CheckCircle2 },
        { title: 'Active Tasks', value: valueOf(data, 'active_tasks'), tone: 'sky', icon: TrendingUp },
        { title: 'Completed Tasks', value: valueOf(data, 'completed_tasks'), tone: 'emerald', icon: CheckCircle2 },
        { title: 'Blocked Tasks', value: valueOf(data, 'blocked_tasks'), tone: 'rose', icon: AlertTriangle },
        { title: 'Overdue Tasks', value: valueOf(data, 'overdue_tasks'), tone: 'amber', icon: Clock },
        { title: 'Pending Help Requests', value: valueOf(data, 'pending_help_requests'), tone: 'violet', icon: HelpCircle },
      ]
    default:
      return []
  }
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    return null
  }

  const dashboardData = await fetchDashboardData(currentUser.role)
  const stats = formatStats(currentUser.role, dashboardData)
  const displayName = currentUser.profile?.full_name || currentUser.username
  const completed = Number(dashboardData?.completed_tasks ?? 0)
  const total = Number(dashboardData?.total_tasks ?? dashboardData?.total_assigned_tasks ?? 0)
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <section className='space-y-6 pb-6'>
      <header className='relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] sm:p-8'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.24),transparent_28%),radial-gradient(circle_at_84%_15%,rgba(20,184,166,0.18),transparent_26%),radial-gradient(circle_at_70%_90%,rgba(244,114,182,0.12),transparent_30%)]' />
        <div className='relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end'>
          <div className='space-y-5'>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-indigo-200'>
              <Sparkles className='h-3.5 w-3.5' />
              {currentUser.role} workspace
            </div>
            <div>
              <p className='text-sm font-medium text-zinc-500 dark:text-zinc-400'>Welcome back</p>
              <h1 className='mt-2 text-4xl font-semibold tracking-[-0.055em] text-zinc-950 dark:text-white sm:text-5xl'>
                {displayName}
              </h1>
              <p className='mt-4 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base'>Your secure session is active. Monitor role-specific work, surface blockers, and move through daily operations from this mobile-first command center.</p>
            </div>
          </div>

          <div className='rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400'>Task completion</p>
                <p className='mt-2 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white'>{completionRate}%</p>
              </div>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'>
                <CheckCircle2 className='h-7 w-7' />
              </div>
            </div>
            <div className='mt-5 h-3 overflow-hidden rounded-full bg-zinc-200/70 dark:bg-white/10'>
              <div className='h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500' style={{ width: `${completionRate}%` }} />
            </div>
            <p className='mt-3 text-xs text-zinc-500 dark:text-zinc-400'>{completed.toLocaleString('en-US')} of {total.toLocaleString('en-US')} tasks completed</p>
          </div>
        </div>
      </header>

      {!dashboardData ? (
        <div className='rounded-[1.5rem] border border-red-200 bg-red-50/90 p-5 text-red-700 shadow-sm backdrop-blur-xl dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-200'>
          <div className='flex gap-3'>
            <AlertTriangle className='mt-0.5 h-5 w-5 shrink-0' />
            <div>
              <h2 className='font-semibold'>Dashboard data could not be loaded</h2>
              <p className='mt-1 text-sm leading-6'>Authentication succeeded, but the dashboard endpoint did not return usable data. Check the API base URL, backend availability, and this user role&apos;s dashboard route.</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {stats.map((stat) => (
          <article
            key={stat.title}
            className='group relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-950/10 dark:border-white/10 dark:bg-white/[0.06] dark:hover:shadow-black/30'
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${toneClasses[stat.tone]} opacity-80`} />
            <div className='relative flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm font-medium text-zinc-600 dark:text-zinc-300'>{stat.title}</p>
                <p className='mt-3 text-4xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white'>{stat.value}</p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/60 shadow-sm backdrop-blur-xl transition group-hover:scale-105 dark:border-white/10 dark:bg-white/10'>
                <stat.icon className='h-6 w-6' />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
