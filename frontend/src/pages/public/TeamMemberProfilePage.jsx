import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Mail } from "lucide-react";
import api from "../../api/client";
import { mergeTeamProfile } from "../../config/teamProfiles";
import { useSite } from "../../context/SiteDataContext";
import { teamMemberSlug } from "../../utils/team";

function SocialIconRow({ links, variant = "dark", compact = false }) {
  if (!links?.length) return null;
  const isLight = variant === "light";
  const size = compact ? "h-8 w-8" : "h-9 w-9";
  const iconSize = compact ? 15 : 17;

  return (
    <div className="flex flex-wrap gap-1.5 lg:gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`inline-flex ${size} items-center justify-center rounded-full transition ${
              isLight
                ? "bg-white/15 text-white hover:bg-white/25"
                : "bg-brand-ink/5 text-brand-ink hover:bg-brand-red/10 hover:text-brand-red"
            }`}
          >
            <Icon size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}

function DetailRow({ label, children }) {
  if (!children) return null;
  return (
    <p className="text-[13px] leading-snug text-brand-brown">
      <span className="font-bold text-brand-ink">{label}: </span>
      {children}
    </p>
  );
}

export default function TeamMemberProfilePage() {
  const { slug } = useParams();
  const { data: siteData } = useSite();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);

      const fromSite =
        siteData?.team?.find((m) => teamMemberSlug(m) === slug) ||
        siteData?.teamMembers?.find((m) => teamMemberSlug(m) === slug);
      if (fromSite) {
        if (!cancelled) {
          setMember(fromSite);
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await api.get(`/public/team/${slug}`);
        if (!cancelled) setMember(data.member);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [slug, siteData?.team]);

  const profile = mergeTeamProfile(member);

  if (loading) {
    return (
      <main className="flex h-[100svh] flex-col overflow-hidden bg-[#f0ebe3] px-4 pt-[calc(4.25rem+env(safe-area-inset-top))] pb-4 lg:px-6">
        <div className="mx-auto flex h-full w-full max-w-7xl animate-pulse flex-col">
          <div className="h-4 w-36 rounded bg-brand-parchment" />
          <div className="mt-3 h-9 w-64 rounded bg-brand-parchment" />
          <div className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-12">
            <div className="rounded bg-brand-parchment lg:col-span-3" />
            <div className="rounded bg-brand-parchment lg:col-span-5" />
            <div className="rounded bg-brand-parchment lg:col-span-4" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !profile) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center bg-[#f0ebe3] px-5 text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-ink">Profile not found</h1>
        <Link
          to="/team-members"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft size={16} /> Back to team
        </Link>
      </main>
    );
  }

  const aboutParagraphs = [profile.summary, member?.bio].filter(
    (p, i, arr) => p && arr.indexOf(p) === i
  );
  const contactHref = profile.email ? `mailto:${profile.email}` : "/contact";
  const roleLine = profile.position;

  return (
    <main className="min-h-[100svh] bg-[#f0ebe3] lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 pt-[calc(4.25rem+env(safe-area-inset-top))] pb-8 sm:px-5 lg:flex lg:h-full lg:flex-col lg:px-6 lg:pb-4">
        <Link
          to="/team-members"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand-brown-lt transition hover:text-brand-ink"
        >
          <ArrowLeft size={15} aria-hidden />
          All team members
        </Link>

        <header className="mt-2 shrink-0 sm:mt-2.5">
          <h1 className="font-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-extrabold leading-tight tracking-tight text-brand-red">
            {profile.name}
          </h1>
          <p className="mt-1 text-[13px] font-medium leading-snug text-brand-ink sm:text-sm">
            I&apos;m {roleLine}
          </p>
        </header>

        <div className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-4 sm:mt-3.5 lg:grid-cols-12 lg:gap-5 lg:overflow-hidden">
          {/* Details — left on desktop */}
          <section className="order-2 flex min-h-0 flex-col lg:order-1 lg:col-span-3 lg:pr-1">
            <h2 className="shrink-0 font-display text-base font-bold text-brand-ink">Details</h2>
            <div className="mt-2 space-y-1.5 overflow-hidden">
              <DetailRow label="Name">{profile.name}</DetailRow>
              <DetailRow label="Role">{profile.position}</DetailRow>
              {profile.education ? (
                <DetailRow label="Education">{profile.education}</DetailRow>
              ) : null}
              {profile.email ? (
                <p className="text-[13px] leading-snug text-brand-brown">
                  <span className="font-bold text-brand-ink">Email: </span>
                  <a href={`mailto:${profile.email}`} className="break-all hover:text-brand-red">
                    {profile.email}
                  </a>
                </p>
              ) : null}
              <DetailRow label="Location">Sri Lanka</DetailRow>
            </div>
            {profile.socialLinks.length > 0 ? (
              <div className="mt-3 shrink-0">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-brown-lt">
                  Connect
                </p>
                <SocialIconRow links={profile.socialLinks} variant="dark" compact />
              </div>
            ) : null}
          </section>

          {/* About — center on desktop */}
          <section className="order-3 flex min-h-0 flex-col lg:order-2 lg:col-span-5">
            <h2 className="shrink-0 font-display text-base font-bold text-brand-ink">About me</h2>
            <div className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-[13px] leading-snug text-brand-brown [scrollbar-width:thin] sm:text-sm sm:leading-relaxed lg:pr-0">
              {aboutParagraphs.map((para) => (
                <p key={para.slice(0, 48)} className="text-justify lg:line-clamp-[5]">
                  {para}
                </p>
              ))}
              {profile.highlights?.length > 0 ? (
                <ul className="space-y-1 border-t border-brand-ink/10 pt-2 lg:line-clamp-[4]">
                  {profile.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-red" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <a
              href={contactHref}
              className="mt-2 inline-flex w-fit shrink-0 rounded-full border-2 border-brand-red bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-red hover:text-white sm:text-xs"
            >
              Contact me
            </a>
          </section>

          {/* Portrait card — right on desktop, top on mobile */}
          <aside className="order-1 flex min-h-0 flex-col lg:order-3 lg:col-span-4">
            <div className="relative mx-auto w-full max-w-[220px] shrink-0 pt-10 lg:mx-0 lg:max-w-none lg:pt-11">
              <div className="absolute left-1/2 top-0 z-10 h-[4.5rem] w-[4.5rem] -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-white bg-brand-parchment shadow-md">
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  width={72}
                  height={72}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="rounded-sm bg-brand-red px-4 pb-5 pt-14 text-center text-white shadow-lg sm:px-5 sm:pt-16">
                <p className="font-display text-sm font-extrabold uppercase tracking-wide sm:text-base">
                  Hello, I&apos;m {profile.greetingName}
                </p>
                <p className="mx-auto mt-2 line-clamp-3 text-[12px] leading-snug text-white/90 sm:text-[13px]">
                  {profile.summary}
                </p>
                {profile.socialLinks.length > 0 ? (
                  <div className="mt-4 flex justify-center">
                    <SocialIconRow links={profile.socialLinks} variant="light" compact />
                  </div>
                ) : null}
              </div>
            </div>

            <ul className="mt-2 hidden shrink-0 space-y-1 text-[12px] text-brand-brown lg:block">
              {profile.email ? (
                <li className="flex items-center gap-1.5">
                  <Mail size={14} className="shrink-0 text-brand-red" />
                  <a href={`mailto:${profile.email}`} className="truncate hover:text-brand-red">
                    {profile.email}
                  </a>
                </li>
              ) : null}
              <li className="flex items-center gap-1.5">
                <Briefcase size={14} className="shrink-0 text-brand-red" />
                <span>Mr Vilz</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={14} className="shrink-0 text-brand-red" />
                <span>Sri Lanka</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
