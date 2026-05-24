import ScrollLink from "../navigation/ScrollLink";

const heroBtn =
  "inline-flex shrink-0 items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition sm:px-7";

function HeroMedia({ hero }) {
  if (hero.mediaType === "video" && hero.mediaUrl) {
    return (
      <video
        className="h-full w-full object-cover"
        src={hero.mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      className="h-full w-full object-cover"
      src={hero.mediaUrl}
      alt={hero.mediaAlt}
      fetchPriority="high"
      decoding="async"
    />
  );
}

export default function HeroSection({ hero }) {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-brand-ink">
      <div className="absolute inset-0">
        <HeroMedia hero={hero} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/75 via-brand-ink/35 to-brand-ink/90" />

      <div className="hero-enter relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-36 pt-40 sm:pb-40 lg:px-8 lg:pb-44">
        <p className="mb-4 inline-flex w-fit rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90">
          {hero.eyebrow}
        </p>

        <h1 className="max-w-5xl font-display text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight text-white">
          {hero.title || "Mr Vilz"}
        </h1>

        <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">{hero.subtitle}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={hero.primaryAction?.href || "#projects"}
            className={`${heroBtn} bg-white text-brand-ink shadow-md hover:bg-brand-cream`}
          >
            {hero.primaryAction?.label || "Be Involved"}
          </a>
          <ScrollLink
            to="/discover"
            className={`${heroBtn} border-2 border-white/50 bg-brand-ink/30 text-white backdrop-blur-sm hover:border-white hover:bg-brand-ink/50`}
          >
            AI Discover
          </ScrollLink>
          <a
            href={hero.secondaryAction?.href || "#about"}
            className={`${heroBtn} border-2 border-white/35 bg-transparent text-white hover:border-white/60 hover:bg-white/10`}
          >
            {hero.secondaryAction?.label || "About Us"}
          </a>
        </div>
      </div>
    </section>
  );
}
