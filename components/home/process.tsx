import { PROCESS_STEPS } from '@/lib/site-data'

export function Process() {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="container-mb py-24 md:py-32">
        <div className="max-w-xl">
          <span className="label-eyebrow">How we deliver</span>
          <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
            A disciplined process, from kickoff to handover.
          </h2>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-5">
          {PROCESS_STEPS.map((step) => (
            <li key={step.index} className="flex flex-col gap-4 bg-background p-6 md:p-7">
              <span className="font-mono text-sm tabular-nums text-primary">{step.index}</span>
              <h3 className="text-lg font-medium tracking-tight text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
