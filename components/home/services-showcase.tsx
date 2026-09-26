'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Service } from '@/lib/site-data'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ServicesShowcase({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0)

  return (
    <section className="bg-navy text-white">
      <div className="container-mb py-24 md:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">
              What we do
            </span>
            <h2 className="mt-5 max-w-xl text-balance text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em]">
              Six disciplines, one integrated delivery.
            </h2>
          </div>
          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            All services
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <ul className="flex flex-col">
            {services.map((service, i) => (
              <li key={service.id}>
                <Link
                  href={`/services#${service.id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    'group flex items-baseline gap-5 border-b border-white/10 py-6 transition-colors',
                    active === i ? 'text-white' : 'text-white/45 hover:text-white/70',
                  )}
                >
                  <span className="font-mono text-xs tabular-nums text-white/30">
                    {service.index}
                  </span>
                  <span className="flex-1">
                    <span className="block text-2xl font-medium tracking-tight md:text-3xl">
                      {service.title}
                    </span>
                    <span
                      className={cn(
                        'mt-2 block max-w-md text-sm leading-relaxed text-white/50 transition-all duration-300',
                        active === i ? 'opacity-100' : 'opacity-0 lg:h-0 lg:overflow-hidden',
                      )}
                    >
                      {service.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={cn(
                      'size-5 shrink-0 transition-all',
                      active === i ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0',
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative hidden overflow-hidden lg:block">
            {services.map((service, i) => (
              <div
                key={service.id}
                className={cn(
                  'absolute inset-0 transition-all duration-700',
                  active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                )}
                aria-hidden={active !== i}
              >
                <Image src={service.image || '/placeholder.svg'} alt={service.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
