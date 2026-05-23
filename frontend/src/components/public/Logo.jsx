import { LOGO_FOOTER_PNG, LOGO_PNG } from "../../config/brand";

export default function Logo({
  className = "h-12 w-12 object-contain",
  variant = "default"
}) {
  const src = variant === "footer" ? LOGO_FOOTER_PNG : LOGO_PNG;

  return <img src={src} alt="Mr Vilz logo" className={className} />;
}
