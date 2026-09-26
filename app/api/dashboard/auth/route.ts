import { NextResponse } from 'next/server'
import {
  createDashboardToken,
  dashboardSessionCookie,
  isValidDashboardCredentials,
} from '@/lib/dashboard-auth'

export async function POST(request: Request) {
  const payload = await request.json()
  const username = String(payload.username ?? '')
  const password = String(payload.password ?? '')

  if (!isValidDashboardCredentials(username, password)) {
    return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(dashboardSessionCookie, createDashboardToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(dashboardSessionCookie)
  return response
}
