'use client'

import Link from 'next/link'
import { DailyReport } from '../lib/reports'
import { FileText, Plus, Calendar, User, Folder, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'

interface DailyReportsClientProps {
  reports: DailyReport[]
  canCreate: boolean
  userNameMap: Record<number, string>
  projectNameMap: Record<number, string>
  taskNameMap: Record<number, string>
}

export default function DailyReportsClient({
  reports,
  canCreate,
  userNameMap,
  projectNameMap,
  taskNameMap
}: DailyReportsClientProps) {
  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>Daily Reports</h1>
          <p className='text-zinc-500 dark:text-zinc-400'>View and manage daily work reports.</p>
        </div>
        {canCreate && (
          <Link
            href='/daily-reports/create'
            className='flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
          >
            <Plus className='h-4 w-4' />
            Create Report
          </Link>
        )}
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {reports.length > 0 ? (
          reports.map((report) => (
            <Link
              key={report.id}
              href={`/daily-reports/${report.id}`}
              className='group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800'>
                  <FileText className='h-5 w-5 text-zinc-600 dark:text-zinc-400' />
                </div>
                <span className='text-[10px] font-medium uppercase tracking-wider text-zinc-500'>
                  ID: #{report.id}
                </span>
              </div>

              <div className='mb-4 flex-1'>
                <h3 className='mb-1 line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {report.text}
                </h3>
                <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400'>
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

              <div className='space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800'>
                <div className='flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400'>
                  <Folder className='h-3.5 w-3.5 shrink-0' />
                  <span className='truncate'>{projectNameMap[report.project_id] || `Project #${report.project_id}`}</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400'>
                  <CheckCircle2 className='h-3.5 w-3.5 shrink-0' />
                  <span className='truncate'>{taskNameMap[report.task_id] || `Task #${report.task_id}`}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 dark:border-zinc-800'>
            <FileText className='mb-4 h-10 w-10 text-zinc-300 dark:text-zinc-700' />
            <p className='text-zinc-500 dark:text-zinc-400'>No daily reports found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
