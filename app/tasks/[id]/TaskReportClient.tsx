'use client'

import { useActionState, useState, useEffect } from 'react'
import { Report } from '../../lib/reports'
import { FileResponse } from '../../lib/files'
import { submitReportAction } from '../../actions/reports'
import { useToast } from '../../context/ToastContext'
import { FileText, Upload, Loader2 } from 'lucide-react'
import ReportAttachments from '../../components/ReportAttachments'

interface TaskReportClientProps {
  taskId: number
  report: Report | null
  files: FileResponse[]
  canEdit: boolean
}

export default function TaskReportClient({ taskId, report, files, canEdit }: TaskReportClientProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const [submitState, submitAction, isSubmitting] = useActionState(
    submitReportAction.bind(null, taskId),
    null
  )

  useEffect(() => {
    if (submitState?.success) {
      toast('Report submitted successfully', 'success')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsEditing(false)
    } else if (submitState?.error) {
      toast(submitState.error, 'error')
    }
  }, [submitState, toast])

  return (
    <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2'>
          <FileText className='h-5 w-5 text-blue-500' />
          Task Report
        </h2>
        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
          >
            {report ? 'Update Report' : 'Create Report'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form action={submitAction} className='space-y-4'>
          <textarea
            name='content'
            defaultValue={report?.content || ''}
            placeholder='Write your task report here...'
            rows={6}
            required
            className='w-full rounded-xl border border-zinc-200 p-4 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
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
              disabled={isSubmitting}
              className='flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              {isSubmitting ? <Loader2 className='h-4 w-4 animate-spin' /> : <Upload className='h-4 w-4' />}
              Submit Report
            </button>
          </div>
        </form>
      ) : (
        <div className='space-y-6'>
          {report ? (
            <div className='prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap'>
              {report.content}
            </div>
          ) : (
            <p className='text-sm italic text-zinc-500 dark:text-zinc-400'>
              No report submitted for this task yet.
            </p>
          )}

          {report && (
            <ReportAttachments
              reportId={report.id}
              initialFiles={files}
              canEdit={canEdit}
              revalidatePath={`/tasks/${taskId}`}
            />
          )}
        </div>
      )}
    </section>
  )
}
