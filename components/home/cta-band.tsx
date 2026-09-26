import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function CtaBand() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-mb flex flex-col gap-10 py-20 md:flex-row md:items-center md:justify-between md:py-28">
        <h2 className="max-w-2xl text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.02em]">
          Have a project in mind? Let&apos;s build it.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-primary transition-colors hover:bg-white/90"
          >
            Start Your Project
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Get an Instant Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
