import ScrollLink from "../navigation/ScrollLink";
import { Link } from "react-router-dom";
import { ArrowUpRight, Users } from "lucide-react";
import useReveal from "../../hooks/useReveal";
import SectionHeader from "../ui/SectionHeader";
import LazyImage from "../ui/LazyImage";
import { teamProfilePath } from "../../utils/team";

function TeamCard({ member }) {
  return (
    <Link
      to={teamProfilePath(member)}
      className="team-card group relative block overflow-hidden rounded-2xl border border-brand-ink/8 bg-brand-ink shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:rounded-[1.75rem]"
      aria-label={`View ${member.name}'s profile`}
    >
      <LazyImage
        src={member.imageUrl}
        alt={member.name}
        aspectClass="aspect-[3/4] w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">{member.name}</h3>
        <p className="mt-1 text-xs font-semibold leading-snug text-white/90 sm:text-sm">
          {member.position}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-brand-red-light opacity-0 transition group-hover:opacity-100">
          View profile <ArrowUpRight size={13} />
        </span>
      </div>
    </Link>
  );
}

export default function TeamSection({ team = [] }) {
  const { ref, className } = useReveal();
  const coreTeam = team.slice(0, 4);

  return (
    <section id="team" className="section-pad content-auto scroll-mt-28 border-t border-brand-ink/5 bg-white">
      <div ref={ref} className={`reveal mx-auto max-w-7xl ${className}`}>
        <SectionHeader
          label="Leadership"
          title="Core Leadership Team"
          description="Four leaders guiding conservation, media, operations, and creative production at Mr Vilz."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {coreTeam.map((member) => (
            <TeamCard key={member.id || member.name} member={member} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center text-center">
          <p className="max-w-md text-sm text-brand-brown-lt">
            Click a photo to open the full profile with bio, role details, and more.
          </p>
          <ScrollLink
            to="/team-members"
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-brand-ink px-6 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-ink hover:text-white"
          >
            <Users size={16} /> Our Team Members <ArrowUpRight size={16} />
          </ScrollLink>
        </div>
      </div>
    </section>
  );
}
