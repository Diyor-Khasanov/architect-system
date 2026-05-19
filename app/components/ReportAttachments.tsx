'use client'

import { useActionState, useState, useEffect } from 'react'
import { FileResponse } from '../lib/files'
import { useToast } from '../context/ToastContext'
import { Paperclip, Download, Trash2, Loader2, FileText } from 'lucide-react'
import { uploadReportFileAction, deleteReportFileAction, type UploadFileState, type DeleteFileState } from '../actions/files'

interface ReportAttachmentsProps {
  reportId: number
  initialFiles: FileResponse[]
  canEdit: boolean
  revalidatePath: string
}

export default function ReportAttachments({
  reportId,
  initialFiles,
  canEdit,
  revalidatePath
}: ReportAttachmentsProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const [uploadState, uploadAction, isUploadingAction] = useActionState(
    async (prevState: UploadFileState | null, formData: FormData) => {
      formData.set('report_id', reportId.toString())
      formData.set('revalidate_path', revalidatePath)
      return uploadReportFileAction(prevState, formData)
    },
    null
  )

  const [deleteState, deleteAction, isDeleting] = useActionState(
    async (prevState: DeleteFileState | null, formData: FormData) => {
      formData.set('revalidate_path', revalidatePath)
      return deleteReportFileAction(prevState, formData)
    },
    null
  )

  useEffect(() => {
    if (uploadState?.success) {
      toast('File uploaded successfully', 'success')
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <form action={uploadAction} className='mb-6'>
          <div className='flex items-center gap-2'>
            <input
              type='file'
              name='file'
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

      {initialFiles.length > 0 ? (
        <div className='grid gap-3 sm:grid-cols-2'>
          {initialFiles.map((file) => (
            <div
              key={file.id}
              className='flex items-center justify-between rounded-xl border border-zinc-100 p-3 dark:border-zinc-800 group'
            >
              <div className='flex items-center gap-3 overflow-hidden'>
                <div className='rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800'>
                  <FileText className='h-4 w-4 text-zinc-400' />
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
  )
}
