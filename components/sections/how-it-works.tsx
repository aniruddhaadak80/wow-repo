import Image from 'next/image'
import { CopyButton } from '@/components/copy-button'

const STEPS = [
  {
    title: 'Install',
    body: 'One lockfile pins Next 16, React 19, Tailwind 4, and Motion. There is nothing else to configure.',
    command: 'bun install',
  },
  {
    title: 'Run',
    body: 'Turbopack compiles while you type. The page is interactive before the terminal finishes its first sweep.',
    command: 'bun run dev',
  },
  {
    title: 'Check',
    body: 'Typecheck, lint, format, tests, and a production build, in that order. CI runs the same command.',
    command: 'bun run check',
  },
  {
    title: 'Deploy',
    body: 'The output is static. Push to main and the catalog is served from the edge with no server to babysit.',
    command: 'vercel deploy --prod',
  },
] as const

export function HowItWorks() {
  return (
    <section id="how" className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">From clone to deploy.</h2>
          <p className="text-muted mt-5 max-w-[42ch] text-lg leading-relaxed">
            Four commands take this repository from an empty directory to a live URL. No server, no
            database, no secrets.
          </p>
          <figure className="border-line relative mt-8 hidden overflow-hidden rounded-2xl border lg:block">
            <Image
              src="https://picsum.photos/seed/warmup-terminal-desk/800/560?grayscale"
              alt="A desk with a keyboard, a notebook, and a monitor showing a diff"
              width={800}
              height={560}
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </figure>
        </div>

        <ol className="border-line divide-line divide-y border-y">
          {STEPS.map((step) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 py-7 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
            >
              <div className="max-w-[52ch]">
                <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="text-muted mt-2 leading-relaxed">{step.body}</p>
              </div>
              <div className="border-line bg-elevated flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3">
                <code className="text-ink font-mono text-xs">{step.command}</code>
                <CopyButton text={step.command} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
