import { Sparkles } from "lucide-react";
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
    <div className="flex h-full flex-col border-r border-slate-200/90 bg-white text-brand-ink">
      <div className="border-b border-slate-100 px-5 py-5 pr-12 lg:pr-5">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-red">
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
    </div>
  );
}
