import { Link } from "react-router-dom";
import { ExternalLink, LogOut } from "lucide-react";
import { ADMIN_NAV_GROUPS } from "../../config/adminNav";
import AdminNavGroup from "./AdminNavGroup";

export default function AdminSidebar({ admin, onLogout, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200/80 px-4 py-5 pr-12 lg:pr-4">
        <p className="font-display text-lg font-extrabold tracking-tight text-brand-ink">
          MrVilz <span className="text-brand-red">Admin</span>
        </p>
        <p className="mt-1 truncate text-xs text-slate-500">
          Signed in as <span className="font-semibold text-slate-700">{admin?.username}</span>
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {ADMIN_NAV_GROUPS.map((group) => (
          <AdminNavGroup key={group.id} group={group} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-slate-200/80 p-4">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-ink/20 hover:bg-slate-50"
        >
          <ExternalLink size={16} />
          View website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-ink"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
