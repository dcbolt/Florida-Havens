import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-4xl text-ocean-700">
        We could not find that page
      </h1>
      <p className="mt-4 text-base text-neutral-700">
        It may have moved. If you were looking for a house guide, Wi-Fi details
        or check-in steps, those now live in the{' '}
        <a
          href="https://welcome.mediahaven.app"
          className="text-ocean-700 underline"
        >
          guest portal
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
        >
          Home
        </Link>
        <Link
          href="/properties"
          className="rounded-sm border border-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ocean-700"
        >
          See the homes
        </Link>
      </div>
    </section>
  )
}
