import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Dynamic Island–style nav: expanded over hero, compact after scrolling past it.
 */
export default function useNavIsland() {
  const { pathname } = useLocation();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const hero =
      document.getElementById("home") ?? document.querySelector("[data-nav-hero]");
    const onHeroPage = pathname === "/" || pathname === "/discover";

    if (!onHeroPage) {
      setCompact(true);
      return;
    }

    if (!hero) {
      const onScroll = () => setCompact(window.scrollY > window.innerHeight * 0.55);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const heroVisible = entry.isIntersecting && entry.intersectionRatio > 0.35;
        setCompact(!heroVisible);
      },
      {
        threshold: [0, 0.2, 0.35, 0.5],
        rootMargin: "-72px 0px 0px 0px"
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return compact;
}
