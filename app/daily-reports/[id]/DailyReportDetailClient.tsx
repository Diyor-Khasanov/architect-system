'use client'

import { useActionState, useEffect, useState } from 'react'
import { DailyReport } from '../../lib/reports'
import { updateDailyReportAction } from '../../actions/reports'
import { useToast } from '../../context/ToastContext'
import { format } from 'date-fns'
import {
  FileText,
  Calendar,
  Folder,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface DailyReportDetailClientProps {
  report: DailyReport
  canEdit: boolean
  userName: string
  projectName: string
  taskName: string
}

export default function DailyReportDetailClient({
  report,
  canEdit,
  userName,
  projectName,
  taskName
}: DailyReportDetailClientProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const [state, action, isPending] = useActionState(
    updateDailyReportAction.bind(null, report.id),
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast('Report updated successfully', 'success')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsEditing(false)
    } else if (state?.error) {
      toast(state.error, 'error')
    }
  }, [state, toast])

  return (
    <section className='mx-auto max-w-4xl space-y-6'>
      <header className='flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <Link
          href='/daily-reports'
          className='flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Reports
        </Link>
        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
          >
            <Edit3 className='h-4 w-4' />
            Edit Report
          </button>
        )}
      </header>

      <article className='overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='border-b border-zinc-100 p-6 dark:border-zinc-800/50'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-blue-50 p-2.5 dark:bg-blue-900/20'>
                <FileText className='h-6 w-6 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <h1 className='text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
                  Daily Report #{report.id}
                </h1>
                <p className='text-sm text-zinc-500'>Submitted by {userName}</p>
              </div>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400'>
              <Calendar className='h-4 w-4 text-zinc-400' />
              <span>{format(new Date(report.created_at), 'MMMM d, yyyy')}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400'>
              <Clock className='h-4 w-4 text-zinc-400' />
              <span>{format(new Date(report.created_at), 'HH:mm')}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400'>
              <Folder className='h-4 w-4 text-zinc-400' />
              <span className='truncate'>{projectName}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400'>
              <CheckCircle2 className='h-4 w-4 text-zinc-400' />
              <span className='truncate'>{taskName}</span>
            </div>
          </div>
        </div>

        <div className='p-6'>
          {isEditing ? (
            <form action={action} className='space-y-4'>
              <textarea
                name='text'
                defaultValue={report.text}
                required
                rows={12}
                className='w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100'
              />
              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isPending}
                  className='flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                >
                  {isPending ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Save className='h-4 w-4' />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className='prose prose-sm max-w-none dark:prose-invert'>
              <div className='whitespace-pre-wrap rounded-xl bg-zinc-50 p-6 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-200'>
                {report.text}
              </div>
            </div>
          )}
        </div>

        <div className='border-t border-zinc-100 bg-zinc-50/50 p-4 px-6 dark:border-zinc-800 dark:bg-zinc-800/20'>
          <p className='text-[10px] uppercase tracking-wider text-zinc-400'>
            Last updated: {format(new Date(report.updated_at), 'PPp')}
          </p>
        </div>
      </article>
    </section>
  )
}
