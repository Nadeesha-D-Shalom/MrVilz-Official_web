import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

function NavItem({ link, onNavigate }) {
  const Icon = link.icon;
  return (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            : "text-white/60 hover:bg-white/6 hover:text-white/90"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
              isActive
                ? "bg-brand-red text-white shadow-lg shadow-brand-red/30"
                : "bg-white/8 text-white/70 group-hover:bg-white/12"
            }`}
          >
            <Icon size={16} strokeWidth={2.25} />
          </span>
          <span className="truncate">{link.label}</span>
        </>
      )}
    </NavLink>
  );
}

function groupHasActive(pathname, items) {
  return items.some((item) =>
    item.end
      ? pathname === "/admin" || pathname === "/admin/"
      : pathname === item.to || pathname.startsWith(`${item.to}/`)
  );
}

export default function AdminNavGroup({ group, onNavigate }) {
  const { pathname } = useLocation();
  const active = groupHasActive(pathname, group.items);
  const [open, setOpen] = useState(active || group.defaultOpen);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active, pathname]);

  if (!group.collapsible) {
    return (
      <ul className="space-y-1">
        {group.items.map((link) => (
          <li key={link.to}>
            <NavItem link={link} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="pb-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.14em] transition ${
          active ? "text-brand-red" : "text-white/40 hover:text-white/70"
        }`}
        aria-expanded={open}
      >
        <span className="truncate">{group.label}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul
        className={`mt-1 space-y-1 overflow-hidden pl-1 transition-all duration-200 ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {group.items.map((link) => (
          <li key={link.to}>
            <NavItem link={link} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  );
}
