import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MapPin, FolderOpen } from "lucide-react";
import { fetchGallery } from "../../api/client";
import MediaImage from "../../components/ui/MediaImage";
import GalleryImageSchema from "../../components/seo/GalleryImageSchema";

export default function GalleryPage() {
  const [data, setData] = useState({ title: "", intro: "", sections: [] });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("all");

  useEffect(() => {
    let active = true;
    fetchGallery()
      .then((res) => {
        if (active) setData(res.gallery || { title: "", intro: "", sections: [] });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const sections = data.sections || [];

  const visibleSections = useMemo(() => {
    if (activeSection === "all") return sections;
    return sections.filter((s) => s.id === activeSection || s.slug === activeSection);
  }, [sections, activeSection]);

  return (
    <main className="px-5 pb-20 pt-28 lg:px-8">
      <GalleryImageSchema sections={sections} />
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">Gallery</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-6xl">
            {data.title || "Moments that matter"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-brown">
            {data.intro ||
              "Campaigns, cleanups, behind-the-scenes, and the people driving change across Sri Lanka."}
          </p>
        </motion.div>

        {sections.length > 1 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("all")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeSection === "all"
                  ? "bg-brand-ink text-white"
                  : "bg-white text-brand-brown ring-1 ring-brand-ink/10"
              }`}
            >
              All sections
            </button>
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeSection === section.id
                    ? "bg-brand-ink text-white"
                    : "bg-white text-brand-brown ring-1 ring-brand-ink/10"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-brand-parchment" />
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-14">
            {visibleSections.map((section) => (
              <section key={section.id} id={section.slug || section.id}>
                <div className="mb-6 border-b border-brand-ink/10 pb-4">
                  <h2 className="font-display text-2xl font-extrabold text-brand-ink sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-brand-brown-lt">
                    {section.project ? (
                      <span className="inline-flex items-center gap-1.5">
                        <FolderOpen size={14} />
                        {section.project}
                      </span>
                    ) : null}
                    {section.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} />
                        {section.location}
                      </span>
                    ) : null}
                  </div>
                  {section.description ? (
                    <p className="mt-2 max-w-2xl text-sm text-brand-brown">{section.description}</p>
                  ) : null}
                </div>

                <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                  {(section.items || []).map((item, index) => (
                    <motion.figure
                      key={item.id}
                      className="mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-brand-ink/5"
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index % 6) * 0.05 }}
                      whileHover={{ y: -6 }}
                    >
                      <MediaImage
                        src={item.imageUrl}
                        alt={item.altText || item.title || "Mr Vilz gallery Nadeesha Shalom"}
                        aspectClass=""
                        className="w-full"
                      />
                      <figcaption className="p-4">
                        {item.title ? (
                          <h3 className="font-display font-bold text-brand-ink">{item.title}</h3>
                        ) : null}
                        {item.caption ? (
                          <p className="mt-1 text-sm text-brand-brown-lt">{item.caption}</p>
                        ) : null}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {!loading && !sections.length ? (
          <p className="mt-12 text-center text-brand-brown-lt">No gallery items yet.</p>
        ) : null}
      </div>
    </main>
  );
}
