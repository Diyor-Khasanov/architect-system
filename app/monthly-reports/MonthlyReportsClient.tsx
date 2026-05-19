'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { MonthlyReport } from '../lib/reports'
import { BarChart3, Plus, Calendar, User, Folder, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { Project } from '../lib/projects'
import Combobox from '../components/Combobox'
import { MeResponse as UserType } from '../lib/auth'
import { generateMonthlyReportAction, submitMonthlyReportAction } from '../actions/reports'
import { useToast } from '../context/ToastContext'

interface MonthlyReportsClientProps {
  reports: MonthlyReport[]
  currentUser: UserType
  userNameMap: Record<number, string>
  projectNameMap: Record<number, string>
  projects: Project[]
}

type ActionResponse = {
  success?: boolean
  error?: string
  reportId?: number
}

export default function MonthlyReportsClient({
  reports,
  currentUser,
  userNameMap,
  projectNameMap,
  projects
}: MonthlyReportsClientProps) {
  const { toast } = useToast()
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  const isAdmin = currentUser.role === 'admin'
  const isWorker = currentUser.role === 'worker'

  const [generateState, generateAction, isGenerating] = useActionState(
    async (prevState: ActionResponse, formData: FormData) => {
      const result = await generateMonthlyReportAction(prevState, formData)
      if (result.success) {
        toast('Monthly report generated successfully', 'success')
        setShowGenerateModal(false)
      } else if (result.error) {
        toast(result.error, 'error')
      }
      return result as ActionResponse
    },
    { success: false } as ActionResponse
  )

  const [submitState, submitAction, isSubmitting] = useActionState(
    async (prevState: ActionResponse, formData: FormData) => {
      const result = await submitMonthlyReportAction(prevState, formData)
      if (result.success) {
        toast('Monthly report submitted successfully', 'success')
        setShowSubmitModal(false)
      } else if (result.error) {
        toast(result.error, 'error')
      }
      return result as ActionResponse
    },
    { success: false } as ActionResponse
  )

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>Monthly Reports</h1>
          <p className='text-zinc-500 dark:text-zinc-400'>View and manage monthly project performance reports.</p>
        </div>
        <div className='flex gap-2'>
          {isAdmin && (
            <button
              onClick={() => setShowGenerateModal(true)}
              className='flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              <Plus className='h-4 w-4' />
              Generate Report
            </button>
          )}
          {isWorker && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className='flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              <Plus className='h-4 w-4' />
              Submit Report
            </button>
          )}
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {reports.length > 0 ? (
          reports.map((report) => (
            <Link
              key={report.id}
              href={`/monthly-reports/${report.id}`}
              className='group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800'>
                  <BarChart3 className='h-5 w-5 text-zinc-600 dark:text-zinc-400' />
                </div>
              </div>

              <div className='mb-4 flex-1'>
                <h3 className='mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  Monthly Report - {months.find(m => m.value === report.month)?.label} {report.year}
                </h3>
                <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400'>
                  <div className='flex items-center gap-1.5'>
                    <User className='h-3.5 w-3.5' />
                    {userNameMap[report.user_id] || 'Unknown User'}
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
                  <span className='truncate'>{projectNameMap[report.project_id] || 'Unknown Project'}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 dark:border-zinc-800'>
            <BarChart3 className='mb-4 h-10 w-10 text-zinc-300 dark:text-zinc-700' />
            <p className='text-zinc-500 dark:text-zinc-400'>No monthly reports found.</p>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-800'>
            <h2 className='text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4'>Generate Monthly Report</h2>
            <form action={generateAction} className='space-y-4'>
              <div>
                <label htmlFor='gen_project_id' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>Project</label>
                <Combobox
                  id='gen_project_id'
                  name='project_id'
                  required
                  options={projects.map(p => ({ id: p.id, label: p.name }))}
                  placeholder="Select a project..."
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='gen_year' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>Year</label>
                  <Combobox
                    id='gen_year'
                    name='year'
                    required
                    defaultValue={currentYear}
                    options={years.map(y => ({ id: y, label: y.toString() }))}
                  />
                </div>
                <div>
                  <label htmlFor='gen_month' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>Month</label>
                  <Combobox
                    id='gen_month'
                    name='month'
                    required
                    defaultValue={new Date().getMonth() + 1}
                    options={months.map(m => ({ id: m.value, label: m.label }))}
                  />
                </div>
              </div>
              <div className='flex gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowGenerateModal(false)}
                  className='flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isGenerating}
                  className='flex-1 flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                >
                  {isGenerating && <Loader2 className='h-4 w-4 animate-spin' />}
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-800'>
            <h2 className='text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4'>Submit Monthly Report</h2>
            <form action={submitAction} className='space-y-4'>
              <div>
                <label htmlFor='sub_project_id' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>Project</label>
                <Combobox
                  id='sub_project_id'
                  name='project_id'
                  required
                  options={projects.map(p => ({ id: p.id, label: p.name }))}
                  placeholder="Select a project..."
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='sub_year' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>Year</label>
                  <Combobox
                    id='sub_year'
                    name='year'
                    required
                    defaultValue={currentYear}
                    options={years.map(y => ({ id: y, label: y.toString() }))}
                  />
                </div>
                <div>
                  <label htmlFor='sub_month' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1'>Month</label>
                  <Combobox
                    id='sub_month'
                    name='month'
                    required
                    defaultValue={new Date().getMonth() + 1}
                    options={months.map(m => ({ id: m.value, label: m.label }))}
                  />
                </div>
              </div>
              <div className='flex gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowSubmitModal(false)}
                  className='flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex-1 flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                >
                  {isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
