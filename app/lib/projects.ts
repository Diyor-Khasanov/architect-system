import { getAuthHeaderFromCookies } from './auth'

export interface Project {
  id: number
  name: string
  description: string
  manager_id: number
  status: 'draft' | 'active' | 'completed' | string
  deadline: string
  created_at: string
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
