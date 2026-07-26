import type { Block } from '@/content/page-body'

/**
 * Renders migrated Wix body copy with a valid heading outline.
 *
 * AUDIT FIX: the live pages jump from <h1> straight to <h5> (40 of 74 pages
 * use <h5> with no <h3> anywhere). The page owns the single <h1>; every section
 * heading here renders as <h2>/<h3>. Font sizes are set in CSS to match the
 * live look, so the visual result is unchanged — only the outline is fixed.
 *
 * Consecutive `li` blocks are grouped into one <ul> so lists are real lists
 * rather than paragraphs that happen to start with a number.
 */
export function RichBody({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = []
  let list: string[] = []

  const flush = (key: string) => {
    if (!list.length) return
    out.push(
      <ul key={key} className="my-5 list-disc space-y-2 pl-6 text-neutral-700">
        {list.map((t, i) => (
          <li key={i} className="leading-relaxed">
            {t}
          </li>
        ))}
      </ul>
    )
    list = []
  }

  blocks.forEach((b, i) => {
    if (b.t === 'li') {
      list.push(b.text)
      return
    }
    flush(`ul-${i}`)

    if (b.t === 'h2') {
      out.push(
        <h2
          key={i}
          className="mt-12 font-display text-2xl text-ocean-700 sm:text-3xl"
        >
          {b.text}
        </h2>
      )
    } else if (b.t === 'h3') {
      out.push(
        <h3 key={i} className="mt-8 font-display text-xl text-ocean-700">
          {b.text}
        </h3>
      )
    } else {
      out.push(
        <p key={i} className="mt-4 text-base leading-relaxed text-neutral-700">
          {b.text}
        </p>
      )
    }
  })
  flush('ul-end')

  return <div>{out}</div>
}
