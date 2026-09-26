import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { ArrowUpRight } from 'lucide-react'
import { getOpenRoles } from '@/lib/odoo'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Master Build. Explore open roles across construction, design and project delivery.',
}

const PERKS = [
  { title: 'Real ownership', body: 'Lead meaningful work on landmark projects from day one.' },
  { title: 'Craft culture', body: 'Work alongside people who care about the details as much as you do.' },
  { title: 'Growth', body: 'Clear paths to develop across disciplines and seniority.' },
]

export default async function CareersPage() {
  const roles = await getOpenRoles()

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build your career with us."
        description="We're always looking for people who take pride in precision and craft. Explore where you fit in."
      />

      <section className="bg-background">
        <div className="container-mb py-24 md:py-32">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            {PERKS.map((p) => (
              <div key={p.title} className="bg-background p-7">
                <h3 className="text-lg font-medium tracking-tight text-foreground">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">Open positions</h2>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {roles.map((role) => (
                <li key={role.title}>
                  <Link
                    href="/contact"
                    className="group flex flex-col gap-3 py-6 transition-colors sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {role.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {role.department} · {role.location} · {role.type}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      Apply
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
