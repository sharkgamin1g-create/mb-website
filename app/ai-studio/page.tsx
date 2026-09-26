import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { Sparkles, Wand2, Ruler, Palette, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Studio',
  description:
    'Explore ideas for your space with Master Build AI Studio — a preview of AI-assisted concept and estimating tools.',
}

const FEATURES = [
  {
    icon: Wand2,
    title: 'Concept generation',
    body: 'Describe your space and generate visual directions to align your team before design begins.',
  },
  {
    icon: Palette,
    title: 'Material & finish exploration',
    body: 'Compare palettes and finishes side by side to shape the look and feel of your interior.',
  },
  {
    icon: Ruler,
    title: 'Smart estimating',
    body: 'Translate a brief into an indicative budget range instantly, refined by our team.',
  },
]

export default function AiStudioPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Studio"
        title="Imagine your space, intelligently."
        description="A preview of the AI-assisted tools we're building to help you explore concepts, finishes and budgets before ground is broken."
      />

      <section className="bg-background">
        <div className="container-mb py-24 md:py-32">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-4 bg-background p-8">
                <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="text-lg font-medium tracking-tight text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-navy text-white">
        <div className="container-mb flex flex-col items-start gap-8 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
            <Sparkles className="size-3.5 text-primary" />
            Coming soon
          </span>
          <h2 className="max-w-2xl text-balance text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            Want early access to the AI Studio?
          </h2>
          <p className="max-w-xl text-white/70">
            We&apos;re rolling these tools out with select clients. In the meantime, try our instant
            quote or start a conversation with our team.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try Instant Quote
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Request access
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
