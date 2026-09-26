import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const PILLARS = [
  { title: 'Who we are', body: 'An integrated construction and fit-out company delivering end-to-end built environments.' },
  { title: 'What we do', body: 'Construction, fit-out, interior design, project management and electro-mechanical works.' },
  { title: 'How we work', body: 'One accountable team, precise planning and craftsmanship at every stage of delivery.' },
  { title: 'Why we exist', body: 'To turn ambitious visions into spaces that perform, endure and inspire.' },
]

export function About() {
  return (
    <section className="bg-background">
      <div className="container-mb grid gap-14 py-24 md:py-32 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="order-2 lg:order-1">
          <span className="label-eyebrow">About Master Build</span>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
            We deliver vision, engineering and craftsmanship as one experience.
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.title} className="border-t border-border pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/about"
            className="group mt-12 inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            Read our story
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/about-craft.png"
              alt="Master Build craftsman working on a precise architectural detail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
