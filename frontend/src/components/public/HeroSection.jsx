import { ArrowRight } from "lucide-react";
import ScrollLink from "../navigation/ScrollLink";
import HeroTypewriter from "./HeroTypewriter";

function HeroMedia({ hero }) {
  if (hero.mediaType === "video" && hero.mediaUrl) {
    return (
      <video
        className="h-full w-full scale-105 object-cover"
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
      className="h-full w-full scale-105 object-cover"
      src={hero.mediaUrl}
      alt={hero.mediaAlt}
      fetchPriority="high"
      decoding="async"
    />
  );
}

function HeroCta({ action, variant = "primary" }) {
  const label = action.label;
  const href = action.href;
  const isPrimary = variant === "primary";

  const className = isPrimary
    ? "inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-ink shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition hover:bg-brand-cream hover:shadow-[0_6px_28px_rgba(0,0,0,0.25)] sm:px-8"
    : "inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/15 sm:px-8";

  const content = (
    <>
      {label}
      {isPrimary ? <ArrowRight size={18} aria-hidden /> : null}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <ScrollLink to={href} className={className}>
        {content}
      </ScrollLink>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}

export default function HeroSection({ hero }) {
  const primary = {
    label: hero.primaryAction?.label || "Be Involved",
    href: hero.primaryAction?.href || "#projects"
  };

  const secondaryHref = hero.secondaryAction?.href;
  const secondary = {
    label:
      hero.secondaryAction?.label && secondaryHref !== "#about"
        ? hero.secondaryAction.label
        : "Contact",
    href: secondaryHref && secondaryHref !== "#about" ? secondaryHref : "/contact"
  };

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-brand-ink">
      <div className="absolute inset-0">
        <HeroMedia hero={hero} />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-brand-ink/40 to-brand-ink/95"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(196,30,58,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent"
        aria-hidden
      />

      <div className="hero-enter relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-5 pb-44 pt-32 sm:pb-48 sm:pt-36 lg:px-8 lg:pb-52">
        <div className="max-w-3xl">
          {hero.eyebrow ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm sm:text-xs">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red-light" aria-hidden />
              {hero.eyebrow}
            </p>
          ) : null}

          <h1 className="mt-5 font-display text-[clamp(2.75rem,9vw,5.25rem)] font-extrabold leading-[0.95] tracking-tight text-white sm:mt-6">
            {hero.title || "Mr Vilz"}
          </h1>

          {hero.subtitle ? (
            <HeroTypewriter
              text={hero.subtitle}
              className="mt-5 min-h-[3.25rem] max-w-xl text-base leading-relaxed text-white/85 sm:mt-6 sm:min-h-[1.75rem] sm:text-lg sm:leading-relaxed"
            />
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <HeroCta action={primary} variant="primary" />
            <HeroCta action={secondary} variant="secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
