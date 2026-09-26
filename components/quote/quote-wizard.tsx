'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Check, RefreshCw } from 'lucide-react'

type ProjectType = 'residential' | 'corporate' | 'commercial' | 'hospitality' | 'industrial'
type ServiceKey = 'construction' | 'fit-out' | 'interior' | 'pm' | 'mep'
type Finish = 'standard' | 'premium' | 'luxury'

const PROJECT_TYPES: { key: ProjectType; label: string; base: number }[] = [
  { key: 'residential', label: 'Residential', base: 4500 },
  { key: 'corporate', label: 'Corporate Office', base: 5200 },
  { key: 'commercial', label: 'Retail / Commercial', base: 6000 },
  { key: 'hospitality', label: 'Hospitality', base: 7500 },
  { key: 'industrial', label: 'Industrial', base: 3200 },
]

const SERVICES: { key: ServiceKey; label: string; factor: number }[] = [
  { key: 'construction', label: 'Construction', factor: 1 },
  { key: 'fit-out', label: 'Fit-Out & Finishing', factor: 0.85 },
  { key: 'interior', label: 'Interior Design', factor: 0.35 },
  { key: 'pm', label: 'Project Management', factor: 0.2 },
  { key: 'mep', label: 'Electro-Mechanical', factor: 0.55 },
]

const FINISHES: { key: Finish; label: string; mult: number; desc: string }[] = [
  { key: 'standard', label: 'Standard', mult: 1, desc: 'Quality materials, efficient delivery' },
  { key: 'premium', label: 'Premium', mult: 1.35, desc: 'Elevated finishes and detailing' },
  { key: 'luxury', label: 'Luxury', mult: 1.8, desc: 'Bespoke, high-specification craftsmanship' },
]

const STEPS = ['Project Type', 'Scope', 'Size & Finish', 'Details', 'Estimate']

const currency = (n: number) =>
  new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n)

export function QuoteWizard() {
  const [step, setStep] = useState(0)
  const [type, setType] = useState<ProjectType | null>(null)
  const [services, setServices] = useState<ServiceKey[]>([])
  const [area, setArea] = useState(150)
  const [finish, setFinish] = useState<Finish>('premium')
  const [details, setDetails] = useState({ name: '', email: '', phone: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  const estimate = useMemo(() => {
    if (!type || services.length === 0) return null
    const typeObj = PROJECT_TYPES.find((t) => t.key === type)!
    const finishObj = FINISHES.find((f) => f.key === finish)!
    const serviceFactor = services.reduce(
      (sum, s) => sum + (SERVICES.find((x) => x.key === s)?.factor ?? 0),
      0,
    )
    const perSqm = typeObj.base * serviceFactor * finishObj.mult
    const total = perSqm * area
    return {
      low: Math.round((total * 0.9) / 1000) * 1000,
      high: Math.round((total * 1.15) / 1000) * 1000,
      perSqm: Math.round(perSqm),
    }
  }, [type, services, area, finish])

  const canNext =
    (step === 0 && type) ||
    (step === 1 && services.length > 0) ||
    step === 2 ||
    (step === 3 && details.name && details.email) ||
    step === 4

  const toggleService = (key: ServiceKey) =>
    setServices((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]))

  const reset = () => {
    setStep(0)
    setType(null)
    setServices([])
    setArea(150)
    setFinish('premium')
    setDetails({ name: '', email: '', phone: '', notes: '' })
    setSubmitted(false)
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progress */}
      <div className="mb-10 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <span
                className={cn(
                  'text-[11px] font-medium uppercase tracking-wider transition-colors',
                  i <= step ? 'text-primary' : 'text-muted-foreground/50',
                )}
              >
                {label}
              </span>
              <span className="h-1 w-full overflow-hidden rounded-full bg-border">
                <span
                  className={cn(
                    'block h-full rounded-full bg-primary transition-all duration-500',
                    i < step ? 'w-full' : i === step ? 'w-1/2' : 'w-0',
                  )}
                />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6 md:p-10">
        {/* Step 0: type */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-foreground">
              What are you building?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Select the project type that fits best.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setType(t.key)}
                  className={cn(
                    'flex items-center justify-between rounded-md border p-4 text-left transition-all',
                    type === t.key
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  <span className="text-[15px] font-medium text-foreground">{t.label}</span>
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full border transition-colors',
                      type === t.key ? 'border-primary bg-primary text-white' : 'border-border',
                    )}
                  >
                    {type === t.key && <Check className="size-3" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: services */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-foreground">
              Which services do you need?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Select all that apply.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => toggleService(s.key)}
                  className={cn(
                    'flex items-center justify-between rounded-md border p-4 text-left transition-all',
                    services.includes(s.key)
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  <span className="text-[15px] font-medium text-foreground">{s.label}</span>
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded border transition-colors',
                      services.includes(s.key) ? 'border-primary bg-primary text-white' : 'border-border',
                    )}
                  >
                    {services.includes(s.key) && <Check className="size-3" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: size and finish */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-foreground">Size and finish</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Adjust the built-up area and choose your finish level.
            </p>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <label htmlFor="area" className="text-sm font-medium text-foreground">
                  Built-up area
                </label>
                <span className="text-lg font-medium tabular-nums text-primary">{area} m²</span>
              </div>
              <input
                id="area"
                type="range"
                min={30}
                max={2000}
                step={10}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="mt-4 w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>30 m²</span>
                <span>2000 m²</span>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {FINISHES.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFinish(f.key)}
                  className={cn(
                    'flex flex-col gap-1 rounded-md border p-4 text-left transition-all',
                    finish === f.key
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-muted-foreground/40',
                  )}
                >
                  <span className="text-[15px] font-medium text-foreground">{f.label}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: details */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-foreground">Your details</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll send your estimate and follow up with a tailored proposal.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  type="text"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  className="input-mb"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  className="input-mb"
                  placeholder="you@company.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="input-mb"
                  placeholder="+20 ..."
                />
              </Field>
              <Field label="Project notes" className="sm:col-span-2">
                <textarea
                  value={details.notes}
                  onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  rows={3}
                  className="input-mb resize-none"
                  placeholder="Tell us about your timeline, location or specific needs."
                />
              </Field>
            </div>
          </div>
        )}

        {/* Step 4: estimate */}
        {step === 4 && estimate && (
          <div>
            {!submitted ? (
              <>
                <span className="label-eyebrow">Your indicative estimate</span>
                <p className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-medium leading-none tracking-tight text-foreground">
                  {currency(estimate.low)}
                  <span className="text-muted-foreground"> – </span>
                  {currency(estimate.high)}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Approx. {currency(estimate.perSqm)} / m² across {area} m² · {finish} finish
                </p>

                <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                  <Summary label="Project type" value={PROJECT_TYPES.find((t) => t.key === type)?.label ?? '—'} />
                  <Summary label="Finish level" value={FINISHES.find((f) => f.key === finish)?.label ?? '—'} />
                  <Summary
                    label="Services"
                    value={services.map((s) => SERVICES.find((x) => x.key === s)?.label).join(', ')}
                  />
                  <Summary label="Built-up area" value={`${area} m²`} />
                </dl>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await fetch('/api/odoo/quote', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          name: details.name,
                          email: details.email,
                          phone: details.phone,
                          notes: details.notes,
                          projectType: type,
                          services,
                          area,
                          finish,
                          estimate,
                        }),
                      })

                      setSubmitted(true)
                    } catch (error) {
                      console.error('Quote submission failed:', error)
                      setSubmitted(true)
                    }
                  }}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Request detailed proposal
                  <ArrowRight className="size-4" />
                </button>
                <p className="mt-4 text-xs text-muted-foreground/70">
                  This is a non-binding budgetary range generated for planning purposes. A precise
                  quotation follows a site assessment.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                  <Check className="size-7" />
                </span>
                <h2 className="mt-6 text-2xl font-medium tracking-tight text-foreground">
                  Thank you, {details.name.split(' ')[0] || 'there'}.
                </h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  Your request has been received. Our team will reach out at{' '}
                  <span className="text-foreground">{details.email}</span> with a tailored proposal.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <RefreshCw className="size-4" />
                    New estimate
                  </button>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Explore our work
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        {!(step === 4 && submitted) && (
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
              >
                {step === 3 ? 'See estimate' : 'Continue'}
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
    </label>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium capitalize text-foreground">{value}</dd>
    </div>
  )
}
