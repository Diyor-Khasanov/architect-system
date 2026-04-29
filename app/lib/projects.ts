import { getAuthHeaderFromCookies } from './auth'

export interface ProjectMember {
  user_id: number
  full_name: string
  role: string
}

export interface Project {
  id: number
  name: string
  description: string
  manager_id: number
  status: 'draft' | 'active' | 'completed' | string
  deadline: string
  created_at: string
  members?: ProjectMember[]
  progress?: number
}

interface CreateProjectPayload {
  name: string
  description: string
  deadline: string
  manager_id: number
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

function normalizeProjectsResponse(payload: unknown): Project[] {
  if (Array.isArray(payload)) {
    return payload as Project[]
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { items?: unknown; data?: unknown; results?: unknown }

    if (Array.isArray(candidate.items)) return candidate.items as Project[]
    if (Array.isArray(candidate.data)) return candidate.data as Project[]
    if (Array.isArray(candidate.results)) return candidate.results as Project[]
  }

  return []
}

export async function fetchProjects() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  const payload = (await response.json()) as unknown
  return normalizeProjectsResponse(payload)
}

export async function fetchProject(id: string) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch project')
  }

  const payload = (await response.json()) as unknown

  if (payload && typeof payload === 'object' && payload !== null && !('id' in payload)) {
    const candidate = payload as { data?: Project; item?: Project; project?: Project }
    if (candidate.data) return candidate.data
    if (candidate.item) return candidate.item
    if (candidate.project) return candidate.project
  }

  return payload as Project
}

export async function createProject(payload: CreateProjectPayload) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to create project')
  }

  return (await response.json()) as Project
}

export async function updateProject(id: string | number, payload: Partial<CreateProjectPayload> & { status?: string }) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to update project')
  }

  return (await response.json()) as Project
}

export async function deleteProject(id: string | number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to delete project')
  }

  return true
}
