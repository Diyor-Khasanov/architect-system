import { getAuthHeaderFromCookies } from './auth'

export interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
  deadline: string
  project_id: number
  creator_id: number
  assignee_id?: number
  created_at: string
  updated_at: string
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

function normalizeTasksResponse(payload: unknown): Task[] {
  if (Array.isArray(payload)) {
    return payload as Task[]
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { items?: unknown; data?: unknown; results?: unknown; tasks?: unknown }

    if (Array.isArray(candidate.items)) return candidate.items as Task[]
    if (Array.isArray(candidate.data)) return candidate.data as Task[]
    if (Array.isArray(candidate.results)) return candidate.results as Task[]
    if (Array.isArray(candidate.tasks)) return candidate.tasks as Task[]
  }

  return []
}

function normalizeTaskResponse(payload: unknown): Task {
  if (payload && typeof payload === 'object' && 'id' in payload) {
    return payload as Task
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { data?: Task; item?: Task; task?: Task }
    if (candidate.data) return candidate.data
    if (candidate.item) return candidate.item
    if (candidate.task) return candidate.task
  }

  throw new Error('Invalid task response')
}

export async function fetchTasks() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  const payload = (await response.json()) as unknown
  return normalizeTasksResponse(payload)
}

export async function fetchTask(id: string | number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch task')
  }

  const payload = (await response.json()) as unknown
  return normalizeTaskResponse(payload)
}

export async function createTask(projectId: string | number, payload: { title: string; description: string; deadline: string }) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to create task')
  }

  return (await response.json()) as Task
}
