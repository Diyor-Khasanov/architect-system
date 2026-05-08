'use server'

import { uploadFile, deleteFile, type FileResponse } from '../lib/files'

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
