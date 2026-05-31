import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Lock, Sparkles } from "lucide-react";
import { adminLogin } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/public/Logo";
import { PublicPasswordInput } from "../../components/admin/PasswordInput";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function triggerShake() {
    setShakeKey((k) => k + 1);
  }

  function validate() {
    const errs = {};
    if (!form.username.trim()) errs.username = "Please enter your username";
    if (!form.password) errs.password = "Please enter your password";
    setFieldErrors(errs);
    if (Object.keys(errs).length) triggerShake();
    return Object.keys(errs).length === 0;
  }

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
    setFieldErrors((p) => ({ ...p, [key]: "" }));
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await adminLogin(form);
      login(data);
      navigate("/admin");
    } catch {
      setFormError("Incorrect username or password. Please check and try again.");
      setFieldErrors({});
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-cream">
      <aside className="relative hidden lg:flex w-[42%] max-w-xl flex-col justify-between overflow-hidden bg-brand-ink px-10 py-10 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-red/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <Link
          to="/"
          className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Back to website
        </Link>

        <div className="relative z-10 py-10 text-center">
          <Logo
            variant="onDark"
            className="mx-auto h-28 w-auto max-w-[min(100%,260px)] object-contain sm:h-32 sm:max-w-[300px]"
          />
          <p className="mt-8 font-display text-3xl font-extrabold">
            Mr <span className="text-brand-red">Vilz</span> Admin
          </p>
          <p className="mt-2 text-sm text-white/65">Nature · Media · Conservation</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Marketplace", "Gallery", "Team", "Careers"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold text-white/85"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm leading-relaxed text-white/55">
          Secure console for managing content, marketplace products, team, careers, and applications.
        </p>
      </aside>

      <main className="relative flex flex-1 flex-col justify-center px-5 py-12 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,0,10,0.08),transparent_50%)]" />
        <Link
          to="/"
          className="relative mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-brown-lt hover:text-brand-ink lg:hidden"
        >
          <ArrowLeft size={16} /> Back to website
        </Link>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-brand-ink/8 bg-white shadow-[0_24px_60px_rgba(26,16,8,0.12)]"
        >
          <div className="border-b border-brand-ink/6 bg-gradient-to-r from-brand-cream/80 to-white px-7 py-6 sm:px-9">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              <Sparkles size={14} /> Admin access
            </p>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-brand-ink sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-brand-brown-lt">Sign in to manage your public website</p>
          </div>

          <div className="px-7 py-7 sm:px-9 sm:py-8">
            <div className="space-y-5" key={shakeKey}>
              <LoginField
                label="Username"
                id="admin-username"
                value={form.username}
                error={fieldErrors.username}
                shake={Boolean(formError)}
                onChange={(v) => updateField("username", v)}
                autoComplete="username"
              />
              <label htmlFor="admin-password" className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-brown-lt">
                  Password
                </span>
                <PublicPasswordInput
                  id="admin-password"
                  value={form.password}
                  invalid={Boolean(fieldErrors.password || formError)}
                  onChange={(v) => updateField("password", v)}
                  autoComplete="current-password"
                />
                {fieldErrors.password ? (
                  <p className="mt-1.5 text-xs font-semibold text-brand-red">{fieldErrors.password}</p>
                ) : null}
              </label>
            </div>

            {formError ? (
              <p
                className="field-shake mt-5 rounded-xl border border-brand-red/25 bg-brand-red/5 px-4 py-3 text-sm font-semibold text-brand-red"
                role="alert"
              >
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-ink py-3.5 text-sm font-bold text-white transition hover:bg-brand-brown disabled:opacity-60"
            >
              <Lock size={16} />
              {loading ? "Signing in…" : "Enter dashboard"}
            </button>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-brand-brown-lt">
              <Leaf size={12} />
              Mr Vilz official admin panel
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

function LoginField({ label, id, value, error, shake = false, onChange, autoComplete }) {
  const showMsg = Boolean(error && error.trim());
  const invalid = showMsg || shake;

  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-brand-brown-lt">{label}</span>
      <input
        id={id}
        type="text"
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input mt-2 ${invalid ? "field-shake border-brand-red ring-2 ring-brand-red/15" : ""}`}
        aria-invalid={invalid}
        aria-describedby={showMsg ? `${id}-error` : undefined}
      />
      {showMsg ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-brand-red">
          {error}
        </p>
      ) : null}
    </label>
  );
}
