import { useEffect, useRef, useState } from "react";

/** Lightweight scroll reveal — CSS only, no layout thrashing */
export default function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: options.threshold ?? 0.12, rootMargin: options.rootMargin ?? "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, visible, className: visible ? "is-visible" : "" };
}
