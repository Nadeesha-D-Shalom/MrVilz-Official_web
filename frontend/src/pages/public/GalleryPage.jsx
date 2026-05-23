import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchGallery } from "../../api/client";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchGallery().then((data) => setItems(data.items || []));
  }, []);

  const categories = ["all", ...new Set(items.map((i) => i.category).filter(Boolean))];
  const visible =
    filter === "all" ? items : items.filter((item) => item.category === filter);

  return (
    <main className="px-5 pb-20 pt-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">Gallery</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-6xl">Moments that matter</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-brown">
            Campaigns, cleanups, behind-the-scenes, and the people driving change across Sri Lanka.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
                filter === cat
                  ? "bg-brand-ink text-white"
                  : "bg-white text-brand-brown ring-1 ring-brand-ink/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {visible.map((item, index) => (
            <motion.figure
              key={item.id}
              className="mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-brand-ink/5"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 6) * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <img src={item.imageUrl} alt={item.title || "Gallery"} className="w-full object-cover" />
              <figcaption className="p-4">
                {item.title ? <h3 className="font-display font-bold">{item.title}</h3> : null}
                {item.caption ? <p className="mt-1 text-sm text-brand-brown-lt">{item.caption}</p> : null}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-12 text-center text-brand-brown-lt">No gallery items yet.</p>
        ) : null}
      </div>
    </main>
  );
}
