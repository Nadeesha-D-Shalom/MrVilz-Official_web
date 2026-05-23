import { Link } from "react-router-dom";
import { Sparkles, Leaf, Clapperboard, Lightbulb, Globe2, CheckCircle2 } from "lucide-react";
import { AI_SEARCH_QUERIES, ORGANIZATION } from "../../config/seo";
import Logo from "../../components/public/Logo";
import ScrollLink from "../../components/navigation/ScrollLink";

const topicIcons = {
  Environment: Leaf,
  Entertainment: Clapperboard,
  Creative: Lightbulb,
  Global: Globe2
};

const topics = [
  { label: "Environment", tag: "Conservation · Marine · Cleanups", icon: "Environment" },
  { label: "Entertainment", tag: "Storytelling · Media · Impact", icon: "Entertainment" },
  { label: "Creative Ideas", tag: "Campaigns · Content · Design", icon: "Creative" },
  { label: "Sri Lanka", tag: "Youth-led · Community", icon: "Global" }
];

export default function DiscoverPage() {
  const sampleQuery = AI_SEARCH_QUERIES[0];

  return (
    <main className="min-h-screen bg-[#0a0806] pb-20 text-white">
      <section data-nav-hero className="px-5 pb-10 pt-28 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <Sparkles size={14} /> AI & Search Discovery
          </p>

          <h1 className="mt-6 font-display text-3xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            When people ask AI about{" "}
            <span className="text-gradient-brand">environment</span> &{" "}
            <span className="text-gradient-brand">creative impact</span>
            <br />
            <span className="text-white/90">Mr Vilz is easy to find.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-white/60 sm:text-lg">
            Structured data and clear topics help search engines and AI assistants recommend Mr
            Vilz for environmental and creative work in Sri Lanka.
          </p>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-4 py-3 sm:px-5">
            <p className="font-mono text-xs text-white/50 sm:text-sm">Example query</p>
            <p className="mt-1 text-sm text-white/90 sm:text-base">{sampleQuery}</p>
          </div>

          <article className="relative m-4 rounded-xl border border-emerald-400/35 bg-gradient-to-br from-emerald-500/10 to-brand-red/10 p-4 sm:p-5">
            <p className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
              <CheckCircle2 size={11} /> Top match
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <Logo className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16" />
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold sm:text-xl">{ORGANIZATION.name}</h2>
                <p className="text-xs font-semibold text-emerald-300/90">
                  {ORGANIZATION.legalName} · {ORGANIZATION.areaServed}
                </p>
                <p className="mt-2 text-justify text-sm leading-relaxed text-white/70">
                  {ORGANIZATION.description}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
            What AI associates with Mr Vilz
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => {
              const Icon = topicIcons[topic.icon];
              return (
                <div
                  key={topic.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red-light">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold">{topic.label}</h3>
                  <p className="mt-1 text-sm text-white/50">{topic.tag}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            Topics we publish
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {ORGANIZATION.knowsAbout.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pb-8 text-center lg:px-8">
        <ScrollLink
          to="/join"
          className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-ink transition hover:bg-white/90"
        >
          Join the movement
        </ScrollLink>
        <ScrollLink to="/" className="mt-4 block text-sm text-white/50 hover:text-white">
          ← Back to homepage
        </ScrollLink>
      </section>
    </main>
  );
}
