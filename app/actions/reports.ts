'use server'

import { revalidatePath } from 'next/cache'
import { createReport, updateReport, fetchTaskReport, createDailyReport, updateDailyReport, generateMonthlyReport, submitMonthlyReport } from '../lib/reports'
import { uploadFile } from '../lib/files'
import { fetchCurrentUser } from '../lib/auth'

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

export async function createDailyReportAction(prevState: unknown, formData: FormData) {
  const currentUser = await fetchCurrentUser()
  if (!currentUser || currentUser.role !== 'worker') {
    return { error: 'Only workers can create daily reports.' }
  }

  const projectId = parseInt(formData.get('project_id') as string)
  const taskId = parseInt(formData.get('task_id') as string)
  const text = formData.get('text') as string

  if (isNaN(projectId) || isNaN(taskId) || !text) {
    return { error: 'Project, task, and report content are required.' }
  }

  try {
    const report = await createDailyReport({
      project_id: projectId,
      task_id: taskId,
      text,
    })
    revalidatePath('/daily-reports')
    return { success: true, reportId: report.id }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Failed to create daily report.' }
  }
}

export async function updateDailyReportAction(id: number, prevState: unknown, formData: FormData) {
  const currentUser = await fetchCurrentUser()
  if (!currentUser || currentUser.role !== 'worker') {
    return { error: 'Only workers can update daily reports.' }
  }

  const text = formData.get('text') as string

  if (!text) {
    return { error: 'Report content is required.' }
  }

  try {
    await updateDailyReport(id, text)
    revalidatePath('/daily-reports')
    revalidatePath(`/daily-reports/${id}`)
    return { success: true }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Failed to update daily report.' }
  }
}

export async function generateMonthlyReportAction(prevState: unknown, formData: FormData) {
  const currentUser = await fetchCurrentUser()
  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Only admins can generate monthly reports.' }
  }

  const projectId = parseInt(formData.get('project_id') as string)
  const year = parseInt(formData.get('year') as string)
  const month = parseInt(formData.get('month') as string)

  if (isNaN(projectId) || isNaN(year) || isNaN(month)) {
    return { error: 'Project, year, and month are required.' }
  }

  try {
    const report = await generateMonthlyReport({
      project_id: projectId,
      year,
      month,
    })
    revalidatePath('/monthly-reports')
    return { success: true, reportId: report.id }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Failed to generate monthly report.' }
  }
}

export async function submitMonthlyReportAction(prevState: unknown, formData: FormData) {
  const currentUser = await fetchCurrentUser()
  if (!currentUser || currentUser.role !== 'worker') {
    return { error: 'Only workers can submit monthly reports.' }
  }

  const projectId = parseInt(formData.get('project_id') as string)
  const year = parseInt(formData.get('year') as string)
  const month = parseInt(formData.get('month') as string)

  if (isNaN(projectId) || isNaN(year) || isNaN(month)) {
    return { error: 'Project, year, and month are required.' }
  }

  try {
    const report = await submitMonthlyReport({
      project_id: projectId,
      year,
      month,
    })
    revalidatePath('/monthly-reports')
    return { success: true, reportId: report.id }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Failed to submit monthly report.' }
  }
}
