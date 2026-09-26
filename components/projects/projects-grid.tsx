'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABELS, type ProjectCategory, type Project } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

const FILTERS: ('all' | ProjectCategory)[] = [
  'all',
  'residential',
  'corporate',
  'commercial',
  'hospitality',
  'industrial',
]

export function ProjectsGrid({
  initialCategory,
  projects,
}: {
  initialCategory?: string
  projects?: Project[]
}) {
  const initial = (FILTERS.includes(initialCategory as ProjectCategory)
    ? initialCategory
    : 'all') as 'all' | ProjectCategory
  const [filter, setFilter] = useState<'all' | ProjectCategory>(initial)
  const sourceProjects = projects ?? []

  const filtered = filter === 'all' ? sourceProjects : sourceProjects.filter((p) => p.category === filter)

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-5 py-2 text-sm font-medium capitalize transition-colors',
              filter === f
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground',
            )}
          >
            {f === 'all' ? 'All Work' : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
              <Image
                src={project.image || '/placeholder.svg'}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium tracking-tight text-foreground">{project.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {CATEGORY_LABELS[project.category]} · {project.location}
                </p>
              </div>
              <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
