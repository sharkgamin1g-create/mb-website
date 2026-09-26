import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { CtaBand } from '@/components/home/cta-band'
import { ArrowUpRight } from 'lucide-react'
import { getServices } from '@/lib/odoo'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Construction, fit-out, interior design, project management and electro-mechanical works — delivered as one integrated service.',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Six disciplines. One accountable team."
        description="We cover the full lifecycle of the built environment, so your project stays coherent from first concept to final handover."
      />

      <section className="bg-background">
        <div className="container-mb divide-y divide-border py-8">
          {services.map((service, i) => (
            <article
              key={service.id}
              id={service.id}
              className="grid scroll-mt-28 gap-8 py-16 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16"
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative aspect-[16/11] overflow-hidden bg-secondary">
                  <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover" />
                </div>
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <span className="font-mono text-sm text-primary">{service.index}</span>
                <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium tracking-[-0.02em] text-foreground">
                  {service.title}
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <Link
                  href="/quote"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  Get a quote for this
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  )
}
