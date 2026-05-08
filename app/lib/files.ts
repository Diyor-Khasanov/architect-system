import { getAuthHeaderFromCookies } from './auth'

export interface FileResponse {
  id: number
  filename: string
  content_type: string
  size: number
  report_id: number
  uploader_id: number
  created_at: string
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

export async function uploadFile(formData: FormData) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
    },
    body: formData,
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    let errorMessage = 'Failed to upload file'

    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((err: { loc: string[]; msg: string }) => `${err.loc.join('.')}: ${err.msg}`)
          .join(', ')
      } else {
        errorMessage = errorData.detail
      }
    }

    throw new Error(errorMessage)
  }

  return (await response.json()) as FileResponse
}

export async function fetchFile(id: number | string) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(errorData.detail || 'Failed to fetch file')
    // @ts-ignore
    error.status = response.status
    throw error
  }

  // If the response is a file, we might want to return it as a blob or just provide the URL for some components.
  // But since we need the Auth header, we can't just use the URL in an <a> tag directly if it's protected.
  // For simplicity in the library, we can return the response or the blob.
  return response
}

export function getFileDownloadUrl(id: number | string) {
    return `${API_BASE_URL}/files/${id}`
}
