import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Construction', href: '/services#construction' },
      { label: 'Fit-Out & Finishing', href: '/services#fit-out' },
      { label: 'Interior Design', href: '/services#interior' },
      { label: 'Project Management', href: '/services#pm' },
    ],
  },
  {
    title: 'Experience',
    links: [
      { label: 'AI Design Studio', href: '/ai-studio' },
      { label: 'Instant Quote', href: '/quote' },
      { label: 'Book a Consultation', href: '/contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-mb py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-8">
            <Logo variant="light" />
            <p className="max-w-sm text-2xl font-light leading-snug tracking-tight text-white/80 text-balance">
              We build what you imagine — construction, fit-out and design delivered as one integrated experience.
            </p>
            <Link
              href="/quote"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get an Instant Quote
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Master Build. All rights reserved.</p>
          <p className="text-white/40">Precision · Experience · Trust · Craftsmanship</p>
        </div>
      </div>
    </footer>
  )
}
