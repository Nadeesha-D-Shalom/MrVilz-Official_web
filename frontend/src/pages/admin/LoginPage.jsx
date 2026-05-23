import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { adminLogin } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/public/Logo";

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
    <div className="flex min-h-screen bg-brand-cream">
      {/* Left — compact white brand */}
      <aside className="relative hidden w-full max-w-sm flex-col justify-between border-r border-brand-ink/8 bg-white px-8 py-8 lg:flex xl:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown-lt transition hover:text-brand-ink"
        >
          <ArrowLeft size={16} /> Back to website
        </Link>

        <div className="py-6 text-center">
          <Logo className="mx-auto h-16 w-auto max-w-[140px] object-contain" />
          <p className="mt-5 font-display text-2xl font-extrabold text-brand-ink">
            Mr <span className="text-gradient-brand">Vilz</span>
          </p>
          <p className="mt-1 text-xs font-medium text-brand-brown-lt">Nature · Media · Action</p>
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {["Content", "Projects", "Team", "Gallery"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-ink/10 bg-brand-cream px-2.5 py-0.5 text-[10px] font-bold text-brand-brown"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] leading-relaxed text-brand-brown-lt">
          Admin workspace for Mr Vilz — protect Sri Lanka&apos;s environment.
        </p>
      </aside>

      {/* Right — sign in */}
      <main className="flex flex-1 flex-col justify-center px-5 py-10 sm:px-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-brown-lt hover:text-brand-ink lg:hidden"
        >
          <ArrowLeft size={16} /> Back to website
        </Link>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md rounded-2xl border border-brand-ink/8 bg-white p-7 shadow-[0_20px_50px_rgba(26,16,8,0.08)] sm:p-9"
        >
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            <Sparkles size={14} /> Admin access
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-brand-ink sm:text-3xl">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-brand-brown-lt">
            Manage stats, team, projects, gallery & applications
          </p>

          <div className="mt-8 space-y-5" key={shakeKey}>
            <LoginField
              label="Username"
              id="admin-username"
              value={form.username}
              error={fieldErrors.username}
              shake={Boolean(formError)}
              onChange={(v) => updateField("username", v)}
              autoComplete="username"
            />
            <LoginField
              label="Password"
              id="admin-password"
              type="password"
              value={form.password}
              error={fieldErrors.password}
              shake={Boolean(formError)}
              onChange={(v) => updateField("password", v)}
              autoComplete="current-password"
            />
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
            className="mt-8 w-full rounded-xl bg-brand-red py-3.5 text-sm font-bold text-white transition hover:bg-brand-red-mid disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter dashboard"}
          </button>
        </form>
      </main>
    </div>
  );
}

function LoginField({
  label,
  id,
  type = "text",
  value,
  error,
  shake = false,
  onChange,
  autoComplete
}) {
  const showMsg = Boolean(error && error.trim());
  const invalid = showMsg || shake;

  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-brand-brown-lt">
        {label}
      </span>
      <input
        id={id}
        type={type}
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
