import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  GraduationCap,
  Mail,
  Sparkles
} from "lucide-react";
import api from "../../api/client";
import { mergeTeamProfile } from "../../config/teamProfiles";
import { useSite } from "../../context/SiteDataContext";
import { teamMemberSlug } from "../../utils/team";
import LazyImage from "../../components/ui/LazyImage";

const TAG_ORBIT = [
  "top-0 left-0 -translate-x-1 sm:translate-x-0",
  "top-1 right-0 translate-x-1 sm:translate-x-0",
  "left-0 top-[20%] -translate-x-full",
  "right-0 top-[20%] translate-x-full",
  "left-0 bottom-[22%] -translate-x-full",
  "bottom-0 right-0 translate-x-1 sm:translate-x-0"
];

function FloatingTag({ tag, delay = 0, orbitClass }) {
  const Icon = tag.icon;
  return (
    <span
      className={`profile-float-tag absolute hidden max-w-[11rem] rounded-full border border-white/70 bg-white/95 px-3 py-2 text-xs font-bold text-brand-ink shadow-lg backdrop-blur-sm sm:inline-flex sm:items-center sm:gap-2 ${orbitClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
        <Icon size={14} />
      </span>
      {tag.label}
    </span>
  );
}

function SocialLinksRow({ links }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-ink/10 bg-white px-3.5 py-2 text-xs font-bold text-brand-ink transition hover:border-brand-red/30 hover:text-brand-red"
          >
            <Icon size={15} />
            {link.label}
          </a>
        );
      })}
    </div>
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
      <main className="flex min-h-screen items-center justify-center bg-brand-cream">
        <div className="h-12 w-12 animate-pulse rounded-full bg-brand-parchment" />
      </main>
    );
  }

  if (notFound || !profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-5 text-center">
        <h1 className="font-display text-3xl font-extrabold text-brand-ink">Profile not found</h1>
        <p className="mt-3 max-w-md text-brand-brown-lt">
          This team member profile does not exist or is no longer available.
        </p>
        <Link
          to="/team-members"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft size={16} /> Back to team
        </Link>
      </main>
    );
  }

  const hasContact = profile.email || profile.socialLinks.length > 0;

  return (
    <main className="min-h-screen bg-white">
      <section className="profile-hero relative overflow-x-clip pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="profile-hero-bg absolute inset-0" aria-hidden />

        <Link
          to="/team-members"
          className="absolute left-5 top-24 z-20 inline-flex items-center gap-2 rounded-full border border-brand-ink/10 bg-white/90 px-3.5 py-2 text-sm font-semibold text-brand-brown-lt shadow-sm backdrop-blur-sm transition hover:border-brand-ink/20 hover:text-brand-ink sm:left-8 sm:top-28 lg:left-10"
        >
          <ArrowLeft size={16} /> All team members
        </Link>

        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex flex-col items-center pt-6 text-center sm:pt-8">
            <div className="profile-photo-stage relative mx-auto h-[min(92vw,400px)] w-[min(92vw,400px)] sm:h-[460px] sm:w-[460px]">
              {profile.tags.map((tag, index) => (
                <FloatingTag
                  key={tag.label}
                  tag={tag}
                  delay={index * 120}
                  orbitClass={TAG_ORBIT[index % TAG_ORBIT.length]}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 z-10 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[6px] border-white shadow-[0_30px_80px_rgba(26,16,8,0.18)]">
                <LazyImage src={profile.imageUrl} alt={profile.name} aspectClass="h-full w-full" />
              </div>
            </div>

            <p className="mt-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
              <Sparkles size={14} />
              Hi there, I&apos;m {profile.greetingName}
            </p>

            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-brand-ink">
              {profile.name}
            </h1>

            <p className="mt-3 text-sm font-semibold text-brand-red sm:text-base">{profile.position}</p>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-brand-brown-lt sm:text-base">
              {profile.summary}
            </p>

            {profile.highlights?.length > 0 ? (
              <ul className="mt-6 max-w-xl space-y-2 text-left sm:text-center">
                {profile.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start justify-center gap-2 text-sm text-brand-brown-lt sm:justify-center"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {hasContact ? (
              <div className="mt-10 w-full max-w-3xl border-t border-brand-ink/10 pt-8">
                {profile.email ? (
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-brown-lt">
                        Let&apos;s get in touch
                      </p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink hover:text-brand-red"
                      >
                        {profile.email}
                      </a>
                    </div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red-mid"
                      aria-label={`Email ${profile.name}`}
                    >
                      <Mail size={20} />
                    </a>
                  </div>
                ) : null}

                {profile.socialLinks.length > 0 ? (
                  <div className={profile.email ? "mt-8" : ""}>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-brown-lt">
                      Follow me
                    </p>
                    <SocialLinksRow links={profile.socialLinks} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {profile.education ? (
              <div className="mt-8 flex w-full max-w-3xl items-start justify-center gap-3 rounded-2xl border border-brand-ink/8 bg-brand-cream/60 px-5 py-4 text-left sm:justify-start">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-red shadow-sm">
                  <GraduationCap size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-brown-lt">
                    Education
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-brand-ink">
                    {profile.education}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-ink/8 bg-brand-cream/40 px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-red">MrVilz</p>
          <h2 className="mt-2 font-display text-xl font-extrabold text-brand-ink sm:text-2xl">
            Explore more
          </h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-ink/10 bg-white px-5 py-3 text-sm font-bold text-brand-ink transition hover:border-brand-red/30 hover:bg-brand-red/5"
            >
              View gallery <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/join"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-brown"
            >
              Become a member <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/#team"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-ink/10 bg-white px-5 py-3 text-sm font-bold text-brand-ink transition hover:border-brand-ink/20"
            >
              Core team <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
