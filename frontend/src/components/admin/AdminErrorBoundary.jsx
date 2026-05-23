import { Component } from "react";
import { Link } from "react-router-dom";

export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Admin panel error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="font-display text-xl font-bold text-brand-ink">Admin panel error</p>
          <p className="mt-2 text-sm text-slate-600">
            Something went wrong loading this page. Try signing in again or refresh.
          </p>
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-left font-mono text-xs text-red-700">
            {this.state.error.message}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-bold text-white"
            >
              Reload
            </button>
            <Link
              to="/admin/login"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-brand-ink"
              onClick={() => {
                localStorage.removeItem("mrvilz_admin_token");
                localStorage.removeItem("mrvilz_admin_user");
              }}
            >
              Sign in again
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
