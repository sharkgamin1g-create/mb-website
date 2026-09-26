export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <section className="border-b border-border bg-navy text-white">
      <div className="container-mb pb-16 pt-36 md:pb-24 md:pt-44">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
          <span className="h-px w-8 bg-primary" />
          {eyebrow}
        </span>
        <h1 className="mt-6 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.03em]">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{description}</p>
        )}
      </div>
    </section>
  )
}
