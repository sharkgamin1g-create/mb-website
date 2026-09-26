'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HERO_SCENES } from '@/lib/site-data'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % HERO_SCENES.length)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy">
      {/* Scenes */}
      {HERO_SCENES.map((scene, i) => (
        <div
          key={scene.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1400ms] ease-out',
            i === active ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== active}
        >
          <Image
            src={scene.image || '/placeholder.svg'}
            alt=""
            fill
            priority={i === 0}
            className={cn(
              'object-cover transition-transform duration-[7000ms] ease-out',
              i === active ? 'scale-105' : 'scale-100',
            )}
          />
        </div>
      ))}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />

      <div className="container-mb relative z-10 pb-16 pt-32">
        <div className="max-w-4xl">
          <span className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
            <span className="h-px w-8 bg-primary" />
            Master Build
          </span>

          <div className="relative text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            {/* Invisible sizer reserves space for the tallest scene (3 lines) */}
            <div aria-hidden className="invisible">
              <span className="block">We build</span>
              <span className="block">what you</span>
              <span className="block">imagine.</span>
            </div>
            {HERO_SCENES.map((scene, i) => (
              <h1
                key={scene.id}
                className={cn(
                  'absolute inset-0 text-white transition-all duration-1000',
                  i === active
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0',
                )}
                aria-hidden={i !== active}
              >
                {scene.lines.map((line, li) => (
                  <span key={li} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            ))}
          </div>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            Construction, fit-out, architectural design and project management —
            delivered as one integrated experience.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-medium text-navy transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:px-6"
            >
              Start Your Project
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:px-6"
            >
              Explore Our Work
            </Link>
            <Link
              href="/ai-studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:px-6"
            >
              Design with AI
            </Link>
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 px-2 py-3.5 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Get an Instant Quote
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Scene indicators */}
        <div className="mt-16 flex items-center gap-6">
          {HERO_SCENES.map((scene, i) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to scene ${i + 1}`}
              aria-pressed={i === active}
              className="group flex items-center gap-3"
            >
              <span className="font-mono text-xs tabular-nums text-white/50 transition-colors group-hover:text-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="relative h-px w-10 overflow-hidden bg-white/20">
                <span
                  className={cn(
                    'absolute inset-y-0 left-0 bg-white transition-all duration-500',
                    i === active ? 'w-full' : 'w-0',
                  )}
                />
              </span>
            </button>
          ))}
          <span className="ml-2 font-mono text-xs tabular-nums text-white/40">
            / {String(HERO_SCENES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}
