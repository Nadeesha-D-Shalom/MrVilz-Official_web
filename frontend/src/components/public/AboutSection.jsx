import useReveal from "../../hooks/useReveal";
import SectionHeader from "../ui/SectionHeader";

export default function AboutSection({ about }) {
  const { ref, className } = useReveal();
  const paragraphs = about?.paragraphs || [];

  return (
    <section id="about" className="section-pad content-auto scroll-mt-28 border-t border-brand-ink/5 bg-white">
      <div
        ref={ref}
        className={`reveal mx-auto max-w-7xl ${className}`}
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <SectionHeader
              align="left"
              label="About"
              title={about?.title || "What Mr Vilz Does"}
              description="Youth-led action for Sri Lanka's environment through media, volunteers, and community projects."
            />
            <a
              href="#projects"
              className="mt-8 inline-flex rounded-full bg-brand-ink px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-brown"
            >
              See our projects
            </a>
          </div>

          <div className="space-y-4 lg:col-span-8">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className="rounded-2xl border border-brand-ink/6 bg-brand-cream/50 px-5 py-4 text-justify text-base leading-relaxed text-brand-brown sm:px-6 sm:py-5 sm:text-lg"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
