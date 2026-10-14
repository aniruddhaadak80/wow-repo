import type { GlossaryTerm } from '@/lib/glossary'

/**
 * One glossary term. Shared by the server-rendered list and the live search
 * results so the markup can never drift between the two.
 *
 * `onSelect` is only passed from the search island: in search results a
 * "see also" link becomes a button that runs the referenced term through the
 * same search box, which is more useful than an anchor into a list that is
 * hidden while you are searching. Without it the links are plain anchors, so
 * the server-rendered glossary works with JavaScript off.
 */
export function GlossaryEntry({
  item,
  onSelect,
}: {
  item: GlossaryTerm
  onSelect?: (term: string) => void
}) {
  return (
    <div id={item.term} className="scroll-mt-24">
      <dt className="text-ink font-semibold tracking-tight">{item.term}</dt>
      <dd className="mt-1">
        <p className="text-muted text-sm leading-relaxed">{item.definition}</p>
        {item.detail && <p className="text-muted mt-2 text-sm leading-relaxed">{item.detail}</p>}
        {item.seeAlso && item.seeAlso.length > 0 && (
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="mono-label">See also</span>
            {item.seeAlso.map((ref) =>
              onSelect ? (
                <button
                  key={ref}
                  type="button"
                  onClick={() => onSelect(ref)}
                  className="text-muted hover:text-accent cursor-pointer font-mono transition-colors"
                >
                  {ref}
                </button>
              ) : (
                <a
                  key={ref}
                  href={`#${ref}`}
                  className="text-muted hover:text-accent font-mono transition-colors"
                >
                  {ref}
                </a>
              ),
            )}
          </p>
        )}
      </dd>
    </div>
  )
}
