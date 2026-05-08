'use server'

import { uploadFile, deleteFile, fetchFileSignedUrl, type FileResponse } from '../lib/files'

export type UploadFileState = {
  success?: boolean
  data?: FileResponse
  error?: string
}

export async function uploadFileAction(prevState: UploadFileState | null, formData: FormData) {
  try {
    const result = await uploadFile(formData)
    return { success: true, data: result }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during file upload'
    return { error: errorMessage }
  }
}

export type GetSignedUrlState = {
  success?: boolean
  url?: string
  error?: string
}

export async function getFileSignedUrlAction(prevState: GetSignedUrlState | null, formData: FormData) {
  const id = formData.get('file_id') as string
  if (!id) return { error: 'File ID is required' }

  try {
    const result = await fetchFileSignedUrl(id)
    return { success: true, url: result.url }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while fetching signed URL'
    return { error: errorMessage }
  }
}

export type DeleteFileState = {
  success?: boolean
  error?: string
}

export async function deleteFileAction(prevState: DeleteFileState | null, formData: FormData) {
  const id = formData.get('file_id') as string
  if (!id) return { error: 'File ID is required' }

  try {
    await deleteFile(id)
    return { success: true }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during file deletion'
    return { error: errorMessage }
  }
}
