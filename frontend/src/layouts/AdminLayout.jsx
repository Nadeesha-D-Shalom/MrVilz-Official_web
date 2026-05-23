import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminErrorBoundary from "../components/admin/AdminErrorBoundary";
import { ADMIN_NAV_GROUPS } from "../config/adminNav";

function getPageTitle(pathname) {
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.end && (pathname === "/admin" || pathname === "/admin/")) {
        return item.label;
      }
      if (!item.end && pathname.startsWith(item.to)) {
        return item.label;
      }
    }
  }
  return "Admin";
}

export default function AdminLayout() {
  const { isAuthenticated, logout, admin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-brand-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,280px)] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out lg:z-30 lg:w-64 lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <AdminSidebar
          admin={admin}
          onLogout={logout}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-ink shadow-sm lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 lg:hidden">
              MrVilz Admin
            </p>
            <h1 className="truncate font-display text-lg font-bold text-brand-ink sm:text-xl">
              {pageTitle}
            </h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            <span className="max-w-[120px] truncate text-xs font-semibold text-slate-600">
              {admin?.username}
            </span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
}
