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
    <div className="flex flex-wrap gap-1.5">
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
    <p className="text-sm leading-snug text-brand-brown">
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
      <main className="bg-[#f0ebe3] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-4 w-36 rounded bg-brand-parchment" />
          <div className="h-10 w-72 rounded bg-brand-parchment" />
          <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
            <div className="space-y-4">
              <div className="h-24 rounded bg-brand-parchment" />
              <div className="h-40 rounded bg-brand-parchment" />
            </div>
            <div className="h-64 rounded bg-brand-parchment" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !profile) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f0ebe3] px-5 text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-ink">Profile not found</h1>
        <Link
          to="/team-members"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft size={16} /> Back to team
        </Link>
      </main>
    );
  }

  const aboutParagraphs =
    profile.about?.length > 0
      ? profile.about
      : [profile.summary, member?.bio].filter((p, i, arr) => p && arr.indexOf(p) === i);
  const contactHref = profile.email ? `mailto:${profile.email}` : "/contact";
  const roleLine = profile.position;

  return (
    <main className="bg-[#f0ebe3] pb-12 sm:pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-[calc(4.5rem+env(safe-area-inset-top))] sm:px-6">
        <Link
          to="/team-members"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-brown-lt transition hover:text-brand-ink"
        >
          <ArrowLeft size={15} aria-hidden />
          All team members
        </Link>

        <header className="mt-4 border-b border-brand-ink/10 pb-5">
          <h1 className="font-display text-[clamp(1.875rem,5vw,2.5rem)] font-extrabold leading-tight tracking-tight text-brand-red">
            {profile.name}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-brand-ink sm:text-base">
            I&apos;m {roleLine}
          </p>
        </header>

        <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-10">
          {/* Main content — details + about */}
          <div className="order-2 space-y-8 lg:order-1">
            <section>
              <h2 className="font-display text-lg font-bold text-brand-ink">Details</h2>
              <div className="mt-3 space-y-2">
                <DetailRow label="Name">{profile.name}</DetailRow>
                <DetailRow label="Role">{profile.position}</DetailRow>
                {profile.education ? (
                  <DetailRow label="Education">{profile.education}</DetailRow>
                ) : null}
                {profile.email ? (
                  <p className="text-sm leading-snug text-brand-brown">
                    <span className="font-bold text-brand-ink">Email: </span>
                    <a href={`mailto:${profile.email}`} className="break-all hover:text-brand-red">
                      {profile.email}
                    </a>
                  </p>
                ) : null}
                <DetailRow label="Location">Sri Lanka</DetailRow>
                {profile.detailsExtras?.map((row) => (
                  <DetailRow key={row.label} label={row.label}>
                    {row.value}
                  </DetailRow>
                ))}
              </div>
              {profile.socialLinks.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-brown-lt">
                    Connect
                  </p>
                  <SocialIconRow links={profile.socialLinks} variant="dark" compact />
                </div>
              ) : null}
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-brand-ink">About me</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-brown sm:text-[15px]">
                {aboutParagraphs.map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
                {profile.highlights?.length > 0 ? (
                  <ul className="space-y-1.5 border-t border-brand-ink/10 pt-3">
                    {profile.highlights.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <a
                href={contactHref}
                className="mt-5 inline-flex rounded-full border-2 border-brand-red bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-red hover:text-white"
              >
                Contact me
              </a>
            </section>
          </div>

          {/* Portrait card */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-xl bg-brand-red shadow-lg lg:mx-0 lg:max-w-none">
              <div className="flex justify-center bg-brand-red px-5 pb-1 pt-6">
                <div className="h-[7.5rem] w-[7.5rem] shrink-0 overflow-hidden rounded-full border-4 border-white bg-brand-parchment shadow-md">
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    width={120}
                    height={120}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: profile.photoObjectPosition || "center 25%",
                      transform: profile.photoScale > 1 ? `scale(${profile.photoScale})` : undefined
                    }}
                  />
                </div>
              </div>

              <div className="px-5 pb-5 text-center text-white">
                <p className="font-display text-base font-extrabold uppercase tracking-wide">
                  Hello, I&apos;m {profile.greetingName}
                </p>
                <p className="mx-auto mt-2 text-[13px] leading-snug text-white/90">
                  {profile.cardSummary || profile.summary}
                </p>
                {profile.socialLinks.length > 0 ? (
                  <div className="mt-4 flex justify-center">
                    <SocialIconRow links={profile.socialLinks} variant="light" compact />
                  </div>
                ) : null}
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-brand-brown">
              {profile.email ? (
                <li className="flex items-center gap-2">
                  <Mail size={15} className="shrink-0 text-brand-red" />
                  <a href={`mailto:${profile.email}`} className="truncate hover:text-brand-red">
                    {profile.email}
                  </a>
                </li>
              ) : null}
              <li className="flex items-center gap-2">
                <Briefcase size={15} className="shrink-0 text-brand-red" />
                <span>Mr Vilz</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-brand-red" />
                <span>Sri Lanka</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
