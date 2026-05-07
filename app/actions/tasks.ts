'use server'

import { revalidatePath } from 'next/cache'
import { createTask, updateTask, updateTaskStatus, assignTaskWorker, unassignTaskWorker, type TaskStatus } from '../lib/tasks'

export async function createTaskAction(projectId: string | number, prevState: unknown, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const deadline = formData.get('deadline') as string

  if (!title || !description || !deadline) {
    return { error: 'All fields are required.' }
  }

  try {
    await createTask(projectId, { title, description, deadline })
    revalidatePath(`/projects/${projectId}`)
    revalidatePath('/tasks')
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to create task.' }
  }
}

export async function updateTaskStatusAction(taskId: string | number, status: TaskStatus) {
  try {
    const updatedTask = await updateTaskStatus(taskId, status)
    revalidatePath(`/tasks/${taskId}`)
    revalidatePath('/tasks')
    revalidatePath(`/projects/${updatedTask.project_id}`)
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to update task status.' }
  }
}

export async function updateTaskAction(taskId: string | number, prevState: unknown, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const deadline = formData.get('deadline') as string

  if (!title || !description || !deadline) {
    return { error: 'All fields are required.' }
  }

  try {
    const updatedTask = await updateTask(taskId, { title, description, deadline })
    revalidatePath(`/tasks/${taskId}`)
    revalidatePath('/tasks')
    revalidatePath(`/projects/${updatedTask.project_id}`)
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to update task.' }
  }
}

export async function assignTaskWorkerAction(taskId: string | number, prevState: unknown, formData: FormData) {
  const userId = formData.get('user_id') ? Number(formData.get('user_id')) : null
  const roleOnTask = formData.get('role_on_task') as string

  if (!userId || !roleOnTask) {
    return { error: 'Worker and role are required.' }
  }

  try {
    await assignTaskWorker(taskId, userId, roleOnTask)
    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to assign worker.' }
  }
}

export async function unassignTaskWorkerAction(taskId: string | number, userId: number) {
  try {
    await unassignTaskWorker(taskId, userId)
    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to unassign worker.' }
  }
}
