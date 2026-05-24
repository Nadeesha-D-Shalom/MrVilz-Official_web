import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import useNavActive from "../../hooks/useNavActive";
import useHomeSectionSpy, { forceNavSection } from "../../hooks/useHomeSectionSpy";
import useNavIsland from "../../hooks/useNavIsland";
import ScrollLink from "../navigation/ScrollLink";

const navItems = [
  { label: "Home", to: "/", section: "home" },
  { label: "About", to: "/#about", section: "about" },
  { label: "Projects", to: "/#projects", section: "projects" },
  { label: "Gallery", to: "/gallery" },
  { label: "Careers", to: "/careers" },
  { label: "Discover", to: "/discover", hideOnMobile: true },
  { label: "Contact", to: "/contact" }
];

function NavItem({ item, active, pillClass, activePill }) {
  // max-sm:hidden — Discover stays on tablet/desktop; pillClass inline-flex was overriding hidden
  const visibility = item.hideOnMobile ? "max-sm:hidden" : "";
  const className = `${pillClass} ${visibility} ${active ? activePill : ""}`;
  const aria = active ? { "aria-current": "page" } : {};

  if (item.section && item.section !== "home") {
    return (
      <Link
        to={{ pathname: "/", hash: item.section }}
        className={className}
        {...aria}
        onClick={() => forceNavSection(item.section)}
      >
        {item.label}
      </Link>
    );
  }

  if (item.to === "/") {
    return (
      <Link
        to="/"
        replace
        className={className}
        {...aria}
        onClick={(e) => {
          forceNavSection("home");
          if (window.location.pathname === "/") {
            e.preventDefault();
            window.history.replaceState(null, "", "/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <ScrollLink to={item.to} className={className} {...aria}>
      {item.label}
    </ScrollLink>
  );
}

function isItemActive(item, pathname, homeSection, isNavActive) {
  if (pathname !== "/") {
    return isNavActive(item.to);
  }
  if (!item.section) {
    return false;
  }
  if (item.section === "home") {
    return homeSection === "home" || homeSection === "";
  }
  return homeSection === item.section;
}

export default function Header({ variant = "hero" }) {
  const compact = useNavIsland();
  const isNavActive = useNavActive();
  const homeSection = useHomeSectionSpy();
  const location = useLocation();
  const onDiscover = location.pathname === "/discover";
  const expanded = !compact;

  const isHeroLook =
    expanded && variant === "hero" && (location.pathname === "/" || onDiscover);

  const barShell = isHeroLook
    ? "border-white/20 bg-brand-ink/55 shadow-[0_8px_32px_rgba(0,0,0,0.28)]"
    : "border-brand-ink/10 bg-brand-cream/95 shadow-[0_6px_28px_rgba(26,16,8,0.1)]";

  const textMain = isHeroLook ? "text-white" : "text-brand-ink";
  const pillClass = `inline-flex shrink-0 items-center justify-center rounded-full font-medium leading-none whitespace-nowrap transition-colors duration-200 ${
    compact ? "h-8 min-w-[2rem] px-2 text-[11px]" : "h-9 min-w-[2.25rem] px-3 text-[12px] sm:px-3.5 sm:text-[13px]"
  } ${
    isHeroLook
      ? "text-white/85 hover:bg-white/12 hover:text-white"
      : "text-brand-brown hover:bg-brand-ink/5 hover:text-brand-ink"
  }`;
  const activePill = isHeroLook
    ? "!bg-white/22 !text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
    : "!bg-brand-ink/8 !text-brand-ink font-semibold";

  return (
    <header className="nav-island-host fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex justify-center px-3 sm:px-5">
        <div
          data-state={compact ? "compact" : "expanded"}
          className={`nav-island-bar flex w-full max-w-7xl items-center gap-1 border backdrop-blur-xl backdrop-saturate-150 sm:gap-1.5 ${barShell} ${
            compact
              ? "min-h-11 rounded-full px-1.5 py-1 sm:px-2"
              : "min-h-12 rounded-2xl px-1.5 py-1.5 sm:min-h-[52px] sm:rounded-full sm:px-2.5"
          }`}
        >
          <Link
            to="/"
            replace
            className="flex shrink-0 items-center rounded-full py-1 pl-0.5 pr-0.5 sm:pl-1 sm:pr-1.5"
            onClick={(e) => {
              forceNavSection("home");
              if (location.pathname === "/") {
                e.preventDefault();
                window.history.replaceState(null, "", "/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Logo
              className={`object-contain transition-all duration-500 ${
                compact ? "h-7 w-7 sm:h-8 sm:w-8" : "h-8 w-8 sm:h-9 sm:w-9"
              }`}
            />
            <span
              className={`hidden overflow-hidden font-display font-bold transition-all duration-500 sm:inline ${
                compact ? "max-w-0 opacity-0 text-sm" : "max-w-[100px] opacity-100 text-sm"
              } ${textMain}`}
            >
              Mr Vilz
            </span>
          </Link>

          <nav
            className={`flex min-w-0 flex-1 items-center justify-start gap-0 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center ${
              compact ? "" : "sm:gap-0.5"
            }`}
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                active={isItemActive(item, location.pathname, homeSection, isNavActive)}
                pillClass={pillClass}
                activePill={activePill}
              />
            ))}
          </nav>

          <ScrollLink
            to="/join"
            className={`inline-flex shrink-0 rounded-full font-bold transition-all duration-500 ${
              compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-[11px] sm:px-4 sm:text-[13px]"
            } ${
              isHeroLook
                ? "bg-white text-brand-ink hover:bg-white/90"
                : "bg-brand-red text-white hover:bg-brand-red-mid"
            }`}
          >
            Join
          </ScrollLink>
        </div>
      </div>
    </header>
  );
}
