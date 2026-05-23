import { useEffect, useState } from "react";
import { Briefcase, Mail, Phone, FileText, ExternalLink } from "lucide-react";
import api from "../../api/client";
import {
  AdminPageShell,
  AdminListCard,
  AdminSelect,
  AdminStatusBadge,
  AdminEmpty
} from "../../components/admin/AdminUi";

const STATUS_OPTIONS = ["new", "reviewing", "shortlisted", "rejected", "hired"];

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/admin/applications/jobs").then(({ data }) => setApplications(data.applications));
  }, []);

  async function updateStatus(id, status) {
    await api.patch(`/admin/applications/jobs/${id}`, { status });
    setApplications((rows) => rows.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <AdminPageShell description="Career applications with CV, LinkedIn, and professional details.">
      {applications.length === 0 ? (
        <AdminEmpty
          icon={Briefcase}
          title="No job applications"
          description="Applications from the careers page will appear here."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <AdminListCard key={app.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-ink">
                    {app.jobTitle}
                  </span>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-bold text-brand-ink">{app.fullName}</h2>
                    <AdminStatusBadge status={app.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={14} /> {app.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} /> {app.phone}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {app.address}, {app.city} · Age {app.age}
                    {app.currentRole ? ` · ${app.currentRole}` : ""}
                    {app.experienceYears != null ? ` · ${app.experienceYears} yrs exp.` : ""}
                  </p>
                  {app.coverLetter ? (
                    <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{app.coverLetter}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {app.cvUrl ? (
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-ink transition hover:bg-slate-50"
                      >
                        <FileText size={14} /> Download CV
                      </a>
                    ) : null}
                    {app.linkedinUrl ? (
                      <a
                        href={app.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-ink transition hover:bg-slate-50"
                      >
                        <ExternalLink size={14} /> LinkedIn
                      </a>
                    ) : null}
                    {app.portfolioUrl ? (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-ink transition hover:bg-slate-50"
                      >
                        <ExternalLink size={14} /> Portfolio
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 lg:w-44">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </label>
                  <AdminSelect value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </AdminSelect>
                </div>
              </div>
            </AdminListCard>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
