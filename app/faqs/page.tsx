import type { Metadata } from 'next'
import { FAQS } from '@/content/faqs'
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers on booking direct, pools, pets, check-in, amenities, beach safety and getting to Orlando from The Florida Havens.',
  alternates: { canonical: '/faqs' },
}

export default function FaqsPage() {
  return (
    <>
      {/* AUDIT FIX: 21 Q&As existed on the live site with no FAQPage schema. */}
      <FaqJsonLd faqs={FAQS} />
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'FAQs', path: '/faqs' },
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-base text-neutral-700">
          If your question is not here, call us — we would rather talk it
          through than have you guess.
        </p>

        {/*
          Native <details> rather than a JS accordion widget: the answers are
          present in the HTML for crawlers either way, and it costs no
          JavaScript. The live Wix FAQ widget renders client-side.
        */}
        <div className="mt-10 divide-y divide-black/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-display text-lg text-ocean-700 marker:hidden">
                <span className="inline-flex w-full items-start justify-between gap-4">
                  {f.q}
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-ocean-700 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
