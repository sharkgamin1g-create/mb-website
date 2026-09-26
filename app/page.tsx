import { Hero } from '@/components/home/hero'
import { Stats } from '@/components/home/stats'
import { ClientsMarquee } from '@/components/home/clients-marquee'
import { About } from '@/components/home/about'
import { ServicesShowcase } from '@/components/home/services-showcase'
import { ProjectsPreview } from '@/components/home/projects-preview'
import { Process } from '@/components/home/process'
import { Testimonials } from '@/components/home/testimonials'
import { CtaBand } from '@/components/home/cta-band'
import { getProjects, getServices } from '@/lib/odoo'

export default async function HomePage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()])

  return (
    <>
      <Hero />
      <Stats />
      <ClientsMarquee />
      <About />
      <ServicesShowcase services={services} />
      <ProjectsPreview projects={projects} />
      <Process />
      <Testimonials />
      <CtaBand />
    </>
  )
}
