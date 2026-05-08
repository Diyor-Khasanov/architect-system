'use client'

import { useActionState, useState, useEffect } from 'react'
import { uploadFileAction, deleteFileAction, getFileSignedUrlAction } from '../actions/files'
import { useToast } from '../context/ToastContext'
import { Upload, FileText, Download, Loader2, Search, FileDown, Trash2, LinkIcon, Copy, Check } from 'lucide-react'

export default function FilesClient() {
  const { toast } = useToast()
  const [uploadState, uploadAction, isUploading] = useActionState(uploadFileAction, null)
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteFileAction, null)
  const [signedUrlState, signedUrlAction, isFetchingUrl] = useActionState(getFileSignedUrlAction, null)
  const [fileId, setFileId] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (uploadState?.success) {
      toast(`File uploaded successfully! ID: ${uploadState.data?.id}`, 'success')
    } else if (uploadState?.error) {
      toast(uploadState.error, 'error')
    }
  }, [uploadState, toast])

  useEffect(() => {
    if (deleteState?.success) {
      toast('File deleted successfully!', 'success')
    } else if (deleteState?.error) {
      toast(deleteState.error, 'error')
    }
  }, [deleteState, toast])

  useEffect(() => {
    if (signedUrlState?.success) {
      toast('Signed URL generated successfully!', 'success')
    } else if (signedUrlState?.error) {
      toast(signedUrlState.error, 'error')
    }
  }, [signedUrlState, toast])

  const handleCopyUrl = () => {
    if (signedUrlState?.url) {
      navigator.clipboard.writeText(signedUrlState.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast('URL copied to clipboard!', 'success')
    }
  }

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileId) return

    setIsDownloading(true)
    try {
      // In a real application, we might want to fetch the file via an API route
      // that handles the auth header and returns the stream/blob
      // For this demo/task, we'll direct the user to the API endpoint
      // but since it requires Auth, we'd normally need a proxy or a signed URL.
      // Given the constraints, we'll simulate the download or explain how it works.

      const response = await fetch(`/api/files/${fileId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `file-${fileId}` // We don't know the filename here without another metadata call
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast('Download started', 'success')
      } else {
        toast('Failed to download file. Please check the ID.', 'error')
      }
    } catch {
      toast('An error occurred during download', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className='space-y-8'>
      <header>
        <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>File Management</h1>
        <p className='mt-2 text-zinc-600 dark:text-zinc-400'>Upload and retrieve files within the system.</p>
      </header>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Upload Section */}
        <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <h2 className='mb-6 flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100'>
            <Upload className='h-5 w-5 text-blue-500' />
            Upload File
          </h2>

          <form action={uploadAction} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='report_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                Report ID (required)
              </label>
              <input
                type='number'
                id='report_id'
                name='report_id'
                defaultValue='0'
                required
                className='block w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='files' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                Choose File
              </label>
              <div className='flex items-center justify-center w-full'>
                <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors'>
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <FileText className='w-8 h-8 mb-3 text-zinc-400' />
                    <p className='mb-2 text-sm text-zinc-500 dark:text-zinc-400'>
                      <span className='font-semibold'>Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input id='files' name='files' type='file' className='hidden' required />
                </label>
              </div>
            </div>

            <button
              type='submit'
              disabled={isUploading}
              className='flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              {isUploading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className='h-4 w-4' />
                  Upload
                </>
              )}
            </button>
          </form>
        </section>

        {/* Retrieve Section */}
        <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <h2 className='mb-6 flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100'>
            <Search className='h-5 w-5 text-emerald-500' />
            Retrieve File
          </h2>

          <div className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='file_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                  File ID
                </label>
                <input
                  type='text'
                  id='file_id'
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  placeholder='Enter file ID...'
                  className='block w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
                />
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || !fileId}
                  className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                >
                  {isDownloading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Download className='h-4 w-4' />}
                  Download
                </button>
                <form action={signedUrlAction} className='flex-1'>
                  <input type='hidden' name='file_id' value={fileId} />
                  <button
                    type='submit'
                    disabled={isFetchingUrl || !fileId}
                    className='flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
                  >
                    {isFetchingUrl ? <Loader2 className='h-4 w-4 animate-spin' /> : <LinkIcon className='h-4 w-4' />}
                    Signed URL
                  </button>
                </form>
              </div>
            </div>

            {signedUrlState?.success && signedUrlState.url && (
              <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-300'>
                <label className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                  Signed URL (valid for limited time)
                </label>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    readOnly
                    value={signedUrlState.url}
                    className='block flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400'
                  />
                  <button
                    onClick={handleCopyUrl}
                    className='flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
                    title='Copy to clipboard'
                  >
                    {copied ? <Check className='h-4 w-4 text-emerald-500' /> : <Copy className='h-4 w-4' />}
                  </button>
                </div>
              </div>
            )}

            <div className='rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50'>
              <div className='flex items-start gap-3'>
                <FileDown className='mt-1 h-5 w-5 text-zinc-400' />
                <div>
                  <h4 className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>Note on Downloads</h4>
                  <p className='mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400'>
                    Files are retrieved directly from the secure backend. You must have appropriate permissions to access the requested file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Section */}
      <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 mt-8'>
        <h2 className='mb-6 flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100'>
          <Trash2 className='h-5 w-5 text-red-500' />
          Delete File
        </h2>

        <div className='space-y-6'>
          <form action={deleteAction} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='delete_file_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                File ID
              </label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  id='delete_file_id'
                  name='file_id'
                  placeholder='Enter file ID to delete...'
                  required
                  className='block flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
                />
                <button
                  type='submit'
                  disabled={isDeleting}
                  className='flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50'
                >
                  {isDeleting ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {uploadState?.success && uploadState.data && (
        <section className='rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 dark:border-emerald-900/30 dark:bg-emerald-950/10 mt-8'>
          <h3 className='text-lg font-semibold text-emerald-900 dark:text-emerald-100'>Last Upload Success</h3>
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='space-y-1'>
              <p className='text-xs font-medium uppercase tracking-wider text-emerald-600/70'>File ID</p>
              <p className='text-sm font-bold text-emerald-900 dark:text-emerald-100'>#{uploadState.data.id}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs font-medium uppercase tracking-wider text-emerald-600/70'>Filename</p>
              <p className='text-sm font-medium text-emerald-900 dark:text-emerald-100 truncate' title={uploadState.data.filename}>
                {uploadState.data.filename}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs font-medium uppercase tracking-wider text-emerald-600/70'>Size</p>
              <p className='text-sm font-medium text-emerald-900 dark:text-emerald-100'>
                {(uploadState.data.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs font-medium uppercase tracking-wider text-emerald-600/70'>Report ID</p>
              <p className='text-sm font-medium text-emerald-900 dark:text-emerald-100'>{uploadState.data.report_id}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
