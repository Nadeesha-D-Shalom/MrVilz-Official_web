import { Link } from "react-router-dom";
import { ExternalLink, LogOut, Sparkles } from "lucide-react";
import { ADMIN_NAV_GROUPS } from "../../config/adminNav";
import AdminNavGroup from "./AdminNavGroup";

export default function AdminSidebar({ admin, onLogout, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#14100c] via-brand-ink to-[#0d0906] text-white">
      <div className="border-b border-white/10 px-5 py-6 pr-12 lg:pr-5">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">
          <Sparkles size={12} />
          Workspace
        </p>
        <p className="mt-2 font-display text-xl font-extrabold tracking-tight">
          Mr <span className="text-brand-red">Vilz</span>
        </p>
        <p className="mt-1 truncate text-xs text-white/50">
          {admin?.username}
        </p>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-5">
        {ADMIN_NAV_GROUPS.map((group) => (
          <AdminNavGroup key={group.id} group={group} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white/90 transition hover:border-white/25 hover:bg-white/10"
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
