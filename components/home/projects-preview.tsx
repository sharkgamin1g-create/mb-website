import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABELS, type Project } from '@/lib/site-data'
import { ArrowUpRight } from 'lucide-react'

export function ProjectsPreview({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 4)
  return (
    <section className="bg-background">
      <div className="container-mb py-24 md:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-eyebrow">Selected work</span>
            <h2 className="mt-5 max-w-xl text-balance text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
              Projects engineered for permanence.
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground"
          >
            View all projects
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-secondary">
                <Image
                  src={project.image || '/placeholder.svg'}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy/0 transition-colors duration-500 group-hover:bg-navy/20" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-medium tracking-tight text-foreground">
                    {project.name}
                  </h3>
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
    </section>
  )
}
