import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminProfileMenu from "../components/admin/AdminProfileMenu";
import AdminErrorBoundary from "../components/admin/AdminErrorBoundary";
import { ADMIN_NAV_GROUPS, ADMIN_EXTRA_PAGE_TITLES } from "../config/adminNav";

function getPageTitle(pathname) {
  if (ADMIN_EXTRA_PAGE_TITLES[pathname]) {
    return ADMIN_EXTRA_PAGE_TITLES[pathname];
  }

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
  const { isAuthenticated, logout, admin, refreshAdmin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAdmin().catch(() => {});
    }
  }, [isAuthenticated, refreshAdmin]);

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
    <div className="min-h-screen bg-[#f4f2ef]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-brand-ink/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100%,288px)] border-r border-slate-200/90 bg-white shadow-xl transition-transform duration-300 ease-out lg:z-30 lg:w-[260px] lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="absolute right-3 top-4 z-10 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <AdminSidebar admin={admin} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-brand-ink/8 bg-white/95 px-4 py-3.5 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-ink/10 bg-brand-cream text-brand-ink lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-red lg:hidden">
              Mr Vilz Admin
            </p>
            <h1 className="truncate font-display text-xl font-extrabold text-brand-ink sm:text-2xl">
              {pageTitle}
            </h1>
          </div>
          <AdminProfileMenu admin={admin} onLogout={logout} />
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
