import { useLocation } from "react-router-dom";

/** Only one nav item active — hash links match hash only; Home only when no hash */
export default function useNavActive() {
  const { pathname, hash } = useLocation();

  return function isNavActive(to) {
    if (to === "/") {
      return pathname === "/" && !hash;
    }

    const hashIndex = to.indexOf("#");
    if (hashIndex !== -1) {
      const targetHash = to.slice(hashIndex);
      return pathname === "/" && hash === targetHash;
    }

    if (to === "/careers") {
      return pathname === "/careers" || pathname.startsWith("/careers/");
    }

    return pathname === to;
  };
}
