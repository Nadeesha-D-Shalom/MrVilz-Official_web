import ScrollLink from "../navigation/ScrollLink";
import { Sparkles, ArrowRight } from "lucide-react";
import { AI_SEARCH_QUERIES } from "../../config/seo";
import useReveal from "../../hooks/useReveal";

export default function AiDiscoverSection() {
  const { ref, className } = useReveal();

  return (
    <section className="content-auto border-t border-brand-ink/10 bg-brand-ink px-5 py-20 text-white lg:px-8">
      <div ref={ref} className={`reveal mx-auto max-w-7xl ${className}`}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              AI discovery
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Found when people search for impact
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              Optimized for search engines and AI assistants — environment, entertainment, and
              creative organizations in Sri Lanka.
            </p>
            <ScrollLink
              to="/discover"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-ink transition hover:bg-white/90"
            >
              <Sparkles size={16} /> AI Discover view <ArrowRight size={16} />
            </ScrollLink>
          </div>

          <ul className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            {AI_SEARCH_QUERIES.slice(0, 5).map((q, i) => (
              <li
                key={q}
                className="rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/80"
              >
                <span className="mr-2 font-bold text-white/40">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
