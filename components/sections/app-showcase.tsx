import { Database, DeviceMobile, HandTap } from '@phosphor-icons/react/ssr'
import { PhoneApp } from '@/components/phone-app'
import { InstallAppButton } from '@/components/install-app-button'

const PROOFS = [
  {
    icon: DeviceMobile,
    title: 'Installs like an app',
    body: 'Adds to your home screen and launches full-screen. No store, no review, no binary.',
  },
  {
    icon: HandTap,
    title: 'Built for thumbs',
    body: 'A bottom tab bar, 44px targets, and safe-area padding for the home indicator.',
  },
  {
    icon: Database,
    title: 'Runs the real catalog',
    body: 'The phone is not a picture. Every screen renders from the same data as this page.',
  },
] as const

/**
 * The app section. The phone on the left is a working mini-app over the real
 * skill catalog: search filters the list, rows open a detail screen, and the
 * install flow is the CLI sequence, timed. Inverted split (asset left, copy
 * right) so the page never repeats the same image-text rhythm twice in a row.
 */
export function AppShowcase() {
  return (
    <section id="app" className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[auto_1fr] lg:gap-20">
        <div className="flex flex-col items-center gap-5">
          <PhoneApp initialSlug="design-taste-frontend" />
          <p className="mono-label max-w-[34ch] text-center">
            A live mini-app over the real catalog. Search it, open a skill, run one. Install steps
            are a timed demo of the CLI.
          </p>
        </div>

        <div className="lg:order-first">
          <h2 className="max-w-[16ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
            The catalog, in your pocket.
          </h2>
          <p className="text-muted mt-5 max-w-[52ch] text-lg leading-relaxed">
            Install this site as an app and browse every skill from your phone. Same catalog, same
            data, no store.
          </p>

          <div className="mt-9">
            <InstallAppButton />
          </div>

          <ul className="border-line mt-12 space-y-8 border-t pt-10">
            {PROOFS.map((proof) => (
              <li key={proof.title} className="flex gap-4">
                <span className="border-line bg-elevated text-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border">
                  <proof.icon weight="regular" className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{proof.title}</h3>
                  <p className="text-muted mt-1 max-w-[48ch] text-sm leading-relaxed">
                    {proof.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
