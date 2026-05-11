import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, User, Activity, FileText } from 'lucide-react'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchAuditLogById } from '../../lib/audit-logs'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AuditLogDetailPage({ params }: PageProps) {
  const { id } = await params
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (currentUser.role !== 'admin') {
    redirect('/dashboard')
  }

  const log = await fetchAuditLogById(id)

  if (!log) {
    return (
      <AppShell currentUser={currentUser}>
        <div className='flex flex-col items-center justify-center py-20'>
          <h2 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100'>Log Not Found</h2>
          <p className='mt-2 text-zinc-500 dark:text-zinc-400'>The audit log entry you are looking for does not exist.</p>
          <Link href='/audit-logs' className='mt-6 text-sm font-medium text-zinc-900 underline dark:text-zinc-100'>
            Back to Audit Logs
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentUser={currentUser}>
      <div className='mx-auto max-w-7xl space-y-6'>
        <Link
          href='/audit-logs'
          className='inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Audit Logs
        </Link>

        <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'>
              <Activity className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>{log.action}</h1>
              <p className='text-sm text-zinc-500 dark:text-zinc-400'>
                Audit Log Entry # {log.id}
              </p>
            </div>
          </div>
        </header>

        <div className='grid gap-6 md:grid-cols-2'>
          <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>Event Context</h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Activity className='h-4 w-4 text-zinc-400' />
                <div className='flex-1 border-b border-zinc-100 pb-1 dark:border-zinc-800'>
                  <span className='block text-xs text-zinc-500'>Resource</span>
                  <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>{log.resource}</span>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <FileText className='h-4 w-4 text-zinc-400' />
                <div className='flex-1 border-b border-zinc-100 pb-1 dark:border-zinc-800'>
                  <span className='block text-xs text-zinc-500'>Resource ID</span>
                  <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>{log.resource_id ?? 'N/A'}</span>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <User className='h-4 w-4 text-zinc-400' />
                <div className='flex-1 border-b border-zinc-100 pb-1 dark:border-zinc-800'>
                  <span className='block text-xs text-zinc-500'>Actor User ID</span>
                  <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>{log.user_id}</span>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <Calendar className='h-4 w-4 text-zinc-400' />
                <div className='flex-1 border-b border-zinc-100 pb-1 dark:border-zinc-800'>
                  <span className='block text-xs text-zinc-500'>Timestamp</span>
                  <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>{new Date(log.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </article>

          <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>Metadata JSON</h2>
            <pre className='overflow-auto rounded-lg bg-zinc-50 p-4 text-xs text-zinc-700 dark:bg-zinc-950 dark:text-zinc-400'>
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </article>
        </div>
      </div>
    </AppShell>
  )
}
