'use client'

import { useState } from 'react'
import { Check, LoaderCircle } from 'lucide-react'

const SERVICES = [
  'Construction',
  'Fit-Out & Finishing',
  'Interior Design',
  'Project Management',
  'Electro-Mechanical',
  'Not sure yet',
]

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICES[0],
    message: '',
  })

  if (sent) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
          <Check className="size-7" />
        </span>
        <h3 className="mt-6 text-2xl font-medium tracking-tight text-foreground">Message sent</h3>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Thanks, {form.name.split(' ')[0] || 'there'}. We&apos;ll be in touch shortly at {form.email}.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
          const response = await fetch('/api/odoo/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
          })

          if (!response.ok) {
            throw new Error('Unable to submit your message right now.')
          }

          setSent(true)
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : 'Something went wrong.')
        } finally {
          setIsSubmitting(false)
        }
      }}
      className="flex flex-col gap-5"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground" id="contact-name-label">Full name *</span>
          <input
            id="contact-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-mb"
            placeholder="Your name"
            autoComplete="name"
            aria-labelledby="contact-name-label"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground" id="contact-email-label">Email *</span>
          <input
            id="contact-email"
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-mb"
            placeholder="you@company.com"
            autoComplete="email"
            aria-labelledby="contact-email-label"
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground" id="contact-phone-label">Phone</span>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-mb"
            placeholder="+20 ..."
            autoComplete="tel"
            aria-labelledby="contact-phone-label"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground" id="contact-service-label">Service</span>
          <select
            id="contact-service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="input-mb"
            aria-labelledby="contact-service-label"
          >
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground" id="contact-message-label">Project brief</span>
        <textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input-mb resize-none"
          placeholder="Tell us about your space, timeline and goals."
          aria-labelledby="contact-message-label"
        />
      </label>
      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
