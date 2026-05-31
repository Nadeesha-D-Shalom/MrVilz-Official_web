import { Link } from "react-router-dom";
import { ArrowUpRight, LayoutDashboard, Sparkles } from "lucide-react";
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
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-6 text-white shadow-2xl shadow-slate-900/25 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-red/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"
        />
        <div className="relative">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red">
            <LayoutDashboard size={12} />
            Overview
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Welcome back</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Manage your website, marketplace, team, and applications from one modern console.
          </p>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-white/90"
          >
            Preview live site
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {dashboardGroups.map((group) => (
        <section key={group.label}>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-brand-red" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {group.label}
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.accent}`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <span className="rounded-xl p-2 text-slate-300 transition group-hover:bg-brand-red/10 group-hover:text-brand-red">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-xl font-bold text-slate-900">{card.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{card.desc}</p>
                  <span className="mt-4 inline-flex text-xs font-bold text-brand-red opacity-0 transition group-hover:opacity-100">
                    Open section →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
