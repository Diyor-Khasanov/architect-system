'use server'

import { revalidatePath } from 'next/cache'
import { createReport, updateReport, fetchTaskReport } from '../lib/reports'
import { uploadFile } from '../lib/files'

export async function submitReportAction(taskId: number, prevState: unknown, formData: FormData) {
  const content = formData.get('content') as string
  if (!content) {
    return { error: 'Report content is required.' }
  }

  try {
    const existingReport = await fetchTaskReport(taskId)
    if (existingReport) {
      await updateReport(existingReport.id, content)
    } else {
      await createReport(taskId, content)
    }
    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Failed to submit report.' }
  }
}

export async function uploadReportAttachmentAction(reportId: number, prevState: unknown, formData: FormData) {
  // The formData should already contain the file(s) under 'files' key
  // We need to ensure report_id is present for the backend
  formData.set('report_id', reportId.toString())

  try {
    await uploadFile(formData)
    revalidatePath(`/tasks`) // Revalidate broadly if we don't have task ID here, or pass it in
    return { success: true }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Failed to upload attachment.' }
  }
}
