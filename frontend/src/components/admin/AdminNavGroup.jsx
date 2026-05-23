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
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? "bg-brand-red text-white shadow-sm shadow-brand-red/25"
            : "text-slate-600 hover:bg-slate-100 hover:text-brand-ink"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              isActive ? "bg-white/15" : "bg-slate-100 text-slate-600"
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
      <ul className="space-y-0.5">
        {group.items.map((link) => (
          <li key={link.to}>
            <NavItem link={link} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="rounded-xl border border-transparent">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold uppercase tracking-[0.12em] transition ${
          active ? "bg-brand-red/8 text-brand-red" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        }`}
        aria-expanded={open}
      >
        <span className="truncate">{group.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul
        className={`mt-1 space-y-0.5 overflow-hidden pl-1 transition-all duration-200 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
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
