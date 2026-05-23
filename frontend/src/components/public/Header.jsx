import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
  { label: "Discover", to: "/discover" },
  { label: "Contact", to: "/contact" }
];

function NavItem({ item, active, onNavigate, pillClass, activePill }) {
  const className = `${pillClass} ${active ? activePill : ""}`;
  const aria = active ? { "aria-current": "page" } : {};

  if (item.section && item.section !== "home") {
    return (
      <Link
        to={{ pathname: "/", hash: item.section }}
        className={className}
        {...aria}
        onClick={() => {
          forceNavSection(item.section);
          onNavigate?.();
        }}
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
          onNavigate?.();
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
    <ScrollLink to={item.to} className={className} onClick={onNavigate} {...aria}>
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
  const [open, setOpen] = useState(false);
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
    compact ? "h-8 min-w-[2rem] px-2.5 text-[12px]" : "h-9 min-w-[2.25rem] px-3.5 text-[13px]"
  } ${
    isHeroLook
      ? "text-white/85 hover:bg-white/12 hover:text-white"
      : "text-brand-brown hover:bg-brand-ink/5 hover:text-brand-ink"
  }`;
  const activePill = isHeroLook
    ? "!bg-white/22 !text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
    : "!bg-brand-ink/8 !text-brand-ink font-semibold";

  const closeMenu = () => setOpen(false);

  return (
    <header className="nav-island-host fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex justify-center px-4 sm:px-5">
        <div
          data-state={compact ? "compact" : "expanded"}
          className={`nav-island-bar flex w-full items-center gap-1.5 border backdrop-blur-xl backdrop-saturate-150 sm:gap-2 ${barShell} ${
            compact
              ? "min-h-11 rounded-full px-2 py-1 sm:px-2.5"
              : "min-h-12 rounded-2xl px-2 py-1.5 sm:min-h-[52px] sm:rounded-full sm:px-3"
          }`}
        >
          <Link
            to="/"
            replace
            className="flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-1 sm:pr-2"
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
              className={`hidden overflow-hidden font-display font-bold transition-all duration-500 md:inline ${
                compact ? "max-w-0 opacity-0 text-sm" : "max-w-[120px] opacity-100 text-sm"
              } ${textMain}`}
            >
              Mr Vilz
            </span>
          </Link>

          <nav
            className={`hidden min-w-0 flex-1 items-center justify-center overflow-x-auto md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              compact ? "gap-0" : "gap-0.5"
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

          <div className="flex-1 md:hidden" />

          <ScrollLink
            to="/join"
            className={`hidden shrink-0 rounded-full font-bold transition-all duration-500 md:inline-flex ${
              compact ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-[13px]"
            } ${
              isHeroLook
                ? "bg-white text-brand-ink hover:bg-white/90"
                : "bg-brand-red text-white hover:bg-brand-red-mid"
            }`}
          >
            Join Team
          </ScrollLink>

          <button
            type="button"
            className={`shrink-0 rounded-full p-2 md:hidden ${textMain}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <nav
            className={`absolute left-4 right-4 top-[calc(4.5rem+env(safe-area-inset-top))] max-h-[min(70vh,480px)] overflow-y-auto rounded-2xl border p-3 shadow-2xl ${barShell} backdrop-blur-xl`}
          >
            <div className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  active={isItemActive(item, location.pathname, homeSection, isNavActive)}
                  onNavigate={closeMenu}
                  pillClass={`${pillClass} w-full px-4 py-3 text-left text-[13px]`}
                  activePill={activePill}
                />
              ))}
              <ScrollLink
                to="/join"
                className={`mt-2 rounded-xl py-3.5 text-center text-sm font-bold ${
                  isHeroLook
                    ? "bg-white text-brand-ink"
                    : "bg-brand-red text-white hover:bg-brand-red-mid"
                }`}
                onClick={closeMenu}
              >
                Join Team
              </ScrollLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
