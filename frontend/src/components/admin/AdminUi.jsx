import { useState } from "react";
import { Check, Loader2, Plus, Trash2, Save } from "lucide-react";

export function AdminLoadError({ message }) {
  if (!message) return null;
  return (
    <p className="rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm">
      {message}
    </p>
  );
}

export function AdminPageShell({ description, children, action, loadError }) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminLoadError message={loadError} />
      {(description || action) && (
        <div className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-6">
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
          ) : (
            <span />
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminPanel({ title, description, children, footer, icon: Icon }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      {(title || description) && (
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            {Icon ? (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                <Icon size={20} />
              </span>
            ) : null}
            <div>
              {title ? (
                <h2 className="font-display text-xl font-bold text-slate-900">{title}</h2>
              ) : null}
              {description ? <p className="mt-0.5 text-xs text-slate-500">{description}</p> : null}
            </div>
          </div>
        </div>
      )}
      <div className="px-5 py-5 sm:px-6">{children}</div>
      {footer ? (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

export function AdminField({ label, hint, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
          {required ? <span className="text-brand-red"> *</span> : null}
        </span>
      ) : null}
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function AdminInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 ${props.className || ""}`}
    />
  );
}

export function AdminTextarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 ${props.className || ""}`}
    />
  );
}

export function AdminSelect(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 ${props.className || ""}`}
    />
  );
}

export function AdminButton({
  variant = "primary",
  size = "md",
  loading,
  icon: Icon,
  children,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-brand-red text-white hover:bg-brand-red-mid shadow-lg shadow-brand-red/20 hover:shadow-brand-red/30",
    secondary:
      "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/15",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-sm gap-2"
  };

  const { type = "button", ...rest } = props;

  return (
    <button
      type={type}
      disabled={loading || rest.disabled}
      className={`inline-flex items-center justify-center rounded-xl font-bold transition disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

export function AdminEmpty({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
      {Icon ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <Icon size={26} />
        </span>
      ) : null}
      <p className="mt-4 font-display text-lg font-bold text-slate-700">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

export function AdminSaveNotice({ status, message }) {
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Loader2 size={14} className="animate-spin" /> Saving…
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <Check size={14} /> Saved
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="max-w-xs text-xs font-semibold text-brand-red" title={message}>
        {message || "Save failed"}
      </span>
    );
  }
  return null;
}

export function AdminStatusBadge({ status }) {
  const styles = {
    new: "bg-sky-100 text-sky-800",
    read: "bg-slate-100 text-slate-600",
    reviewing: "bg-amber-100 text-amber-800",
    shortlisted: "bg-violet-100 text-violet-800",
    rejected: "bg-red-100 text-red-700",
    hired: "bg-emerald-100 text-emerald-800"
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[status] || styles.new}`}
    >
      {status}
    </span>
  );
}

export function AdminListCard({ children, className = "" }) {
  return (
    <article
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-6 ${className}`}
    >
      {children}
    </article>
  );
}

export function AdminAddButton({ onClick, children = "Add new" }) {
  return (
    <AdminButton variant="dark" icon={Plus} onClick={onClick}>
      {children}
    </AdminButton>
  );
}

export function AdminDeleteButton({ onClick, label = "Remove" }) {
  return (
    <AdminButton variant="danger" size="sm" icon={Trash2} onClick={onClick}>
      {label}
    </AdminButton>
  );
}

export function AdminSaveAllButton({ onClick, loading, disabled, count }) {
  return (
    <AdminButton
      variant="dark"
      icon={Save}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      Save all{count != null && count > 0 ? ` (${count})` : ""}
    </AdminButton>
  );
}

export function useRowSaveState() {
  const [states, setStates] = useState({});
  const [errors, setErrors] = useState({});
  const [savingAll, setSavingAll] = useState(false);

  async function runSave(id, fn) {
    setStates((s) => ({ ...s, [id]: "saving" }));
    setErrors((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });
    try {
      await fn();
      setStates((s) => ({ ...s, [id]: "saved" }));
      setTimeout(() => {
        setStates((s) => {
          const next = { ...s };
          delete next[id];
          return next;
        });
      }, 2000);
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Save failed. Check connection and try again.";
      setStates((s) => ({ ...s, [id]: "error" }));
      setErrors((s) => ({ ...s, [id]: message }));
      setTimeout(() => {
        setErrors((s) => {
          const next = { ...s };
          delete next[id];
          return next;
        });
      }, 5000);
      return false;
    }
  }

  async function runSaveAll(items, saveOne) {
    if (!items?.length) return { saved: 0, failed: 0 };
    setSavingAll(true);
    let saved = 0;
    let failed = 0;
    for (const item of items) {
      const ok = await runSave(item.id, () => saveOne(item));
      if (ok) saved += 1;
      else failed += 1;
    }
    setSavingAll(false);
    return { saved, failed };
  }

  const anySaving = savingAll || Object.values(states).some((s) => s === "saving");

  return { states, errors, savingAll, anySaving, runSave, runSaveAll };
}
