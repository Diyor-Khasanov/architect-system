import { getAuthHeaderFromCookies } from './auth'

export interface Report {
  id: number
  task_id: number
  user_id: number
  content: string
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
