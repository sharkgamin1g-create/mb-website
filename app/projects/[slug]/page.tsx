import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORY_LABELS, PROJECTS } from '@/lib/site-data'
import { getProjects } from '@/lib/odoo'
import { CtaBand } from '@/components/home/cta-band'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = (await getProjects()).find((p) => p.slug === slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.name,
    description: project.summary,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const projects = await getProjects()
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const others = projects.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <section className="bg-navy text-white">
        <div className="container-mb pb-12 pt-36 md:pt-44">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            All projects
          </Link>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                {CATEGORY_LABELS[project.category]}
              </span>
              <h1 className="mt-4 max-w-3xl text-balance text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.03em]">
                {project.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="container-mb pb-16">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image src={project.image || '/placeholder.svg'} alt={project.name} fill className="object-cover" priority />
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-mb grid gap-14 py-20 md:py-28 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div>
            <span className="label-eyebrow">Overview</span>
            <p className="mt-6 text-balance text-[clamp(1.25rem,2.2vw,1.75rem)] font-light leading-snug text-foreground">
              {project.summary}
            </p>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              <p>{project.description}</p>
            </div>
          </div>
          <aside>
            <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border">
              <Meta label="Location" value={project.location} />
              <Meta label="Sector" value={CATEGORY_LABELS[project.category]} />
              <Meta label="Scope" value={project.scope} />
              <Meta label="Year" value={project.year} />
              <Meta label="Area" value={project.area} />
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="container-mb py-20 md:py-28">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">More projects</h2>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              View all
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-background">
                  <Image
                    src={p.image || '/placeholder.svg'}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium tracking-tight text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{CATEGORY_LABELS[p.category]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-[15px] font-medium text-foreground">{value}</dd>
    </div>
  )
}
