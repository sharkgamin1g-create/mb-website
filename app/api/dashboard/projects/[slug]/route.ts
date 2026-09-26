import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { getLocalProjects, normalizeProject, saveLocalProjects } from '@/lib/projects-store'

type RouteContext = { params: Promise<{ slug: string }> }

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await context.params
  const project = normalizeProject(await request.json())
  const projects = await getLocalProjects()
  const index = projects.findIndex((item) => item.slug === slug)

  if (index === -1) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  if (!project.slug || !project.name || !project.image) {
    return NextResponse.json({ error: 'Name, slug and image are required.' }, { status: 400 })
  }
  if (projects.some((item, itemIndex) => item.slug === project.slug && itemIndex !== index)) {
    return NextResponse.json({ error: 'A project with this slug already exists.' }, { status: 409 })
  }

  projects[index] = project
  await saveLocalProjects(projects)
  return NextResponse.json({ project })
}

export async function DELETE(_: Request, context: RouteContext) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await context.params
  const projects = await getLocalProjects()
  const nextProjects = projects.filter((item) => item.slug !== slug)
  if (nextProjects.length === projects.length) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  }

  await saveLocalProjects(nextProjects)
  return NextResponse.json({ success: true })
}
