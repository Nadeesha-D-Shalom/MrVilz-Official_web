import { Link } from "react-router-dom";
import { ExternalLink, Sparkles } from "lucide-react";
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

export default function AdminSidebar({ admin, onNavigate }) {
  const navGroups = visibleNavGroups(admin);

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0b1020] via-[#0f172a] to-[#111827] text-white shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 px-5 py-6 pr-12 lg:pr-5">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
          <Sparkles size={10} />
          Admin Console
        </p>
        <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">
          Mr <span className="text-brand-red">Vilz</span>
        </p>
        <p className="mt-1 truncate text-xs text-white/50">{admin?.username}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
        {navGroups.map((group) => (
          <AdminNavGroup key={group.id} group={group} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={14} />
          View live site
        </Link>
      </div>
    </div>
  );
}
