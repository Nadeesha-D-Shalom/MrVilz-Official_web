import { LOGO_FOOTER_PNG, LOGO_PNG } from "../../config/brand";

/**
 * @param {"default" | "footer" | "onDark"} variant
 * - onDark: light panel behind logo for dark backgrounds (e.g. admin login)
 */
export default function Logo({
  className = "h-12 w-12 object-contain",
  variant = "default"
}) {
  const src = variant === "footer" ? LOGO_FOOTER_PNG : LOGO_PNG;

  const image = <img src={src} alt="Mr Vilz logo" className={className} />;

  if (variant === "onDark") {
    return (
      <span className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/30 sm:rounded-3xl sm:px-8 sm:py-6">
        {image}
      </span>
    );
  }

  return image;
}
