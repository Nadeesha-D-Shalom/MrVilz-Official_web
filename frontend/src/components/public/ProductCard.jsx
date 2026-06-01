import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import MediaImage from "../ui/MediaImage";

function formatPrice(amount, currency = "LKR") {
  if (amount == null || Number.isNaN(Number(amount))) return "";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount));
}

function discountPercent(price, compareAt) {
  if (!compareAt || Number(compareAt) <= Number(price)) return null;
  return Math.round(((Number(compareAt) - Number(price)) / Number(compareAt)) * 100);
}

export default function ProductCard({ product }) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = !product.inStock;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-brand-ink/5 transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/marketplace/${product.slug}`} className="relative block">
        <MediaImage
          src={product.imageUrl}
          alt={product.title}
          aspectClass="aspect-square"
          className="w-full"
        />
        {product.isFeatured ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-950 shadow-sm">
            <Star size={10} fill="currentColor" />
            Featured
          </span>
        ) : null}
        {discount ? (
          <span className="absolute right-3 top-3 rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
            -{discount}%
          </span>
        ) : null}
        {outOfStock ? (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-brand-ink/80 px-3 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            Out of stock
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-brand-brown-lt">
          {product.category || "General"}
        </p>
        <Link to={`/marketplace/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold text-brand-ink transition group-hover:text-brand-red">
            {product.title}
          </h3>
        </Link>
        {product.shortDescription ? (
          <p className="mt-1 line-clamp-2 text-sm text-brand-brown-lt">{product.shortDescription}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="font-display text-xl font-extrabold text-brand-red">
              {formatPrice(product.price, product.currency)}
            </p>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) ? (
              <p className="text-sm text-brand-brown-lt line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </p>
            ) : null}
          </div>
          <Link
            to={`/marketplace/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-brown"
          >
            <ShoppingCart size={14} />
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
