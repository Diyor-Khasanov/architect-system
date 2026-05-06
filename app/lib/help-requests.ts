import { getAuthHeaderFromCookies } from './auth'

export interface HelpRequest {
  id: number
  title: string
  description: string
  status: string
  priority: string
  user_id: number
  created_at: string
  updated_at: string
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

function normalizeHelpRequestsResponse(payload: unknown): HelpRequest[] {
  if (Array.isArray(payload)) {
    return payload as HelpRequest[]
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { items?: unknown; data?: unknown; results?: unknown; help_requests?: unknown }

    if (Array.isArray(candidate.items)) return candidate.items as HelpRequest[]
    if (Array.isArray(candidate.data)) return candidate.data as HelpRequest[]
    if (Array.isArray(candidate.results)) return candidate.results as HelpRequest[]
    if (Array.isArray(candidate.help_requests)) return candidate.help_requests as HelpRequest[]
  }

  return []
}

export async function fetchHelpRequests() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/help-requests/`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch help requests')
  }

  const payload = (await response.json()) as unknown
  return normalizeHelpRequestsResponse(payload)
}
