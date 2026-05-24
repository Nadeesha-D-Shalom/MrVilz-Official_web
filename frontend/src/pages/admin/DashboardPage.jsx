import { Link } from "react-router-dom";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import { ADMIN_DASHBOARD_GROUPS } from "../../config/adminNav";
import { useAuth } from "../../context/AuthContext";
import { isSuperAdmin } from "../../utils/adminRole";

export default function DashboardPage() {
  const { admin } = useAuth();
  const allowSuperOnly = isSuperAdmin(admin);
  const dashboardGroups = ADMIN_DASHBOARD_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.superAdminOnly || allowSuperOnly)
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-2xl border border-brand-ink/8 bg-white shadow-sm lg:rounded-3xl">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
          <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-red">
            <LayoutDashboard size={12} />
            Overview
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-ink sm:text-3xl">
            Welcome back
          </h2>
        </div>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-xl text-sm leading-relaxed text-brand-brown sm:text-base">
            Manage your public website content, team, messages, and applications from the sections
            below.
          </p>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-brand-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-red-mid sm:self-auto"
          >
            Preview site
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {dashboardGroups.map((group) => (
          <section key={group.label}>
            <h3 className="mb-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {group.label}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.to}
                    to={card.to}
                    className="group flex flex-col rounded-2xl border border-brand-ink/8 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.accent}`}
                      >
                        <Icon size={22} strokeWidth={2} />
                      </span>
                      <span className="rounded-lg p-1.5 text-slate-300 transition group-hover:bg-brand-red/10 group-hover:text-brand-red">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                    <h4 className="mt-4 font-display text-xl font-bold text-brand-ink">
                      {card.title}
                    </h4>
                    <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      {card.desc}
                    </p>
                    <span className="mt-4 text-xs font-bold text-brand-red opacity-0 transition group-hover:opacity-100">
                      Open →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
