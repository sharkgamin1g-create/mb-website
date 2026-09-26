import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { getCompanyProfile } from '@/lib/odoo'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start your project with Master Build. Book a consultation or send us your brief.',
}

export default async function ContactPage() {
  const profile = await getCompanyProfile()

  const details = [
    {
      icon: Mail,
      label: 'Email',
      value: String(profile.email ?? 'hello@masterbuild.example'),
      href: `mailto:${profile.email ?? 'hello@masterbuild.example'}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: String(profile.phone ?? '+20 100 000 0000'),
      href: `tel:${String(profile.phone ?? '+201000000000').replace(/\s+/g, '')}`,
    },
    { icon: MapPin, label: 'Office', value: String(profile.city ?? 'Cairo, Egypt') },
    { icon: Clock, label: 'Hours', value: 'Sun–Thu, 9:00–18:00' },
  ]

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build it together."
        description="Tell us about your project and our team will get back to you with next steps."
      />
      <section className="bg-background">
        <div className="container-mb grid gap-14 py-24 md:py-32 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-foreground">Get in touch</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Prefer to reach us directly? Use any of the details below and our team will get back
              to you as soon as possible.
            </p>
            <dl className="mt-10 space-y-6">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <d.icon className="size-5" />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{d.label}</dt>
                    <dd className="mt-0.5 text-[15px] font-medium text-foreground">
                      {d.href ? (
                        <a href={d.href} className="transition-colors hover:text-primary">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
