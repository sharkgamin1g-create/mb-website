import { CLIENTS } from '@/lib/site-data'

export function ClientsMarquee() {
  const row = [...CLIENTS, ...CLIENTS]
  return (
    <section className="overflow-hidden border-b border-border bg-secondary py-16">
      <div className="container-mb">
        <span className="label-eyebrow">Built for brands that expect more</span>
      </div>
      <div className="marquee-paused mt-10 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex shrink-0 items-center gap-16 pr-16">
          {row.map((client, i) => (
            <span
              key={`${client}-${i}`}
              className="whitespace-nowrap text-2xl font-medium tracking-tight text-muted-foreground/50 transition-colors hover:text-primary"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
