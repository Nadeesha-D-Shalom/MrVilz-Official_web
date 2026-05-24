import { ArrowUpRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollLink from "../../components/navigation/ScrollLink";
import LazyImage from "../../components/ui/LazyImage";
import { useSite } from "../../context/SiteDataContext";
import { teamCardDisplayName, teamCardDisplayPosition, teamProfilePath } from "../../utils/team";

function TeamMemberCard({ member }) {
  const displayName = teamCardDisplayName(member);
  const displayRole = teamCardDisplayPosition(member);
  const blurb = member.shortDescription || member.bio || "";

  return (
    <Link
      to={teamProfilePath(member)}
      className="group overflow-hidden rounded-[1.75rem] border border-brand-ink/8 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {member.imageUrl ? (
        <LazyImage src={member.imageUrl} alt={member.name} aspectClass="aspect-[4/5] w-full" />
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-brand-parchment text-brand-brown-lt">
          <Users size={40} strokeWidth={1.5} />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <h2
          className="truncate whitespace-nowrap font-display text-base font-bold text-brand-ink sm:text-lg"
          title={member.name}
        >
          {displayName}
        </h2>
        <p
          className="mt-1 truncate whitespace-nowrap text-xs font-semibold text-brand-red sm:text-sm"
          title={displayRole}
        >
          {displayRole}
        </p>
        {blurb ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-brown-lt">{blurb}</p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-ink group-hover:text-brand-red">
          View profile <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}

export default function TeamMembersPage() {
  const { data, loading } = useSite();
  const teamMembers = data?.teamMembers || [];

  return (
    <main className="min-h-screen bg-brand-cream px-5 pb-20 pt-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">Our people</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-brand-ink sm:text-5xl">
            Team Members
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-brown-lt">
            More teammates will join Mr Vilz over time. Core leadership is featured on the homepage —
            this page highlights additional members as we grow.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="h-12 w-12 animate-pulse rounded-full bg-brand-parchment" />
          </div>
        ) : null}

        {!loading && teamMembers.length ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id || member.slug || member.name} member={member} />
            ))}
          </div>
        ) : null}

        {!loading && !teamMembers.length ? (
          <p className="mt-12 rounded-2xl border border-brand-ink/10 bg-white px-6 py-10 text-center text-brand-brown-lt">
            We are building our extended team. New members will appear here once added from the admin
            dashboard.
          </p>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-4">
          <ScrollLink
            to="/#team"
            className="inline-flex rounded-full bg-brand-ink px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-brown"
          >
            View core leadership on home
          </ScrollLink>
          <ScrollLink
            to="/join"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-ink px-7 py-3 text-sm font-bold text-brand-ink transition hover:bg-brand-ink hover:text-white"
          >
            <Users size={16} /> Become a member
          </ScrollLink>
        </div>
      </div>
    </main>
  );
}
