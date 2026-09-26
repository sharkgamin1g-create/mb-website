import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { QuoteWizard } from '@/components/quote/quote-wizard'

export const metadata: Metadata = {
  title: 'Instant Quote',
  description:
    'Get an indicative budget for your construction, fit-out or interior project in minutes with the Master Build instant quote tool.',
}

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Instant Quote"
        title="Estimate your project in minutes."
        description="Answer a few questions and get an indicative budget range. A precise proposal follows a site assessment with our team."
      />
      <section className="bg-secondary">
        <div className="container-mb py-20 md:py-28">
          <QuoteWizard />
        </div>
      </section>
    </>
  )
}
