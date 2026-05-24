import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Mail } from "lucide-react";
import api from "../../api/client";
import { mergeTeamProfile } from "../../config/teamProfiles";
import { useSite } from "../../context/SiteDataContext";
import { teamMemberSlug } from "../../utils/team";

function SocialIconRow({ links, variant = "dark" }) {
  if (!links?.length) return null;
  const isLight = variant === "light";

  return (
    <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
              isLight
                ? "bg-white/15 text-white hover:bg-white/25"
                : "bg-brand-ink/5 text-brand-ink hover:bg-brand-red/10 hover:text-brand-red"
            }`}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}

function DetailRow({ label, children }) {
  if (!children) return null;
  return (
    <p className="text-sm leading-relaxed text-brand-brown">
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

      const fromSite = siteData?.team?.find((m) => teamMemberSlug(m) === slug);
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
    return () => {
      cancelled = true;
    };
  }, [slug, siteData?.team]);

  const profile = mergeTeamProfile(member);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0ebe3] px-5 pb-16 pt-28">
        <div className="mx-auto max-w-6xl animate-pulse space-y-8">
          <div className="mx-auto h-10 w-48 rounded-lg bg-brand-parchment" />
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="order-1 h-80 rounded bg-brand-parchment lg:order-3 lg:col-span-4" />
            <div className="order-2 h-48 rounded bg-brand-parchment lg:order-1 lg:col-span-3" />
            <div className="order-3 h-64 rounded bg-brand-parchment lg:order-2 lg:col-span-5" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f0ebe3] px-5 text-center">
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

  return (
    <main className="min-h-screen bg-[#f0ebe3] pb-16 pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Link
          to="/team-members"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-brown-lt transition hover:text-brand-ink"
        >
          <ArrowLeft size={16} /> All team members
        </Link>

        <header className="mb-10 text-center lg:mb-14">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand-red sm:text-5xl lg:text-6xl">
            Profile
          </h1>
          <p className="mt-3 text-base font-medium text-brand-ink sm:text-lg">
            I&apos;m {profile.position}
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10 lg:items-start">
          {/* Card — top on mobile, right on desktop */}
          <aside className="order-1 lg:order-3 lg:col-span-4">
            <div className="relative mx-auto w-full max-w-xs pt-14 sm:max-w-sm lg:mx-0 lg:max-w-none lg:pt-16">
              <div className="absolute left-1/2 top-0 z-10 h-28 w-28 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white bg-brand-parchment shadow-lg sm:h-32 sm:w-32">
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="rounded-sm bg-brand-red px-6 pb-8 pt-20 text-center text-white shadow-xl sm:px-8 sm:pt-24">
                <p className="font-display text-lg font-extrabold uppercase tracking-wide sm:text-xl">
                  Hello, I&apos;m {profile.greetingName}
                </p>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/90">
                  {profile.summary}
                </p>
                {profile.socialLinks.length > 0 ? (
                  <div className="mt-8">
                    <SocialIconRow links={profile.socialLinks} variant="light" />
                  </div>
                ) : null}
              </div>
            </div>

            <ul className="mx-auto mt-6 max-w-xs space-y-2.5 text-sm text-brand-brown lg:mx-0 lg:max-w-none">
              {profile.email ? (
                <li className="flex items-center gap-2">
                  <Mail size={16} className="shrink-0 text-brand-red" />
                  <a href={`mailto:${profile.email}`} className="truncate hover:text-brand-red">
                    {profile.email}
                  </a>
                </li>
              ) : null}
              <li className="flex items-center gap-2">
                <Briefcase size={16} className="shrink-0 text-brand-red" />
                <span>Mr Vilz</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0 text-brand-red" />
                <span>Sri Lanka</span>
              </li>
            </ul>
          </aside>

          {/* Details — left on desktop */}
          <section className="order-2 lg:order-1 lg:col-span-3">
            <h2 className="font-display text-xl font-bold text-brand-ink sm:text-2xl">Details</h2>
            <div className="mt-5 space-y-3">
              <DetailRow label="Name">{profile.name}</DetailRow>
              <DetailRow label="Role">{profile.position}</DetailRow>
              {profile.education ? (
                <DetailRow label="Education">{profile.education}</DetailRow>
              ) : null}
              {profile.email ? (
                <p className="text-sm leading-relaxed text-brand-brown">
                  <span className="font-bold text-brand-ink">Email: </span>
                  <a href={`mailto:${profile.email}`} className="break-all hover:text-brand-red">
                    {profile.email}
                  </a>
                </p>
              ) : null}
              <DetailRow label="Location">Sri Lanka</DetailRow>
            </div>
            {profile.socialLinks.length > 0 ? (
              <div className="mt-8 hidden lg:block">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-brown-lt">
                  Connect
                </p>
                <SocialIconRow links={profile.socialLinks} variant="dark" />
              </div>
            ) : null}
          </section>

          {/* About — center on desktop */}
          <section className="order-3 lg:order-2 lg:col-span-5">
            <h2 className="font-display text-xl font-bold text-brand-ink sm:text-2xl">About me</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-brand-brown sm:text-base">
              {aboutParagraphs.map((para) => (
                <p key={para.slice(0, 48)} className="text-justify">
                  {para}
                </p>
              ))}
              {profile.highlights?.length > 0 ? (
                <ul className="space-y-2 border-t border-brand-ink/10 pt-4">
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
              className="mt-8 inline-flex w-full justify-center rounded-full border-2 border-brand-red bg-white px-8 py-3 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-red hover:text-white sm:w-auto"
            >
              Contact me
            </a>
          </section>
        </div>

        <footer className="mt-16 border-t border-brand-ink/10 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-red">Mr Vilz</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/team-members"
              className="text-sm font-semibold text-brand-brown-lt hover:text-brand-ink"
            >
              All team members
            </Link>
            <span className="text-brand-parchment">·</span>
            <Link to="/contact" className="text-sm font-semibold text-brand-brown-lt hover:text-brand-ink">
              Contact Mr Vilz
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
