import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProjectsGrid } from '@/components/projects/projects-grid'
import { CtaBand } from '@/components/home/cta-band'
import { getProjects } from '@/lib/odoo'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore selected Master Build projects across residential, corporate, commercial, hospitality and industrial sectors.',
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const projects = await getProjects()

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Work built to be remembered."
        description="A selection of spaces we've designed, engineered and delivered across sectors."
      />
      <section className="bg-background">
        <div className="container-mb py-20 md:py-28">
          <ProjectsGrid initialCategory={category} projects={projects} />
        </div>
      </section>
      <CtaBand />
    </>
  )
}
