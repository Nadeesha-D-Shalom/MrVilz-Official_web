import { Users, Waves, TreePine, Radio } from "lucide-react";

const statIcons = {
  volunteers: Users,
  cleanups: Waves,
  trees: TreePine,
  followers: Radio
};

export default function StatsSection({ stats = [], variant = "hero" }) {
  if (!stats.length) return null;

  const isHero = variant === "hero";

  return (
    <section
      className={
        isHero
          ? "pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-6 sm:px-5 lg:px-8 lg:pb-8"
          : "border-t border-brand-ink/5 bg-white px-5 py-12 lg:px-8"
      }
      aria-label="Impact statistics"
    >
      <div
        className={`mx-auto grid max-w-7xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 ${
          isHero ? "pointer-events-auto" : ""
        }`}
      >
        {stats.map((stat, index) => (
          <StatCell
            key={stat.id || stat.statKey || stat.stat_key}
            stat={stat}
            hero={isHero}
            style={{ "--stat-i": index }}
          />
        ))}
      </div>
    </section>
  );
}

function StatCell({ stat, hero, style }) {
  const key = stat.statKey || stat.stat_key;
  const Icon = statIcons[key] || Users;
  const value = `${Number(stat.value).toLocaleString()}${stat.suffix || ""}`;

  return (
    <article
      className={`stat-item flex items-center gap-3 rounded-2xl border px-4 py-4 sm:gap-4 sm:px-5 sm:py-5 ${
        hero
          ? "border-white/25 bg-brand-ink/55 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-md"
          : "border-brand-ink/8 bg-white shadow-sm"
      }`}
      style={style}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
          hero ? "bg-black/25 text-white" : "bg-brand-ink/5 text-brand-ink"
        }`}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p
          className={`truncate text-[10px] font-bold uppercase tracking-wider sm:text-[11px] ${
            hero ? "text-white/70" : "text-brand-brown-lt"
          }`}
        >
          {stat.label}
        </p>
        <p
          className={`font-display text-xl font-extrabold leading-none sm:text-2xl ${
            hero ? "text-white" : "text-brand-ink"
          }`}
        >
          {value}
        </p>
      </div>
    </article>
  );
}
