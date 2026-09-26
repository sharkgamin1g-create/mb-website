import { NextResponse } from 'next/server'
import { getOdooConfig, odooExecute } from '@/lib/odoo'

function getGuestId(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookie = cookieHeader.match(/(?:^|;\s*)dgid=([^;]+)/)?.[1]
  const guestId = cookie?.split('|')[0]
  return guestId ? Number(guestId) : null
}

export async function POST(request: Request) {
  const payload = await request.json()
  const name = String(payload.name ?? '').trim()
  const email = String(payload.email ?? '').trim()
  const config = getOdooConfig()

  if (!name || !config) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  let guestId = getGuestId(request)
  let guestToken = ''

  if (guestId) {
    const cookie = request.headers.get('cookie') ?? ''
    guestToken = cookie.match(/(?:^|;\s*)dgid=[^|;]+\|([^;]+)/)?.[1] ?? ''
  }

  if (!guestId) {
    const createdGuestId = await odooExecute<number>('mail.guest', 'create', [
      { name, email },
    ])
    const guests = createdGuestId
      ? await odooExecute<{ id: number; access_token: string }[]>('mail.guest', 'read', [[createdGuestId]], {
          fields: ['id', 'access_token'],
        })
      : null

    guestId = createdGuestId
    guestToken = guests?.[0]?.access_token ?? ''
  }

  if (!guestId) {
    return NextResponse.json({ success: false }, { status: 502 })
  }

  const cookie = request.headers.get('cookie') ?? ''
  const odooResponse = await fetch(`${config.url.replace(/\/+$/, '')}/mail/guest/update_name`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: guestToken ? `dgid=${guestId}|${guestToken}` : cookie,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: Date.now(),
      params: { guest_id: guestId, name },
    }),
    cache: 'no-store',
  })

  if (!odooResponse.ok) {
    return NextResponse.json({ success: false }, { status: 502 })
  }

  const result = await odooResponse.json()
  if (result.error) {
    return NextResponse.json({ success: false, error: result.error.message }, { status: 502 })
  }

  if (email) {
    await odooExecute('mail.guest', 'write', [[guestId], { email }])
  }

  const nextResponse = NextResponse.json({
    success: true,
    guestId,
    guestToken: guestToken ? `${guestId}|${guestToken}` : '',
  })
  if (guestToken) {
    const requestHost = new URL(request.url).hostname
    const odooHost = new URL(config.url).hostname
    nextResponse.cookies.set('dgid', `${guestId}|${guestToken}`, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      ...(requestHost === odooHost ? { domain: odooHost } : {}),
    })
  }
  return nextResponse
}
