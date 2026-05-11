import { getAuthHeaderFromCookies } from './auth'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELED' | 'BLOCKED'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: string
  deadline: string
  project_id: number
  creator_id: number
  assignee_id?: number
  created_at: string
  updated_at: string
}

export interface TaskAssignment {
  user_id: number
  full_name: string
  role_on_task: string
}

export interface TaskHistoryEntry {
  id: number
  task_id: number
  user_id: number
  action: string
  changes: Record<string, unknown>
  created_at: string
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

function normalizeTasksResponse(payload: unknown): Task[] {
  if (Array.isArray(payload)) {
    return payload as Task[]
  }

  if (typeof payload === 'object' && payload !== null) {
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

export async function fetchManagerTasks() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/manager/tasks`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch manager tasks')
  }

  const payload = (await response.json()) as unknown
  return normalizeTasksResponse(payload)
}

export async function fetchMyTasks() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/my/tasks`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch my tasks')
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

export async function fetchTaskHistory(id: string | number): Promise<TaskHistoryEntry[]> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${id}/history`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch task history')
  }

  const payload = await response.json()

  if (Array.isArray(payload)) {
    return payload as TaskHistoryEntry[]
  }

  if (payload && typeof payload === 'object' && payload !== null) {
    const candidate = payload as { items?: TaskHistoryEntry[]; data?: TaskHistoryEntry[]; results?: TaskHistoryEntry[]; history?: TaskHistoryEntry[] }
    const data = candidate.items || candidate.data || candidate.results || candidate.history
    if (Array.isArray(data)) {
      return data
    }
  }

  return []
}

export async function fetchTaskAssignments(id: string | number): Promise<TaskAssignment[]> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${id}/assignments`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch task assignments')
  }

  const payload = await response.json()

  if (Array.isArray(payload)) {
    return payload as TaskAssignment[]
  }

  if (payload && typeof payload === 'object' && payload !== null) {
    const candidate = payload as { items?: TaskAssignment[]; data?: TaskAssignment[]; results?: TaskAssignment[]; assignments?: TaskAssignment[] }
    const data = candidate.items || candidate.data || candidate.results || candidate.assignments
    if (Array.isArray(data)) {
      return data
    }
  }

  return []
}

export async function assignTaskWorker(taskId: string | number, userId: number, roleOnTask: string) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, role_on_task: roleOnTask }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to assign task worker')
  }

  return await response.json()
}

export async function unassignTaskWorker(taskId: string | number, userId: number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/unassign`, {
    method: 'DELETE',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to unassign task worker')
  }

  return true
}

export async function updateTaskStatus(id: string | number, status: TaskStatus) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to update task status')
  }

  return (await response.json()) as Task
}

export async function updateTask(id: string | number, payload: Partial<{ title: string; description: string; deadline: string; priority: string }>) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to update task')
  }

  return (await response.json()) as Task
}
