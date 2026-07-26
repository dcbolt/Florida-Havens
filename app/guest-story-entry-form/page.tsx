import type { Metadata } from 'next'
import { HOMES } from '@/content/properties'
import { SITE } from '@/content/site'

/**
 * "Share your story" form. URL kept 1:1 (matrix marks it KEEP+NOINDEX).
 *
 * noindex is deliberate: it is a form, not a search destination, and the live
 * page ships 1,404 KB to deliver ~255 words.
 *
 * The submit endpoint is NOT wired. The live page uses a Wix Form, which does
 * not survive the migration, and inventing a handler that silently drops guest
 * submissions would be worse than an honest gap. See the note in the markup.
 */
export const metadata: Metadata = {
  title: 'Tell Us Your Story',
  description:
    'Share your experience at The Florida Havens with future guests.',
  alternates: { canonical: '/guest-story-entry-form' },
  robots: { index: false, follow: true },
}

const FIELD =
  'mt-1 w-full rounded-sm border border-black/20 px-3 py-2 text-sm focus:border-ocean-700'

export default function GuestStoryFormPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-ocean-700">
        Share Your Memories From The Havens
      </h1>
      <p className="mt-4 text-base leading-relaxed text-neutral-700">
        Your time at The Florida Havens means the world to us. If you have a
        moment, we would love for you to share your story — the memories you
        made, and any advice for future guests.
      </p>

      <div className="mt-8 rounded-sm border border-dashed border-ocean-300 bg-ocean-50 p-4 text-sm text-ocean-700">
        <strong className="font-semibold">Not yet wired:</strong> the live page
        uses a Wix Form, which does not carry over. Point this at a form handler
        (or Guesty/CRM) before cutover — submissions are currently not captured,
        and a form that silently loses a guest&apos;s story is worse than no form.
      </div>

      <form className="mt-8 space-y-5" aria-describedby="form-consent">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first" className="text-sm font-medium">
              First name <span aria-hidden className="text-brass-500">*</span>
            </label>
            <input id="first" name="first" required className={FIELD} />
          </div>
          <div>
            <label htmlFor="last" className="text-sm font-medium">
              Last name
            </label>
            <input id="last" name="last" className={FIELD} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email <span aria-hidden className="text-brass-500">*</span>
          </label>
          <input id="email" name="email" type="email" required className={FIELD} />
        </div>

        <div>
          <label htmlFor="stayed" className="text-sm font-medium">
            Where did you stay?{' '}
            <span aria-hidden className="text-brass-500">*</span>
          </label>
          <select id="stayed" name="stayed" required className={FIELD}>
            <option value="">Choose a home</option>
            {HOMES.map((h) => (
              <option key={h.slug} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="from" className="text-sm font-medium">
            Where are you from?{' '}
            <span aria-hidden className="text-brass-500">*</span>
          </label>
          <input id="from" name="from" required className={FIELD} />
        </div>

        <div>
          <label htmlFor="story" className="text-sm font-medium">
            Tell us about your stay{' '}
            <span aria-hidden className="text-brass-500">*</span>
          </label>
          <textarea id="story" name="story" rows={5} required className={FIELD} />
        </div>

        <div>
          <label htmlFor="advice" className="text-sm font-medium">
            Any advice for future guests?
          </label>
          <textarea id="advice" name="advice" rows={3} className={FIELD} />
        </div>

        <div className="flex gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1"
          />
          <label id="form-consent" htmlFor="consent" className="text-sm text-neutral-700">
            I agree to have any/all content from this form published online for
            other guests to enjoy.{' '}
            <span aria-hidden className="text-brass-500">*</span>
          </label>
        </div>

        <button
          type="submit"
          className="rounded-sm bg-ocean-700 px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
        >
          Submit
        </button>
      </form>

      <p className="mt-8 text-sm text-neutral-600">
        Prefer email? Send it to{' '}
        <a
          href={`mailto:${SITE.email}`}
          className="font-medium text-ocean-700 hover:underline"
        >
          {SITE.email}
        </a>
        .
      </p>
    </section>
  )
}
