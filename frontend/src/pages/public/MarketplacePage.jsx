import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { fetchMarketplace } from "../../api/client";
import ProductCard from "../../components/public/ProductCard";

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A–Z" }
];

export default function MarketplacePage() {
  const [data, setData] = useState({ title: "", intro: "", products: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let active = true;
    fetchMarketplace()
      .then((res) => {
        if (active) setData(res.marketplace || { title: "", intro: "", products: [] });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["all", ...new Set((data.products || []).map((p) => p.category).filter(Boolean))],
    [data.products]
  );

  const visible = useMemo(() => {
    let items = [...(data.products || [])];
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (filter !== "all") {
      items = items.filter((p) => p.category === filter);
    }
    if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
    else if (sort === "name") items.sort((a, b) => a.title.localeCompare(b.title));
    else items.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    return items;
  }, [data.products, filter, search, sort]);

  return (
    <main className="px-5 pb-20 pt-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">
            Marketplace
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-6xl">
            {data.title || "Mr Vilz Marketplace"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-brown">
            {data.intro ||
              "Shop eco-friendly products and merchandise — every purchase supports our conservation work."}
          </p>
        </motion.div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown-lt"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-brand-ink/10 bg-white py-3 pl-11 pr-4 text-sm font-medium text-brand-ink outline-none ring-brand-ink/5 transition focus:ring-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-brand-brown-lt" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-brand-ink/10 bg-white px-4 py-3 text-sm font-semibold text-brand-ink outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
                filter === cat
                  ? "bg-brand-ink text-white"
                  : "bg-white text-brand-brown ring-1 ring-brand-ink/10 hover:ring-brand-ink/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-brand-parchment"
              />
            ))}
          </div>
        ) : visible.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.3) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-brand-brown-lt">
            No products match your search. Check back soon for new items.
          </p>
        )}
      </div>
    </main>
  );
}
