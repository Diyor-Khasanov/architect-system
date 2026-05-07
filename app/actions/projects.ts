'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchCurrentUser } from '../lib/auth'
import { createProject, updateProject, deleteProject, updateProjectStatus, assignProjectManager, acceptProject, addProjectMember, removeProjectMember } from '../lib/projects'

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

  if (formData.get('name')) payload.name = String(formData.get('name'))
  if (formData.get('description')) payload.description = String(formData.get('description'))
  if (formData.get('deadline')) {
    let deadline = String(formData.get('deadline'))
    if (deadline && !deadline.includes('T')) {
      deadline = new Date(deadline).toISOString()
    }
    payload.deadline = deadline
  }
  if (formData.get('manager_id')) payload.manager_id = Number(formData.get('manager_id'))
  if (formData.get('status')) payload.status = String(formData.get('status'))

  // Validate status if provided
  const validStatuses = ['draft', 'assigned', 'active', 'completed', 'archived', 'on_hold']
  if (payload.status && !validStatuses.includes(String(payload.status))) {
    // Some existing data might use 'doing' or 'done', we should allow them for compatibility or map them
    if (payload.status === 'doing') payload.status = 'active'
    if (payload.status === 'done') payload.status = 'completed'
  }

  try {
    if (Object.keys(payload).length === 1 && payload.status) {
      await updateProjectStatus(id, String(payload.status))
    } else if (Object.keys(payload).length === 1 && payload.manager_id) {
      await assignProjectManager(id, Number(payload.manager_id))
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

export async function acceptProjectAction(
  id: string
): Promise<ActionState> {
  const currentUser = await fetchCurrentUser()

  if (!currentUser || currentUser.role !== 'manager') {
    return { error: 'Only managers can accept projects.' }
  }

  try {
    await acceptProject(id)
    revalidatePath(`/projects/${id}`)
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Could not accept project.' }
  }
}

export async function assignProjectManagerAction(
  id: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const currentUser = await fetchCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Only administrators can assign managers to projects.' }
  }

  const managerId = Number(formData.get('manager_id'))

  if (!managerId) {
    return { error: 'Manager ID is required.' }
  }

  try {
    await assignProjectManager(id, managerId)
    revalidatePath(`/projects/${id}`)
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Could not assign manager.' }
  }
}

export async function addProjectMemberAction(
  projectId: string,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const currentUser = await fetchCurrentUser()

  if (!currentUser || !['admin', 'manager'].includes(currentUser.role)) {
    return { error: 'Unauthorized to add members to projects.' }
  }

  const userId = Number(formData.get('user_id'))

  if (!userId) {
    return { error: 'User ID is required.' }
  }

  try {
    await addProjectMember(projectId, userId)
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch {
    return { error: 'Could not add member to project.' }
  }
}

export async function removeProjectMemberAction(
  projectId: string,
  userId: number
): Promise<ActionState> {
  const currentUser = await fetchCurrentUser()

  if (!currentUser || !['admin', 'manager'].includes(currentUser.role)) {
    return { error: 'Unauthorized to remove members from projects.' }
  }

  try {
    await removeProjectMember(projectId, userId)
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch {
    return { error: 'Could not remove member from project.' }
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
