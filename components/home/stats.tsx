'use client'

import { useEffect, useRef, useState } from 'react'
import { STATS } from '@/lib/site-data'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1600
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(Math.round(eased * value))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container-mb py-20 md:py-28">
        <h2 className="max-w-2xl text-balance text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Trusted to build spaces that matter.
        </h2>
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 border-t border-border pt-5">
              <span className="text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none tracking-tight text-foreground">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted-foreground/70">
          Figures shown are indicative placeholders pending confirmation of official company data.
        </p>
      </div>
    </section>
  )
}
