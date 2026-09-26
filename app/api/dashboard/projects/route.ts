import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { getLocalProjects, normalizeProject, saveLocalProjects } from '@/lib/projects-store'

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ projects: await getLocalProjects() })
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const project = normalizeProject(await request.json())
  if (!project.slug || !project.name || !project.image) {
    return NextResponse.json({ error: 'Name, slug and image are required.' }, { status: 400 })
  }

  const projects = await getLocalProjects()
  if (projects.some((item) => item.slug === project.slug)) {
    return NextResponse.json({ error: 'A project with this slug already exists.' }, { status: 409 })
  }

  projects.unshift(project)
  await saveLocalProjects(projects)
  return NextResponse.json({ project }, { status: 201 })
}
