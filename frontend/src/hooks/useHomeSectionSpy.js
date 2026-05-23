import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SECTION_IDS = ["about", "projects", "team"];
const TOP_HOME_THRESHOLD = 120;
const NAV_OFFSET = 120;

const listeners = new Set();

/** Immediately update navbar highlight (before scroll finishes) */
export function forceNavSection(section) {
  listeners.forEach((fn) => fn(section));
}

function computeSectionFromScroll() {
  if (window.scrollY < TOP_HOME_THRESHOLD) {
    return "home";
  }

  let active = "home";
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= NAV_OFFSET) {
      active = id;
    }
  }
  return active;
}

export default function useHomeSectionSpy() {
  const { pathname } = useLocation();
  const [section, setSection] = useState("home");

  const applySection = useCallback((next) => {
    setSection(next);
  }, []);

  useEffect(() => {
    listeners.add(applySection);
    return () => listeners.delete(applySection);
  }, [applySection]);

  useEffect(() => {
    if (pathname !== "/") {
      setSection("");
      return;
    }

    let raf = 0;

    const update = () => {
      const next = computeSectionFromScroll();
      setSection(next);

      if (next === "home" && window.location.hash) {
        window.history.replaceState(null, "", "/");
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", update);

    const retry = setTimeout(update, 400);
    const retryLazy = setTimeout(update, 1500);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", update);
      clearTimeout(retry);
      clearTimeout(retryLazy);
    };
  }, [pathname]);

  return section;
}
