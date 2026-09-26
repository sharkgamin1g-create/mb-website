import { NextResponse } from 'next/server'
import { getOdooConfig } from '@/lib/odoo'

type RouteContext = { params: Promise<{ path: string[] }> }

function isAllowedPath(path: string) {
  return (
    path.startsWith('im_livechat/') ||
    path.startsWith('web/static/') ||
    path === 'web/webclient/translations'
  )
}

async function proxy(request: Request, context: RouteContext) {
  const config = getOdooConfig()
  if (!config) return NextResponse.json({ error: 'Odoo is not configured' }, { status: 503 })

  const { path } = await context.params
  const relativePath = path.join('/')
  if (!isAllowedPath(relativePath)) {
    return NextResponse.json({ error: 'Live Chat proxy path is not allowed' }, { status: 404 })
  }
  const upstreamUrl = `${config.url.replace(/\/+$/, '')}/${relativePath}`
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('content-length')

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
    cache: 'no-store',
  })

  const contentType = upstreamResponse.headers.get('content-type') ?? ''
  let body: BodyInit | null = upstreamResponse.body

  if (contentType.includes('javascript') || contentType.includes('json') || contentType.includes('text')) {
    const text = await upstreamResponse.text()
    const proxyOrigin = new URL(request.url).origin
    body = text.replaceAll(config.url.replace(/\/+$/, ''), `${proxyOrigin}/api/odoo/livechat/proxy`)
  }

  const responseHeaders = new Headers(upstreamResponse.headers)
  responseHeaders.delete('content-encoding')
  responseHeaders.delete('content-length')
  responseHeaders.delete('transfer-encoding')
  responseHeaders.set('access-control-allow-origin', new URL(request.url).origin)
  responseHeaders.set('access-control-allow-credentials', 'true')

  return new NextResponse(body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  })
}

export async function GET(request: Request, context: RouteContext) {
  return proxy(request, context)
}

export async function POST(request: Request, context: RouteContext) {
  return proxy(request, context)
}

export async function OPTIONS(request: Request, context: RouteContext) {
  return proxy(request, context)
}
