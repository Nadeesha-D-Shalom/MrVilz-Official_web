import useReveal from "../../hooks/useReveal";
import SectionHeader from "../ui/SectionHeader";
import LazyImage from "../ui/LazyImage";

function ProjectCard({ project, index }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="project-card group overflow-hidden rounded-2xl border border-brand-ink/8 bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-[44%] lg:w-[42%]">
          <LazyImage
            src={project.imageUrl}
            alt={project.title}
            aspectClass="h-44 w-full sm:h-52 md:h-full md:min-h-[220px] lg:min-h-[240px]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-brand-ink px-2.5 py-1 font-display text-xs font-bold text-white">
            {num}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/20" />
        </div>

        <div className="flex flex-1 flex-col justify-center p-5 sm:p-6 md:py-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
            Ongoing campaign
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug text-brand-ink sm:text-xl">
            {project.title}
          </h3>
          <p className="project-card-summary mt-2 text-sm leading-relaxed text-brand-brown-lt">
            {project.summary}
          </p>

          {project.highlights?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.highlights.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-brand-ink/8 bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-brown"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wide text-brand-brown-lt">
              <span>Campaign progress</span>
              <span className="text-brand-ink">{project.progress}%</span>
            </div>
            <div className="progress-track h-2">
              <div
                className="progress-fill bg-brand-red"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection({ projects = [] }) {
  const { ref, className } = useReveal();

  return (
    <section id="projects" className="section-pad content-auto scroll-mt-28 bg-brand-cream">
      <div ref={ref} className={`reveal mx-auto max-w-7xl ${className}`}>
        <SectionHeader
          label="Impact"
          title="Ongoing Projects"
          description="Active campaigns protecting coastlines and greening communities across Sri Lanka."
          titleClass="sm:text-3xl lg:text-4xl"
          descriptionClass="text-sm sm:text-base"
        />

        <div className="mt-8 flex flex-col gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || project.title}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
