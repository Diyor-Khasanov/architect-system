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

function normalizeProject(payload: unknown): Project {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid project payload')
  }

  const data = payload as Record<string, unknown>

  return {
    ...data,
    id: data.id as number,
    name: data.name as string,
    description: data.description as string,
    manager_id: (data.manager_id ?? data.managerId) as number,
    status: (data.status as string) || 'draft',
    deadline: data.deadline as string,
    created_at: (data.created_at ?? data.createdAt) as string,
  } as Project
}

function normalizeProjectsResponse(payload: unknown): Project[] {
  let items: unknown[] = []

  if (Array.isArray(payload)) {
    items = payload
  } else if (payload && typeof payload === 'object') {
    const candidate = payload as {
      items?: unknown[]
      data?: unknown[]
      results?: unknown[]
      projects?: unknown[]
      project?: unknown[]
    }

    if (Array.isArray(candidate.items)) items = candidate.items
    else if (Array.isArray(candidate.data)) items = candidate.data
    else if (Array.isArray(candidate.results)) items = candidate.results
    else if (Array.isArray(candidate.projects)) items = candidate.projects
    else if (Array.isArray(candidate.project)) items = candidate.project
  }

  return items.map((item) => {
    try {
      return normalizeProject(item)
    } catch {
      return item as Project
    }
  })
}

export async function fetchProjects() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/`, {
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

  let projectData = payload
  if (payload && typeof payload === 'object' && payload !== null && !('id' in payload)) {
    const candidate = payload as { data?: unknown; item?: unknown; project?: unknown }
    projectData = candidate.data || candidate.item || candidate.project || payload
  }

  return normalizeProject(projectData)
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

export async function acceptProject(id: string | number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}/accept`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to accept project')
  }

  return (await response.json()) as Project
}

export async function fetchProjectMembers(id: string | number): Promise<ProjectMember[]> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}/members`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch project members')
  }

  const payload = await response.json()

  if (Array.isArray(payload)) {
    return payload as ProjectMember[]
  }

  if (payload && typeof payload === 'object' && payload !== null) {
    const candidate = payload as { items?: ProjectMember[]; data?: ProjectMember[]; results?: ProjectMember[]; members?: ProjectMember[] }
    const data = candidate.items || candidate.data || candidate.results || candidate.members
    if (Array.isArray(data)) {
      return data
    }
  }

  return []
}

export async function addProjectMember(projectId: string | number, userId: number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to add project member')
  }

  return (await response.json())
}

export async function removeProjectMember(projectId: string | number, userId: number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to remove project member')
  }

  return true
}

export async function assignProjectManager(id: string | number, managerId: number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}/assign-manager`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ manager_id: managerId }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to assign manager')
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

export async function fetchProjectProgress(id: string | number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}/progress`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch project progress')
  }

  const payload = await response.json()
  // Adjust based on expected backend response structure
  if (typeof payload === 'number') return payload
  if (payload && typeof payload === 'object' && 'progress' in payload) {
    return payload.progress as number
  }
  return 0
}

export async function updateProjectStatus(id: string | number, status: string) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to update project status')
  }

  return (await response.json()) as Project
}
