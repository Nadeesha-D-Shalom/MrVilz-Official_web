import { Link } from "react-router-dom";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import { ADMIN_DASHBOARD_GROUPS } from "../../config/adminNav";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-brand-cream/40 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-brand-red">
              <LayoutDashboard size={14} />
              Overview
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-ink sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Manage your public website content, team, messages, and applications from the
              sections below.
            </p>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-brown"
          >
            Preview site
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {ADMIN_DASHBOARD_GROUPS.map((group) => (
          <section key={group.label}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              {group.label}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.to}
                    to={card.to}
                    className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-brand-red/25 hover:shadow-md"
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
                    <h4 className="mt-4 font-display text-lg font-bold text-brand-ink">
                      {card.title}
                    </h4>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
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
