import { useEffect, useState } from "react";
import { UserPlus, Mail, Phone, MapPin } from "lucide-react";
import api from "../../api/client";
import {
  AdminPageShell,
  AdminListCard,
  AdminSelect,
  AdminStatusBadge,
  AdminEmpty
} from "../../components/admin/AdminUi";

const STATUS_OPTIONS = ["new", "reviewing", "shortlisted", "rejected", "hired"];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/admin/applications/team").then(({ data }) => setApplications(data.applications));
  }, []);

  async function updateStatus(id, status) {
    await api.patch(`/admin/applications/team/${id}`, { status });
    setApplications((rows) => rows.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <AdminPageShell description="Volunteer and “become a member” sign-ups — personal details only, no CV.">
      {applications.length === 0 ? (
        <AdminEmpty
          icon={UserPlus}
          title="No applications yet"
          description="Member applications will appear here when someone submits the form."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <AdminListCard key={app.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-bold text-brand-ink">{app.fullName}</h2>
                    <AdminStatusBadge status={app.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={14} /> {app.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} /> {app.phone}
                    </span>
                  </div>
                  <p className="mt-2 inline-flex items-start gap-1.5 text-sm text-slate-600">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    {app.address}, {app.city} · Age {app.age} · {app.gender}
                  </p>
                  {app.message ? (
                    <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                      {app.message}
                    </p>
                  ) : null}
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
