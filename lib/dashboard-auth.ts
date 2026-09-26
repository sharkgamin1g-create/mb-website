import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'mb_dashboard_session'

function getCredentials() {
  return {
    username: process.env.DASHBOARD_USERNAME ?? 'masterbuild',
    password: process.env.DASHBOARD_PASSWORD ?? 'change-me-now',
    secret: process.env.DASHBOARD_SECRET ?? 'master-build-dashboard-secret',
  }
}

export function createDashboardToken() {
  const { username, password, secret } = getCredentials()
  return createHash('sha256').update(`${username}:${password}:${secret}`).digest('hex')
}

export function isValidDashboardCredentials(username: string, password: string) {
  const credentials = getCredentials()
  return username === credentials.username && password === credentials.password
}

export async function isDashboardAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value === createDashboardToken()
}

export const dashboardSessionCookie = SESSION_COOKIE
