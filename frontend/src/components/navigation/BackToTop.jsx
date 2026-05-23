import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 400);

      const heroEl = document.getElementById("home");
      if (pathname === "/discover") {
        setOnHero(y < 280);
        return;
      }
      if (heroEl && pathname === "/") {
        const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
        setOnHero(y < heroBottom - 120);
      } else {
        setOnHero(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`back-to-top fixed bottom-6 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:bottom-8 sm:right-6 ${
        onHero
          ? "border-white/40 bg-white text-brand-ink hover:bg-brand-cream"
          : "border-brand-red bg-brand-red text-white hover:bg-brand-red-mid"
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
