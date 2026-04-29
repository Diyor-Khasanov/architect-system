'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchCurrentUser } from '../lib/auth'
import { createProject, updateProject, deleteProject, updateProjectStatus } from '../lib/projects'

interface ActionState {
  success?: boolean
  error?: string
}

export async function createProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const currentUser = await fetchCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Only administrators can create projects.' }
  }

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  let deadline = String(formData.get('deadline') ?? '').trim()
  const managerId = Number(formData.get('manager_id'))

  if (!name || !description || !deadline || !managerId) {
    return { error: 'All fields are required.' }
  }

  try {
    // Ensure deadline is in ISO format if it's just a date string
    if (deadline && !deadline.includes('T')) {
      deadline = new Date(deadline).toISOString()
    }

    await createProject({
      name,
      description,
      deadline,
      manager_id: managerId,
    })

    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Could not create project. Please try again.' }
  }
}

export async function updateProjectAction(
  id: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const currentUser = await fetchCurrentUser()

  if (!currentUser || !['admin', 'manager'].includes(currentUser.role)) {
    return { error: 'Unauthorized to update projects.' }
  }

  const payload: Record<string, string | number> = {}

  if (formData.has('name')) payload.name = String(formData.get('name'))
  if (formData.has('description')) payload.description = String(formData.get('description'))
  if (formData.has('deadline')) {
    let deadline = String(formData.get('deadline'))
    if (deadline && !deadline.includes('T')) {
      deadline = new Date(deadline).toISOString()
    }
    payload.deadline = deadline
  }
  if (formData.has('manager_id')) payload.manager_id = Number(formData.get('manager_id'))
  if (formData.has('status')) payload.status = String(formData.get('status'))

  try {
    if (Object.keys(payload).length === 1 && payload.status) {
      await updateProjectStatus(id, String(payload.status))
    } else {
      await updateProject(id, payload)
    }
    revalidatePath(`/projects/${id}`)
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Could not update project.' }
  }
}

export async function deleteProjectAction(id: string): Promise<ActionState> {
  const currentUser = await fetchCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Only administrators can delete projects.' }
  }

  try {
    await deleteProject(id)
    revalidatePath('/projects')
  } catch {
    return { error: 'Could not delete project.' }
  }

  redirect('/projects')
}
