import { cookies } from 'next/headers'
import { API_BASE_URL, IS_PRODUCTION } from './config'

export type UserRole = 'admin' | 'manager' | 'worker'
export type AuthMode = 'bearer' | 'basic'

export interface UserProfile {
  id: number
  user_id: number
  full_name: string
  phone?: string
  avatar_file_id?: number
}

export interface MeResponse {
  id: number
  username: string
  email: string
  profile?: UserProfile
  managed_projects: unknown[]
  task_assignments: unknown[]
  assigned_tasks: unknown[]
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface AuthSession {
  mode: AuthMode
  value: string
  authorization: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResult {
  session: AuthSession
  user: MeResponse | null
}

interface TokenPayload {
  access_token?: unknown
  token?: unknown
  data?: {
    access_token?: unknown
    token?: unknown
  }
}

interface ApiErrorPayload {
  detail?: unknown
  message?: unknown
  error?: unknown
}

const AUTH_MODE_COOKIE = 'auth_mode'
const AUTH_VALUE_COOKIE = 'auth_value'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const AUTH_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: IS_PRODUCTION,
  maxAge: SESSION_MAX_AGE_SECONDS,
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'admin' || value === 'manager' || value === 'worker'
}

function toStringOrFallback(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function toNumberOrFallback(value: unknown, fallback = 0) {
  return typeof value === 'number' ? value : fallback
}

function normalizeProfile(value: unknown): UserProfile | undefined {
  if (!value || typeof value !== 'object') return undefined

  const profile = value as Record<string, unknown>

  return {
    id: toNumberOrFallback(profile.id),
    user_id: toNumberOrFallback(profile.user_id ?? profile.userId),
    full_name: toStringOrFallback(profile.full_name ?? profile.fullName),
    phone: typeof profile.phone === 'string' ? profile.phone : undefined,
    avatar_file_id:
      typeof profile.avatar_file_id === 'number'
        ? profile.avatar_file_id
        : typeof profile.avatarFileId === 'number'
          ? profile.avatarFileId
          : undefined,
  }
}

export function normalizeCurrentUser(payload: unknown): MeResponse | null {
  if (!payload || typeof payload !== 'object') return null

  const candidate = payload as Record<string, unknown>
  const data = candidate.data && typeof candidate.data === 'object' ? (candidate.data as Record<string, unknown>) : candidate
  const role = data.role

  if (!isUserRole(role)) return null

  return {
    id: toNumberOrFallback(data.id),
    username: toStringOrFallback(data.username),
    email: toStringOrFallback(data.email),
    profile: normalizeProfile(data.profile),
    managed_projects: Array.isArray(data.managed_projects) ? data.managed_projects : [],
    task_assignments: Array.isArray(data.task_assignments) ? data.task_assignments : [],
    assigned_tasks: Array.isArray(data.assigned_tasks) ? data.assigned_tasks : [],
    role,
    is_active: typeof data.is_active === 'boolean' ? data.is_active : true,
    created_at: toStringOrFallback(data.created_at ?? data.createdAt),
  }
}

export function encodeBasicCredential({ username, password }: LoginCredentials) {
  return Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
}

function resolveToken(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null

  const candidate = payload as TokenPayload
  const token = candidate.access_token ?? candidate.token ?? candidate.data?.access_token ?? candidate.data?.token

  return typeof token === 'string' && token.trim().length > 0 ? token : null
}

function createSession(mode: AuthMode, value: string): AuthSession {
  return {
    mode,
    value,
    authorization: mode === 'bearer' ? `Bearer ${value}` : `Basic ${value}`,
  }
}

export async function getApiErrorMessage(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null
  const detail = payload?.detail

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const error = item as { loc?: unknown; msg?: unknown }
        const location = Array.isArray(error.loc) ? error.loc.join('.') : undefined
        const message = typeof error.msg === 'string' ? error.msg : undefined
        return location && message ? `${location}: ${message}` : message
      })
      .filter((message): message is string => Boolean(message))

    if (messages.length > 0) return messages.join(', ')
  }

  if (typeof detail === 'string') return detail
  if (typeof payload?.message === 'string') return payload.message
  if (typeof payload?.error === 'string') return payload.error

  return fallback
}

export async function authenticateWithBackend(credentials: LoginCredentials): Promise<LoginResult> {
  const basicCredential = encodeBasicCredential(credentials)
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicCredential}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const message = await getApiErrorMessage(response, 'Login yoki parol xato. Iltimos, qayta urinib ko‘ring.')
    throw new Error(message)
  }

  const payload = (await response.json().catch(() => null)) as unknown
  const token = resolveToken(payload)
  const session = token ? createSession('bearer', token) : createSession('basic', basicCredential)
  const user = await fetchCurrentUser(session.authorization)

  return { session, user }
}

export async function persistAuthSession(session: AuthSession) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_MODE_COOKIE, session.mode, AUTH_COOKIE_OPTIONS)
  cookieStore.set(AUTH_VALUE_COOKIE, session.value, AUTH_COOKIE_OPTIONS)
}

export async function clearAuthSession() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_MODE_COOKIE)
  cookieStore.delete(AUTH_VALUE_COOKIE)
}

export async function getAuthHeaderFromCookies() {
  const cookieStore = await cookies()
  const authMode = cookieStore.get(AUTH_MODE_COOKIE)?.value
  const authValue = cookieStore.get(AUTH_VALUE_COOKIE)?.value

  if ((authMode !== 'bearer' && authMode !== 'basic') || !authValue) {
    return null
  }

  return createSession(authMode, authValue).authorization
}

export async function fetchCurrentUser(authorizationOverride?: string) {
  const authorization = authorizationOverride ?? (await getAuthHeaderFromCookies())

  if (!authorization) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as unknown
    return normalizeCurrentUser(payload)
  } catch {
    return null
  }
}
