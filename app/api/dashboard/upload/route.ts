import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'

const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File) || !allowedTypes[file.type]) {
    return NextResponse.json({ error: 'Upload a JPG, PNG or WebP image.' }, { status: 400 })
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'Images must be smaller than 8 MB.' }, { status: 400 })
  }

  const extension = allowedTypes[file.type]
  const filename = `${randomUUID()}.${extension}`
  const uploadDirectory = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDirectory, { recursive: true })
  await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ url: `/uploads/${filename}` })
}
