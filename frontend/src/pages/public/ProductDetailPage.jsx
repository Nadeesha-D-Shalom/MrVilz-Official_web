import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, ShieldCheck, Star, Truck } from "lucide-react";
import { fetchProduct } from "../../api/client";
import LazyImage from "../../components/ui/LazyImage";

function formatPrice(amount, currency = "LKR") {
  if (amount == null || Number.isNaN(Number(amount))) return "";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount));
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchProduct(slug)
      .then((data) => {
        if (active) setProduct(data.product);
      })
      .catch(() => {
        if (active) setError("Product not found.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="px-5 pb-20 pt-28 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-40 rounded-lg bg-brand-parchment" />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-3xl bg-brand-parchment" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded-lg bg-brand-parchment" />
              <div className="h-6 w-1/3 rounded-lg bg-brand-parchment" />
              <div className="h-32 rounded-lg bg-brand-parchment" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="px-5 pb-20 pt-28 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-brand-brown-lt">{error || "Product not found."}</p>
          <Link
            to="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  const discount =
    product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)
      ? Math.round(
          ((Number(product.compareAtPrice) - Number(product.price)) /
            Number(product.compareAtPrice)) *
            100
        )
      : null;

  const buyHref = product.purchaseLink || "/contact";

  return (
    <main className="px-5 pb-20 pt-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-brown hover:text-brand-ink"
        >
          <ArrowLeft size={16} />
          Back to marketplace
        </Link>

        <motion.div
          className="mt-8 grid gap-10 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-brand-ink/5">
            <LazyImage
              src={product.imageUrl}
              alt={product.title}
              aspectClass="aspect-square"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-parchment px-3 py-1 text-xs font-bold uppercase text-brand-brown">
                {product.category}
              </span>
              {product.isFeatured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-800">
                  <Star size={12} fill="currentColor" />
                  Featured
                </span>
              ) : null}
              {discount ? (
                <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase text-white">
                  Save {discount}%
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 font-display text-4xl font-extrabold text-brand-ink sm:text-5xl">
              {product.title}
            </h1>

            {product.shortDescription ? (
              <p className="mt-3 text-lg text-brand-brown">{product.shortDescription}</p>
            ) : null}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold text-brand-red">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compareAtPrice &&
              Number(product.compareAtPrice) > Number(product.price) ? (
                <span className="text-xl text-brand-brown-lt line-through">
                  {formatPrice(product.compareAtPrice, product.currency)}
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-sm font-semibold text-brand-brown">
              {product.inStock ? (
                <span className="text-emerald-700">{product.stock} in stock</span>
              ) : (
                <span className="text-brand-red">Out of stock</span>
              )}
              {product.condition ? ` · ${product.condition}` : null}
              {product.sku ? ` · SKU: ${product.sku}` : null}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={buyHref}
                target={product.purchaseLink ? "_blank" : undefined}
                rel={product.purchaseLink ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition ${
                  product.inStock
                    ? "bg-brand-red text-white hover:bg-brand-red-mid"
                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                }`}
                aria-disabled={!product.inStock}
                onClick={(e) => {
                  if (!product.inStock) e.preventDefault();
                }}
              >
                {product.purchaseLink ? (
                  <>
                    Buy now
                    <ExternalLink size={18} />
                  </>
                ) : (
                  "Contact to order"
                )}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-brand-ink/10 bg-white px-6 py-4 text-base font-bold text-brand-ink hover:bg-brand-parchment"
              >
                Ask a question
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-brand-parchment/60 p-4">
                <ShieldCheck size={20} className="text-brand-red" />
                <p className="text-xs font-semibold text-brand-brown">Verified seller</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-brand-parchment/60 p-4">
                <Truck size={20} className="text-brand-red" />
                <p className="text-xs font-semibold text-brand-brown">Island-wide delivery</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-brand-parchment/60 p-4">
                <Star size={20} className="text-brand-red" />
                <p className="text-xs font-semibold text-brand-brown">Supports conservation</p>
              </div>
            </div>

            {product.description ? (
              <div className="mt-10">
                <h2 className="font-display text-xl font-bold text-brand-ink">Description</h2>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-brand-brown">
                  {product.description}
                </p>
              </div>
            ) : null}

            {product.tags?.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-brown ring-1 ring-brand-ink/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
