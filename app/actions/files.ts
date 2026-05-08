'use server'

import { uploadFile, type FileResponse } from '../lib/files'

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
