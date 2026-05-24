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
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
          isActive
            ? "bg-slate-200/90 text-brand-ink"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
              isActive ? "bg-white text-slate-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Icon size={15} strokeWidth={2.25} />
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
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold uppercase tracking-[0.12em] transition ${
          active
            ? "bg-brand-red/10 text-brand-red"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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
        className={`mt-0.5 space-y-0.5 overflow-hidden pl-1 transition-all duration-200 ${
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
