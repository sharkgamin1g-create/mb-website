import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PROJECTS, type Project } from '@/lib/site-data'

const projectsFile = path.join(process.cwd(), 'data', 'projects.json')

export async function getLocalProjects(): Promise<Project[]> {
  try {
    const content = await readFile(projectsFile, 'utf8')
    return JSON.parse(content) as Project[]
  } catch {
    return PROJECTS
  }
}

export async function saveLocalProjects(projects: Project[]) {
  await mkdir(path.dirname(projectsFile), { recursive: true })
  await writeFile(projectsFile, JSON.stringify(projects, null, 2) + '\n', 'utf8')
}

export function normalizeProject(input: Partial<Project>): Project {
  return {
    slug: String(input.slug ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: String(input.name ?? '').trim(),
    category: (input.category ?? 'commercial') as Project['category'],
    location: String(input.location ?? '').trim(),
    year: String(input.year ?? '').trim(),
    area: String(input.area ?? '').trim(),
    scope: String(input.scope ?? '').trim(),
    summary: String(input.summary ?? '').trim(),
    description: String(input.description ?? '').trim(),
    image: String(input.image ?? '').trim(),
  }
}
