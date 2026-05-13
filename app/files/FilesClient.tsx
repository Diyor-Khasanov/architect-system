'use client'

import { useActionState, useState, useEffect } from 'react'
import { uploadFileAction, getFileSignedUrlAction, deleteFileAction } from '../actions/files'
import { useToast } from '../context/ToastContext'
import {
  Download,
  FileUp,
  Search,
  Loader2,
  FileText,
  FileDown,
  Link,
  Trash2
} from 'lucide-react'

export default function FilesClient() {
  const { toast } = useToast()
  const [downloadId, setDownloadId] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const [uploadState, uploadAction, isUploading] = useActionState(uploadFileAction, null)
  const [signedUrlState, signedUrlAction, isGettingUrl] = useActionState(getFileSignedUrlAction, null)
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteFileAction, null)

  useEffect(() => {
    if (uploadState?.success) {
      toast('File uploaded successfully', 'success')
    } else if (uploadState?.error) {
      toast(uploadState.error, 'error')
    }
  }, [uploadState, toast])

  useEffect(() => {
    if (signedUrlState?.success && signedUrlState.url) {
      window.open(signedUrlState.url, '_blank')
      toast('Signed URL opened in new tab', 'success')
    } else if (signedUrlState?.error) {
      toast(signedUrlState.error, 'error')
    }
  }, [signedUrlState, toast])

  useEffect(() => {
    if (deleteState?.success) {
      toast('File deleted successfully', 'success')
    } else if (deleteState?.error) {
      toast(deleteState.error, 'error')
    }
  }, [deleteState, toast])

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!downloadId) return

    setIsDownloading(true)
    try {
      const response = await fetch(`/api/files/${downloadId}`)
      if (response.ok) {
        const blob = await response.blob()

        // Try to get filename from content-disposition
        const disposition = response.headers.get('Content-Disposition')
        let filename = `file-${downloadId}`
        if (disposition && disposition.includes('filename=')) {
          filename = disposition.split('filename=')[1].split(';')[0].replace(/["']/g, '')
        }

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast('Download started', 'success')
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast(errorData.error || 'Failed to download file. It might not exist or you might not have access.', 'error')
      }
    } catch {
      toast('An error occurred during download', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.files = e.dataTransfer.files
        // Trigger change event manually if needed
        const event = new Event('change', { bubbles: true })
        fileInput.dispatchEvent(event)
      }
    }
  }

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>File Management</h1>
        <p className='mt-2 text-zinc-500 dark:text-zinc-400'>Upload and retrieve files within the system.</p>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Upload Card */}
        <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20'>
              <FileUp className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <h2 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100'>Upload File</h2>
          </div>

          <form action={uploadAction} className='space-y-6'>
            <div className='space-y-2'>
              <label htmlFor='report_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                Report ID (required)
              </label>
              <input
                id='report_id'
                name='report_id'
                type='number'
                required
                min='1'
                placeholder='0'
                className='w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>Choose File</label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input
                  id='file-upload'
                  name='file'
                  type='file'
                  required
                  className='absolute inset-0 cursor-pointer opacity-0'
                />
                <FileText className='mb-3 h-10 w-10 text-zinc-400' />
                <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                  Click to upload <span className='font-normal text-zinc-500'>or drag and drop</span>
                </p>
              </div>
            </div>

            <button
              type='submit'
              disabled={isUploading}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              {isUploading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <FileUp className='h-4 w-4' />
              )}
              Upload
            </button>
          </form>
        </div>

        {/* Retrieve Card */}
        <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20'>
              <Search className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <h2 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100'>Retrieve File</h2>
          </div>

          <div className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='file_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                  File ID
                </label>
                <input
                  id='file_id'
                  type='number'
                  min='1'
                  value={downloadId}
                  onChange={(e) => setDownloadId(e.target.value)}
                  placeholder='Enter file ID...'
                  className='w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100'
                />
              </div>

              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={handleDownload}
                  disabled={isDownloading || !downloadId}
                  className='flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-500 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-600 disabled:opacity-50'
                >
                  {isDownloading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Download className='h-4 w-4' />
                  )}
                  Download
                </button>
                <form action={signedUrlAction} className='flex-1'>
                  <input type='hidden' name='file_id' value={downloadId} />
                  <button
                    type='submit'
                    disabled={isGettingUrl || !downloadId}
                    className='w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  >
                    {isGettingUrl ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Link className='h-4 w-4' />
                    )}
                    Signed URL
                  </button>
                </form>
              </div>
            </div>

            <div className='rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950'>
              <div className='flex gap-3'>
                <FileDown className='mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400' />
                <div className='space-y-1'>
                  <p className='text-sm font-semibold text-zinc-900 dark:text-zinc-100'>Note on Downloads</p>
                  <p className='text-xs leading-relaxed text-zinc-500 dark:text-zinc-400'>
                    Files are retrieved directly from the secure backend. You must have appropriate permissions to access the requested file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Card */}
      <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='rounded-lg bg-red-50 p-2 dark:bg-red-900/20'>
            <Trash2 className='h-5 w-5 text-red-600 dark:text-red-400' />
          </div>
          <h2 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100'>Delete File</h2>
        </div>

        <form action={deleteAction} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='delete_file_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
              File ID
            </label>
            <div className='flex gap-3'>
              <input
                id='delete_file_id'
                name='file_id'
                type='number'
                min='1'
                required
                placeholder='Enter file ID to delete...'
                className='flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100'
              />
              <button
                type='submit'
                disabled={isDeleting}
                className='flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50'
              >
                {isDeleting ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Trash2 className='h-4 w-4' />
                )}
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
