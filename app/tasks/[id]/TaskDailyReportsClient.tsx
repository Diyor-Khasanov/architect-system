'use client'

import { DailyReport } from '../../lib/reports'
import { FileText, Calendar, User, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface TaskDailyReportsClientProps {
  reports: DailyReport[]
  userNameMap: Record<number, string>
}

export default function TaskDailyReportsClient({ reports, userNameMap }: TaskDailyReportsClientProps) {
  if (reports.length === 0) {
    return (
      <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4'>
          Daily Progress Reports
        </h2>
        <p className='text-sm text-zinc-500 dark:text-zinc-400 italic'>
          No daily reports logged for this task yet.
        </p>
      </section>
    )
  }

  return (
    <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6'>
        Daily Progress Reports
      </h2>
      <div className='space-y-4'>
        {reports.map((report) => (
          <div
            key={report.id}
            className='flex flex-col gap-3 rounded-xl border border-zinc-100 p-4 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-blue-50 p-2 dark:bg-blue-900/20'>
                  <FileText className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div className='flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400'>
                  <div className='flex items-center gap-1.5'>
                    <User className='h-3.5 w-3.5' />
                    {userNameMap[report.user_id] || `User #${report.user_id}`}
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5' />
                    {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <Link
                href={`/daily-reports/${report.id}`}
                className='flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400'
              >
                View Details
                <ArrowRight className='h-3 w-3' />
              </Link>
            </div>
            <p className='text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 whitespace-pre-wrap'>
              {report.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
