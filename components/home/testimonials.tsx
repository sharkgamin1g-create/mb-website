'use client'

import { useState } from 'react'
import { TESTIMONIALS } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="bg-background">
      <div className="container-mb py-24 md:py-32">
        <span className="label-eyebrow">In their words</span>
        <div className="mt-10 grid gap-12 lg:grid-cols-[2fr_1fr] lg:items-end">
          <blockquote className="relative min-h-[6em]">
            {TESTIMONIALS.map((t, i) => (
              <p
                key={i}
                className={cn(
                  'text-balance text-[clamp(1.5rem,3.5vw,2.75rem)] font-light leading-[1.15] tracking-[-0.01em] text-foreground transition-opacity duration-500',
                  i === active ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0',
                )}
                aria-hidden={i !== active}
              >
                “{t.quote}”
              </p>
            ))}
          </blockquote>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-foreground">{TESTIMONIALS[active].name}</p>
              <p className="text-sm text-muted-foreground">
                {TESTIMONIALS[active].company} · {TESTIMONIALS[active].project}
              </p>
            </div>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    'h-1 w-10 rounded-full transition-colors',
                    i === active ? 'bg-primary' : 'bg-border hover:bg-muted-foreground/40',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-12 text-xs text-muted-foreground/70">
          Testimonials are CMS-ready placeholders pending confirmation of real client quotes.
        </p>
      </div>
    </section>
  )
}
