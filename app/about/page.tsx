import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { Process } from '@/components/home/process'
import { CtaBand } from '@/components/home/cta-band'
import { getAboutContent } from '@/lib/odoo'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Master Build is an integrated construction and fit-out company delivering vision, engineering and craftsmanship as one experience.',
}

export default async function AboutPage() {
  const content = await getAboutContent()

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <section className="bg-background">
        <div className="container-mb grid gap-14 py-24 md:py-32 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/about-craft.png" alt="Master Build craftsmanship" fill className="object-cover" />
          </div>
          <div>
            <span className="label-eyebrow">Our story</span>
            <h2 className="mt-6 text-balance text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-tight tracking-[-0.02em] text-foreground">
              {content.storyTitle}
            </h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              {content.storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="container-mb py-24 md:py-32">
          <span className="label-eyebrow">What we stand for</span>
          <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {content.values.map((v) => (
              <div key={v.title} className="bg-background p-7">
                <h3 className="text-lg font-medium tracking-tight text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Process />
      <CtaBand />
    </>
  )
}
