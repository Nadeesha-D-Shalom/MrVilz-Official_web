import { lazy, Suspense } from "react";
import ScrollLink from "../../components/navigation/ScrollLink";
import { ArrowUpRight, Image, Briefcase, UserPlus } from "lucide-react";
import HeroSection from "../../components/public/HeroSection";
import StatsSection from "../../components/public/StatsSection";
import useReveal from "../../hooks/useReveal";
import { useSite } from "../../context/SiteDataContext";

const AboutSection = lazy(() => import("../../components/public/AboutSection"));
const ProjectsSection = lazy(() => import("../../components/public/ProjectsSection"));
const TeamSection = lazy(() => import("../../components/public/TeamSection"));
const AiDiscoverSection = lazy(() => import("../../components/public/AiDiscoverSection"));

function SectionFallback() {
  return <div className="section-pad mx-auto max-w-7xl animate-pulse rounded-2xl bg-brand-parchment/60 h-64" />;
}

const exploreCards = [
  { to: "/gallery", title: "Gallery", desc: "Campaigns, cleanups & field moments.", icon: Image },
  { to: "/careers", title: "Careers", desc: "Apply for roles with CV.", icon: Briefcase },
  { to: "/join", title: "Become a Member", desc: "Quick sign-up — personal details only.", icon: UserPlus }
];

export default function HomePage() {
  const { data } = useSite();
  const { ref, className } = useReveal();

  return (
    <div className="overflow-x-clip">
      <div className="relative">
        <HeroSection hero={data.hero} />
        <StatsSection stats={data.stats} variant="hero" />
      </div>

      <Suspense fallback={<SectionFallback />}>
        <AboutSection about={data.about} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ProjectsSection projects={data.projects} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TeamSection team={data.team} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AiDiscoverSection />
      </Suspense>

      <section className="content-auto border-t border-brand-ink/5 bg-brand-cream px-5 py-12 lg:px-8">
        <div ref={ref} className={`reveal mx-auto max-w-7xl ${className}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-brown-lt">
                Explore
              </p>
              <h2 className="mt-1 font-display text-xl font-extrabold sm:text-2xl">Go deeper</h2>
            </div>
            <ScrollLink
              to="/contact"
              className="shrink-0 rounded-full border border-brand-ink/15 bg-white px-4 py-2 text-xs font-bold text-brand-ink transition hover:bg-brand-ink hover:text-white sm:text-sm"
            >
              Contact
            </ScrollLink>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
            {exploreCards.map((card) => {
              const Icon = card.icon;
              return (
                <ScrollLink
                  key={card.to}
                  to={card.to}
                  className="group flex items-center gap-3 rounded-xl border border-brand-ink/8 bg-white px-3 py-3 shadow-sm transition hover:border-brand-ink/15 hover:shadow-md sm:px-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-cream">
                    <Icon className="text-brand-ink" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-bold text-brand-ink">{card.title}</h3>
                    <p className="truncate text-xs text-brand-brown-lt">{card.desc}</p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-brand-brown-lt transition group-hover:text-brand-ink"
                  />
                </ScrollLink>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
