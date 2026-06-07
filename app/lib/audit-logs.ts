import { getAuthHeaderFromCookies } from './auth'
import { API_BASE_URL } from './config'

export interface AuditLog {
  id: number
  user_id: number
  action: string
  resource: string
  resource_id: number | null
  metadata: Record<string, unknown>
  created_at: string
}



export async function fetchAuditLogs() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  const response = await fetch(`${API_BASE_URL}/audit-logs/`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return (data.items || data.results || data.data || data) as AuditLog[]
}

export async function fetchAuditLogById(id: string | number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  const response = await fetch(`${API_BASE_URL}/audit-logs/${id}`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return (data.item || data.data || data) as AuditLog
}
