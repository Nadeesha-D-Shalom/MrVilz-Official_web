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
    <div className="admin-shell min-h-screen bg-[#eef1f7]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100%,300px)] transition-transform duration-300 ease-out lg:z-30 lg:w-[272px] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="absolute right-3 top-4 z-10 rounded-xl p-2 text-white/70 hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <AdminSidebar admin={admin} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 px-4 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-sm lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red lg:hidden">
                Admin Console
              </p>
              <h1 className="truncate font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
                {pageTitle}
              </h1>
            </div>
            <AdminProfileMenu admin={admin} onLogout={logout} />
          </div>
        </header>

        <main className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.04)_1px,transparent_0)] [background-size:24px_24px]"
          />
          <div className="relative">
            <AdminErrorBoundary>
              <Outlet />
            </AdminErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
