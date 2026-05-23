import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = new Map();

export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Forward navigation → top. Browser back/forward → restore previous scroll. */
export default function ScrollRestoration() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const prevKey = useRef(key);

  useLayoutEffect(() => {
    if (hash && pathname === "/") {
      const id = hash.replace("#", "");
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      scrollToHash();
      const t = setTimeout(scrollToHash, 200);
      const t2 = setTimeout(scrollToHash, 800);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }

    const isBackForward = navigationType === "POP";

    if (isBackForward) {
      const saved = positions.get(key) ?? positions.get(pathname);
      if (typeof saved === "number") {
        window.scrollTo({ top: saved, left: 0, behavior: "instant" });
        requestAnimationFrame(() => window.scrollTo({ top: saved, left: 0, behavior: "instant" }));
      }
    } else {
      scrollPageToTop();
    }

    prevKey.current = key;
  }, [pathname, hash, key, navigationType]);

  useEffect(() => {
    const save = () => {
      positions.set(key, window.scrollY);
      positions.set(pathname, window.scrollY);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [key, pathname]);

  return null;
}
