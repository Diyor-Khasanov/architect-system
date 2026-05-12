'use client'

import { DailyReport } from '../../lib/reports'
import { FileText, Calendar, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface ProjectDailyReportsClientProps {
  reports: DailyReport[]
  userNameMap: Record<number, string>
  taskNameMap: Record<number, string>
}

export default function ProjectDailyReportsClient({
  reports,
  userNameMap,
  taskNameMap,
}: ProjectDailyReportsClientProps) {
  if (reports.length === 0) {
    return (
      <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4'>
          Recent Daily Reports
        </h2>
        <p className='text-sm text-zinc-500 dark:text-zinc-400 italic'>
          No daily reports logged for this project yet.
        </p>
      </section>
    )
  }

  return (
    <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Recent Daily Reports
        </h2>
        <Link
          href='/daily-reports'
          className='text-sm font-medium text-blue-600 hover:underline dark:text-blue-400'
        >
          View All
        </Link>
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        {reports.slice(0, 6).map((report) => (
          <div
            key={report.id}
            className='flex flex-col gap-3 rounded-xl border border-zinc-100 p-4 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-blue-50 p-2 dark:bg-blue-900/20'>
                  <FileText className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100'>
                    <User className='h-3 w-3 text-zinc-400' />
                    {userNameMap[report.user_id] || `User #${report.user_id}`}
                  </div>
                  <div className='flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400'>
                    <Calendar className='h-3 w-3' />
                    {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <Link
                href={`/daily-reports/${report.id}`}
                className='rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
              >
                <ArrowRight className='h-4 w-4 text-zinc-400' />
              </Link>
            </div>
            <div className='flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400'>
              <CheckCircle2 className='h-3 w-3 text-zinc-400' />
              <span className='truncate'>{taskNameMap[report.task_id] || `Task #${report.task_id}`}</span>
            </div>
            <p className='text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2'>
              {report.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
