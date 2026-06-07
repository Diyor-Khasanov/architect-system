const DEFAULT_API_BASE_URL = 'http://13.50.4.92/api/v1'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export const API_BASE_URL = trimTrailingSlash(
  process.env.ARCHITECT_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
)

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
