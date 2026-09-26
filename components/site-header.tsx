'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/site-data'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Menu, X, ChevronRight } from 'lucide-react'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isHome = pathname === '/'
  const isDarkHeader = isHome && !scrolled
  const isSolidHeader = !isDarkHeader

  if (pathname.startsWith('/dashboard')) return null

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          isSolidHeader
            ? 'border-b border-border bg-background/80 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5',
        )}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="container-mb flex items-center justify-between gap-8">
          <Link href="/" aria-label="Master Build home" className="relative z-10">
            <Logo variant={isDarkHeader ? 'light' : 'blue'} />
          </Link>

          <nav className="hidden items-center gap-1 lg:gap-2 lg:flex" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.children ? item.label : null)}
              >
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:px-3.5',
                    isDarkHeader
                      ? 'text-white/80 hover:text-white'
                      : 'text-foreground/70 hover:text-foreground',
                    pathname === item.href && (isDarkHeader ? 'text-white' : 'text-foreground'),
                  )}
                >
                  {item.label}
                </Link>

                {item.children && openMenu === item.label && (
                  <div className="absolute left-1/2 top-full w-[min(90vw,520px)] -translate-x-1/2 pt-4">
                    <div className="grid grid-cols-1 gap-1 rounded-lg border border-border bg-background p-3 shadow-[0_24px_60px_-24px_rgba(11,18,32,0.35)] sm:grid-cols-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="group flex flex-col gap-0.5 rounded-md px-3.5 py-3 transition-colors hover:bg-accent"
                        >
                          <span className="flex items-center justify-between text-sm font-medium text-foreground">
                            {child.label}
                            <ChevronRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          </span>
                          {child.blurb && (
                            <span className="text-xs leading-relaxed text-muted-foreground">
                              {child.blurb}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={cn(
                'group hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all lg:inline-flex',
                isDarkHeader
                  ? 'bg-white text-navy hover:bg-white/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
            >
              Start Your Project
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen(true)}
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden',
                isDarkHeader ? 'text-white' : 'text-foreground',
              )}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen nav */}
      <div
        className={cn(
          'fixed inset-0 z-[60] flex flex-col bg-navy text-white transition-all duration-500 lg:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="container-mb flex items-center justify-between py-5">
          <Logo variant="light" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X className="size-6" />
          </button>
        </div>
        <nav className="container-mb flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-8">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="group flex items-center justify-between border-b border-white/10 py-4 text-3xl font-medium tracking-tight text-white/90 transition-colors hover:text-white"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {item.label}
              <ArrowUpRight className="size-6 text-white/40 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
            </Link>
          ))}
        </nav>
        <div className="container-mb pb-10">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-base font-medium text-navy"
          >
            Start Your Project
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
