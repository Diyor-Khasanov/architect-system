'use client'

import { useActionState, useState, useEffect } from 'react'
import { Report } from '../../lib/reports'
import { FileResponse } from '../../lib/files'
import { submitReportAction, uploadReportAttachmentAction } from '../../actions/reports'
import { useToast } from '../../context/ToastContext'
import { FileText, Upload, Download, Loader2, Paperclip, Trash2 } from 'lucide-react'
import { deleteFileAction } from '../../actions/files'

interface TaskReportClientProps {
  taskId: number
  report: Report | null
  files: FileResponse[]
  canEdit: boolean
}

export default function TaskReportClient({ taskId, report, files, canEdit }: TaskReportClientProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [submitState, submitAction, isSubmitting] = useActionState(
    submitReportAction.bind(null, taskId),
    null
  )

  const [uploadState, uploadAction, isUploadingAction] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      if (!report) return { error: 'Report required' }
      return uploadReportAttachmentAction(report.id, prevState, formData)
    },
    null
  )

  const [deleteState, deleteAction, isDeleting] = useActionState(deleteFileAction, null)

  useEffect(() => {
    if (submitState?.success) {
      toast('Report submitted successfully', 'success')
      setIsEditing(false)
    } else if (submitState?.error) {
      toast(submitState.error, 'error')
    }
  }, [submitState, toast])

  useEffect(() => {
    if (uploadState?.success) {
      toast('File uploaded successfully', 'success')
      setIsUploading(false)
    } else if (uploadState?.error) {
      toast(uploadState.error, 'error')
    }
  }, [uploadState, toast])

  useEffect(() => {
    if (deleteState?.success) {
      toast('File deleted successfully', 'success')
    } else if (deleteState?.error) {
      toast(deleteState.error, 'error')
    }
  }, [deleteState, toast])

  const handleDownload = async (fileId: number, filename: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        toast('Failed to download file', 'error')
      }
    } catch {
      toast('An error occurred during download', 'error')
    }
  }

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
            <div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2'>
                  <Paperclip className='h-4 w-4 text-zinc-500' />
                  Attachments
                </h3>
                {canEdit && (
                  <button
                    onClick={() => setIsUploading(!isUploading)}
                    className='text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  >
                    {isUploading ? 'Cancel' : 'Add Attachment'}
                  </button>
                )}
              </div>

              {isUploading && (
                <form action={async (formData) => {
                  await uploadAction(formData)
                  setIsUploading(false)
                }} className='mb-6'>
                  <div className='flex items-center gap-2'>
                    <input
                      type='file'
                      name='files'
                      required
                      className='block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-300'
                    />
                    <button
                      type='submit'
                      disabled={isUploadingAction}
                      className='rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'
                    >
                      {isUploadingAction ? <Loader2 className='h-3 w-3 animate-spin' /> : 'Upload'}
                    </button>
                  </div>
                </form>
              )}

              {files.length > 0 ? (
                <div className='grid gap-3 sm:grid-cols-2'>
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className='flex items-center justify-between rounded-xl border border-zinc-100 p-3 dark:border-zinc-800 group'
                    >
                      <div className='flex items-center gap-3 overflow-hidden'>
                        <div className='rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800'>
                          <Paperclip className='h-4 w-4 text-zinc-400' />
                        </div>
                        <div className='overflow-hidden'>
                          <p className='text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate' title={file.filename}>
                            {file.filename}
                          </p>
                          <p className='text-[10px] text-zinc-500 dark:text-zinc-400'>
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <button
                          onClick={() => handleDownload(file.id, file.filename)}
                          className='p-1.5 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400'
                          title='Download'
                        >
                          <Download className='h-4 w-4' />
                        </button>
                        {canEdit && (
                          <form action={deleteAction}>
                            <input type='hidden' name='file_id' value={file.id} />
                            <button
                              type='submit'
                              disabled={isDeleting}
                              className='p-1.5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400'
                              title='Delete'
                            >
                              <Trash2 className='h-4 w-4' />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-xs text-zinc-500 dark:text-zinc-400 italic'>
                  No attachments yet.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
