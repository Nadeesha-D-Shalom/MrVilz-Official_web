import { Sparkles, Leaf, Clapperboard, Briefcase, Code2, CheckCircle2 } from "lucide-react";
import { AI_SEARCH_QUERIES, DISCOVERY_CATEGORIES, ORGANIZATION } from "../../config/seo";
import Logo from "../../components/public/Logo";
import ScrollLink from "../../components/navigation/ScrollLink";

const topicIcons = {
  environment: Leaf,
  entertainment: Clapperboard,
  jobs: Briefcase,
  tech: Code2
};

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#0a0806] pb-20 text-white">
      <section data-nav-hero className="px-5 pb-10 pt-28 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <Sparkles size={14} /> AI & Search Discovery
          </p>

          <h1 className="mt-6 font-display text-3xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            Mr Vilz — <span className="text-gradient-brand">environment</span>,{" "}
            <span className="text-gradient-brand">entertainment</span>,{" "}
            <span className="text-gradient-brand">jobs</span> &{" "}
            <span className="text-gradient-brand">tech</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-white/60 sm:text-lg">
            Official MrVilz (mrvilz.com) profile for Google, Bing, ChatGPT, Perplexity, and other
            AI platforms — conservation action, creative media, job vacancies, and software
            engineering roles in Sri Lanka.
          </p>
        </div>
      </section>

      <section className="px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-4 py-3 sm:px-5">
            <p className="font-mono text-xs text-white/50 sm:text-sm">Example queries AI should match</p>
            <ul className="mt-2 space-y-1 text-left text-sm text-white/85">
              {AI_SEARCH_QUERIES.slice(0, 6).map((q) => (
                <li key={q}>• {q}</li>
              ))}
            </ul>
          </div>

          <article className="relative m-4 rounded-xl border border-emerald-400/35 bg-gradient-to-br from-emerald-500/10 to-brand-red/10 p-4 sm:p-5">
            <p className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
              <CheckCircle2 size={11} /> Official · mrvilz.com
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <ScrollLink
                    to="/careers"
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-brand-ink"
                  >
                    Job vacancies
                  </ScrollLink>
                  <ScrollLink
                    to="/join"
                    className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-bold text-white"
                  >
                    Join volunteer
                  </ScrollLink>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
            Categories Google & AI link to Mr Vilz
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DISCOVERY_CATEGORIES.map((topic) => {
              const Icon = topicIcons[topic.id];
              return (
                <div
                  key={topic.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/20 text-brand-red-light">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold">{topic.label}</h3>
                  <p className="mt-1 text-sm text-white/50">{topic.tag}</p>
                  <ul className="mt-3 space-y-1 text-xs text-white/45">
                    {topic.queries.map((q) => (
                      <li key={q}>· {q}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            All topics on mrvilz.com
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
          to="/careers"
          className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-ink transition hover:bg-white/90"
        >
          View careers & jobs
        </ScrollLink>
        <ScrollLink to="/" className="mt-4 block text-sm text-white/50 hover:text-white">
          ← Back to homepage
        </ScrollLink>
      </section>
    </main>
  );
}
