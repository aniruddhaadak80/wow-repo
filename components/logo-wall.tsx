const STACK = [
  { name: 'Next.js', slug: 'nextdotjs' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'React', slug: 'react' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Tailwind CSS', slug: 'tailwindcss' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'GitHub', slug: 'github' },
  { name: 'Bun', slug: 'bun' },
  { name: 'PostgreSQL', slug: 'postgresql' },
  { name: 'Figma', slug: 'figma' },
] as const

import Image from 'next/image'

/**
 * The single marquee on the page (marquee max-one-per-page rule).
 * Pure CSS animation, paused on hover, disabled under reduced motion.
 */
export function LogoWall() {
  return (
    <section
      aria-label="Works with the stack you already use"
      className="border-line border-y py-10"
    >
      <p className="mono-label mb-6 text-center">Runs on the stack you already use</p>
      <div className="marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-14 pr-14 hover:[animation-play-state:paused]">
          {[...STACK, ...STACK].map((item, i) => (
            <span
              key={`${item.name}-${i}`}
              className="text-muted flex items-center gap-2.5"
              aria-hidden={i >= STACK.length}
            >
              <Image
                src={`https://cdn.simpleicons.org/${item.slug}`}
                alt={item.name}
                width={24}
                height={24}
                loading="lazy"
                unoptimized
                className="marquee-logo h-6 w-6"
              />
              <span className="font-mono text-sm">{item.name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
