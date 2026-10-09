import Image from 'next/image'

export function PhotoBand() {
  return (
    <section
      aria-label="A studio workspace in soft light"
      className="relative h-[62vh] min-h-[480px] overflow-hidden"
    >
      <Image
        src="https://picsum.photos/seed/wow-studio-light/2000/1200"
        alt="A quiet studio workspace with soft light across a desk"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-zinc-950/60" />
      <div className="container-x absolute inset-0 flex items-end pb-16">
        <figure className="max-w-[36ch]">
          <blockquote className="text-2xl leading-[1.25] font-medium tracking-tight text-white md:text-3xl">
            The best interfaces <em className="text-accent">disappear</em>. The skills behind them
            should take one command to install.
          </blockquote>
          <figcaption className="mono-label mt-5 text-white/70">
            Aniruddha Adak, AI Agent Engineer
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
