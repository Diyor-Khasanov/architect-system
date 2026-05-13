import {
  fetchDeadlineAnalytics,
  fetchProjectProgressAnalytics,
  fetchReportsAnalytics,
  fetchWorkloadAnalytics,
} from '../../lib/analytics'
import type { DeadlineAnalytics } from '../../lib/analytics'
import { fetchCurrentUser } from '../../lib/auth'
import { AlertCircle, Calendar, CheckCircle2, Clock, BarChart3, PieChart, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const user = await fetchCurrentUser()
  if (!user) return null

  const isAdvanced = user.role === 'admin' || user.role === 'manager'

  const [deadlineData, reportsData, workloadData] = await Promise.all([
    fetchDeadlineAnalytics(),
    isAdvanced ? fetchReportsAnalytics() : Promise.resolve(null),
    isAdvanced ? fetchWorkloadAnalytics() : Promise.resolve(null),
  ])

  // Helper to safely extract arrays even if the API structure varies
  const typedDeadlineData = deadlineData as (DeadlineAnalytics | null)
  const upcomingDeadlines =
    typedDeadlineData?.upcoming_deadlines || (Array.isArray((deadlineData as { items?: { id: number; name: string; deadline: string; days_left: number }[] })?.items) ? (deadlineData as { items: { id: number; name: string; deadline: string; days_left: number }[] }).items : [])
  const overdueTasks = typedDeadlineData?.overdue_tasks || []
  const summary = typedDeadlineData?.summary || {
    total_active_tasks: upcomingDeadlines.length,
    approaching_deadlines_count: upcomingDeadlines.filter((t: { days_left: number }) => t.days_left <= 7).length,
    overdue_count: overdueTasks.length,
  }

  if (!deadlineData && !isAdvanced) {
    return (
      <div className='rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <p className='text-zinc-500 dark:text-zinc-400'>No analytics data available at the moment.</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <header>
        <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          {isAdvanced ? 'Analytics Dashboard' : 'Deadline Analytics'}
        </h1>
        <p className='mt-2 text-zinc-600 dark:text-zinc-400'>
          {isAdvanced ? 'Comprehensive project and team performance insights.' : 'Track your upcoming deadlines and overdue tasks.'}
        </p>
      </header>

      {/* Deadline Summary Cards */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='flex items-center gap-3 text-zinc-500 dark:text-zinc-400'>
            <CheckCircle2 className='h-5 w-5 text-blue-500' />
            <span className='text-sm font-medium'>Active Tasks</span>
          </div>
          <p className='mt-4 text-3xl font-semibold text-zinc-900 dark:text-zinc-100'>{summary.total_active_tasks}</p>
        </div>

        <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='flex items-center gap-3 text-zinc-500 dark:text-zinc-400'>
            <Clock className='h-5 w-5 text-amber-500' />
            <span className='text-sm font-medium'>Approaching Deadlines</span>
          </div>
          <p className='mt-4 text-3xl font-semibold text-zinc-900 dark:text-zinc-100'>{summary.approaching_deadlines_count}</p>
        </div>

        <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='flex items-center gap-3 text-zinc-500 dark:text-zinc-400'>
            <AlertCircle className='h-5 w-5 text-red-500' />
            <span className='text-sm font-medium'>Overdue Tasks</span>
          </div>
          <p className='mt-4 text-3xl font-semibold text-zinc-900 dark:text-zinc-100'>{summary.overdue_count}</p>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Upcoming Deadlines */}
        <section className='rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='border-b border-zinc-100 p-6 dark:border-zinc-800'>
            <h2 className='flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
              <Calendar className='h-5 w-5 text-zinc-500' />
              Upcoming Deadlines
            </h2>
          </div>
          <div className='p-6'>
            {upcomingDeadlines.length > 0 ? (
              <div className='space-y-4'>
                {upcomingDeadlines.map((task: { id: number; name: string; deadline: string; days_left: number }) => (
                  <div key={task.id} className='flex items-center justify-between rounded-xl border border-zinc-100 p-4 dark:border-zinc-800'>
                    <div>
                      <h3 className='font-medium text-zinc-900 dark:text-zinc-100'>{task.name}</h3>
                      <p className='text-sm text-zinc-500 dark:text-zinc-400'>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                    <div className='text-right'>
                      <span className='inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'>
                        {task.days_left} days left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-zinc-500 dark:text-zinc-400'>No upcoming deadlines.</p>
            )}
          </div>
        </section>

        {/* Overdue Tasks */}
        <section className='rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='border-b border-zinc-100 p-6 dark:border-zinc-800'>
            <h2 className='flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
              <AlertCircle className='h-5 w-5 text-red-500' />
              Overdue Tasks
            </h2>
          </div>
          <div className='p-6'>
            {overdueTasks.length > 0 ? (
              <div className='space-y-4'>
                {overdueTasks.map((task: { id: number; name: string; deadline: string; days_overdue: number }) => (
                  <div
                    key={task.id}
                    className='flex items-center justify-between rounded-xl border border-red-100 bg-red-50/30 p-4 dark:border-red-900/30 dark:bg-red-950/10'
                  >
                    <div>
                      <h3 className='font-medium text-red-900 dark:text-red-100'>{task.name}</h3>
                      <p className='text-sm text-red-700/70 dark:text-red-400/70'>Was due: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                    <div className='text-right'>
                      <span className='inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/50 dark:text-red-200'>
                        {task.days_overdue} days overdue
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-zinc-500 dark:text-zinc-400'>No overdue tasks. Great job!</p>
            )}
          </div>
        </section>


        {/* Workload - Admin/Manager Only */}
        {isAdvanced && (
          <section className='rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <div className='border-b border-zinc-100 p-6 dark:border-zinc-800'>
              <h2 className='flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
                <Users className='h-5 w-5 text-zinc-500' />
                Team Workload
              </h2>
            </div>
            <div className='p-6'>
              {workloadData &&
              (Array.isArray(workloadData) || Array.isArray((workloadData as { items?: unknown[] }).items) || Array.isArray((workloadData as { users?: unknown[] }).users)) ? (
                <div className='space-y-4'>
                  {(Array.isArray(workloadData) ? (workloadData as { id?: number; user_id?: number; full_name?: string; username?: string; role: string; task_count?: number; tasks_count?: number }[]) : (workloadData as { items?: { id?: number; user_id?: number; full_name?: string; username?: string; role: string; task_count?: number; tasks_count?: number }[]; users?: { id?: number; user_id?: number; full_name?: string; username?: string; role: string; task_count?: number; tasks_count?: number }[] }).items || (workloadData as { items?: { id?: number; user_id?: number; full_name?: string; username?: string; role: string; task_count?: number; tasks_count?: number }[]; users?: { id?: number; user_id?: number; full_name?: string; username?: string; role: string; task_count?: number; tasks_count?: number }[] }).users || []).map((user) => (
                    <div
                      key={user.id || user.user_id}
                      className='flex items-center justify-between rounded-xl border border-zinc-100 p-4 dark:border-zinc-800'
                    >
                      <div>
                        <h3 className='font-medium text-zinc-900 dark:text-zinc-100'>
                          {user.full_name || user.username || `User ${user.id}`}
                        </h3>
                        <p className='text-xs text-zinc-500 dark:text-zinc-400'>{user.role}</p>
                      </div>
                      <div className='text-right'>
                        <span className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
                          {user.task_count || user.tasks_count || 0}
                        </span>
                        <p className='text-[10px] uppercase tracking-wider text-zinc-500'>Active Tasks</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-zinc-500 dark:text-zinc-400'>No workload data available.</p>
              )}
            </div>
          </section>
        )}

        {/* Reports - Admin/Manager Only */}
        {isAdvanced && (
          <section className='col-span-full rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <div className='border-b border-zinc-100 p-6 dark:border-zinc-800'>
              <h2 className='flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
                <PieChart className='h-5 w-5 text-zinc-500' />
                Performance Reports
              </h2>
            </div>
            <div className='p-6'>
              {reportsData && typeof reportsData === 'object' && !Array.isArray(reportsData) ? (
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  {Object.entries(reportsData as Record<string, unknown>).map(([key, value]) => (
                    <div key={key} className='rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50'>
                      <p className='text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className='mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>
                        {typeof value === 'number' ? value : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-zinc-500 dark:text-zinc-400'>No reports data available.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
