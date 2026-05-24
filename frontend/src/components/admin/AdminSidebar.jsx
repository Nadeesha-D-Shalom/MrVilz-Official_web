import { Link } from "react-router-dom";
import { ExternalLink, LogOut, Sparkles } from "lucide-react";
import { ADMIN_NAV_GROUPS } from "../../config/adminNav";
import { isSuperAdmin } from "../../utils/adminRole";
import AdminNavGroup from "./AdminNavGroup";

function visibleNavGroups(admin) {
  const allowSuperOnly = isSuperAdmin(admin);
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.superAdminOnly || allowSuperOnly)
  })).filter((group) => group.items.length > 0);
}

export default function AdminSidebar({ admin, onLogout, onNavigate }) {
  const navGroups = visibleNavGroups(admin);

  return (
    <div className="flex h-full flex-col border-r border-slate-200/90 bg-white text-brand-ink">
      <div className="border-b border-slate-100 px-5 py-5 pr-12 lg:pr-5">
        <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-red">
          <Sparkles size={10} />
          Workspace
        </p>
        <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-brand-ink">
          Mr <span className="text-brand-red">Vilz</span>
        </p>
        <p className="mt-1 truncate text-xs text-slate-500">{admin?.username}</p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <AdminNavGroup key={group.id} group={group} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-slate-100 p-4">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
        >
          <ExternalLink size={16} />
          View website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-red-mid"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
