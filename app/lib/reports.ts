import { getAuthHeaderFromCookies } from './auth'

export interface Report {
  id: number
  task_id: number
  user_id: number
  content: string
  created_at: string
  updated_at: string
}

export interface DailyReport {
  id: number
  project_id: number
  task_id: number
  user_id: number
  text: string
  created_at: string
  updated_at: string
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

export async function fetchTaskReport(taskId: string | number): Promise<Report | null> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/report`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch task report')
  }

  return (await response.json()) as Report
}

export async function createReport(taskId: string | number, content: string): Promise<Report> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/report`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to create report')
  }

  return (await response.json()) as Report
}

export async function updateReport(reportId: string | number, content: string): Promise<Report> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to update report')
  }

  return (await response.json()) as Report
}

export async function fetchReportFiles(reportId: string | number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/files`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch report files')
  }

  return await response.json()
}

function normalizeDailyReport(payload: unknown): DailyReport {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid daily report payload')
  }
  const data = payload as Record<string, unknown>
  return {
    id: data.id as number,
    project_id: (data.project_id ?? data.projectId) as number,
    task_id: (data.task_id ?? data.taskId) as number,
    user_id: (data.user_id ?? data.userId) as number,
    text: (data.text ?? data.content) as string,
    created_at: (data.created_at ?? data.createdAt) as string,
    updated_at: (data.updated_at ?? data.updatedAt) as string,
  }
}

function normalizeDailyReportsResponse(payload: unknown): DailyReport[] {
  let items: unknown[] = []

  if (Array.isArray(payload)) {
    items = payload
  } else if (payload && typeof payload === 'object') {
    const candidate = payload as {
      items?: unknown
      data?: unknown
      results?: unknown
      reports?: unknown
    }

    if (Array.isArray(candidate.items)) items = candidate.items
    else if (Array.isArray(candidate.data)) items = candidate.data
    else if (Array.isArray(candidate.results)) items = candidate.results
    else if (Array.isArray(candidate.reports)) items = candidate.reports
  }

  return items.map((item) => {
    try {
      return normalizeDailyReport(item)
    } catch {
      return item as DailyReport
    }
  })
}

export async function fetchDailyReports(): Promise<DailyReport[]> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/reports/daily`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch daily reports')
  }

  const payload = await response.json()
  return normalizeDailyReportsResponse(payload)
}

export async function fetchDailyReport(id: string | number): Promise<DailyReport> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/reports/daily/${id}`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch daily report')
  }

  const payload = await response.json()
  return normalizeDailyReport(payload)
}

export async function createDailyReport(payload: {
  project_id: number
  task_id: number
  text: string
}): Promise<DailyReport> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/reports/daily`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to create daily report')
  }

  const data = await response.json()
  return normalizeDailyReport(data)
}

export async function updateDailyReport(id: string | number, text: string): Promise<DailyReport> {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/reports/daily/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to update daily report')
  }

  const data = await response.json()
  return normalizeDailyReport(data)
}
