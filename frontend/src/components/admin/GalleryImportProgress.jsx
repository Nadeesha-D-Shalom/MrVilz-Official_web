import { CheckCircle2, AlertCircle, Loader2, ImageIcon } from "lucide-react";

export default function GalleryImportProgress({ job, onClose }) {
  if (!job?.active && !job?.finished) return null;

  const doneCount = job.items.filter((i) => i.status === "done").length;
  const failCount = job.items.filter((i) => i.status === "error").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-lg">
      <div className="border-b border-slate-100 bg-gradient-to-r from-brand-cream/80 via-white to-brand-cream/50 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto h-24 w-24 shrink-0 sm:mx-0">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-brand-red transition-all duration-300"
                strokeDasharray={`${(job.overallPercent / 100) * 264} 264`}
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-extrabold text-brand-ink">
                {job.overallPercent}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {job.active ? "Uploading" : "Complete"}
              </span>
            </span>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="font-display text-lg font-bold text-brand-ink">
              {job.active
                ? job.phase === "upload"
                  ? "Sending images to server…"
                  : `Saving ${Math.min(job.currentIndex + 1, job.total)} of ${job.total}`
                : "Upload finished"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {job.active
                ? "Files are stored with secure hashed names on the server."
                : `${doneCount} saved${failCount ? ` · ${failCount} failed` : ""}`}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-red-mid transition-all duration-300 ease-out"
                style={{ width: `${job.overallPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto px-4 py-2 sm:px-5">
        {job.items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center gap-3 py-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                item.status === "done"
                  ? "bg-emerald-100 text-emerald-600"
                  : item.status === "error"
                    ? "bg-red-100 text-red-600"
                    : item.status === "active"
                      ? "bg-brand-red/10 text-brand-red"
                      : "bg-slate-100 text-slate-400"
              }`}
            >
              {item.status === "done" ? (
                <CheckCircle2 size={18} />
              ) : item.status === "error" ? (
                <AlertCircle size={18} />
              ) : item.status === "active" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ImageIcon size={18} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-ink">{item.title || item.name}</p>
              {item.hash ? (
                <p className="truncate font-mono text-[10px] text-slate-400">#{item.hash.slice(0, 12)}…</p>
              ) : (
                <p className="truncate text-xs text-slate-400">{item.name}</p>
              )}
              {item.status === "active" ? (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-red transition-all duration-200"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              ) : null}
              {item.error ? <p className="mt-0.5 text-xs text-red-600">{item.error}</p> : null}
            </div>
            <span className="shrink-0 text-xs font-bold tabular-nums text-slate-500">
              {item.status === "done" ? "100%" : item.status === "active" ? `${item.percent}%` : "—"}
            </span>
          </li>
        ))}
      </ul>

      {job.finished ? (
        <div className="border-t border-slate-100 px-5 py-4 text-center sm:text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-brand-ink px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-brown"
          >
            Done
          </button>
        </div>
      ) : null}
    </div>
  );
}
