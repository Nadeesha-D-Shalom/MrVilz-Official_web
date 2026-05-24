import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../utils/adminRole";
import {
  AdminPageShell,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton
} from "../../components/admin/AdminUi";
import { AdminPasswordInput } from "../../components/admin/PasswordInput";

export default function ProfilePage() {
  const { admin, updateAdmin } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      setLoading(true);
      try {
        const { data } = await api.get("/auth/me");
        if (!cancelled && data.admin) {
          updateAdmin(data.admin);
          setForm({
            name: data.admin.name || "",
            username: data.admin.username || "",
            email: data.admin.email || "",
            phone: data.admin.phone || "",
            address: data.admin.address || "",
            password: ""
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load your profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [updateAdmin]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!admin?.id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        address: form.address
      };
      if (form.password.trim()) {
        payload.password = form.password;
      }
      const { data } = await api.put(`/admin/users/${admin.id}`, payload);
      updateAdmin(data.admin);
      setForm((f) => ({ ...f, password: "" }));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell description="View and update your account details and password.">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {success}
        </p>
      ) : null}

      <AdminPanel
        title="My profile"
        description="These details are used for your admin account."
        icon={User}
      >
        {loading ? (
          <p className="text-sm text-slate-500">Loading profile…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
              <Shield size={16} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-600">Role</span>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-800">
                {ROLE_LABELS[admin?.role] || "Admin"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Full name" required>
                <AdminInput
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </AdminField>
              <AdminField label="Username" required>
                <AdminInput
                  required
                  value={form.username}
                  onChange={(e) => updateField("username", e.target.value)}
                />
              </AdminField>
              <AdminField label="Email" required>
                <AdminInput
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </AdminField>
              <AdminField label="Phone" required>
                <AdminInput
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </AdminField>
              <AdminField label="Address" required className="sm:col-span-2">
                <AdminTextarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </AdminField>
              <AdminField
                label="New password"
                hint="Leave blank to keep your current password"
                className="sm:col-span-2"
              >
                <AdminPasswordInput
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
              </AdminField>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <AdminButton type="submit" loading={saving}>
                Save profile
              </AdminButton>
            </div>

            <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <li className="inline-flex items-center gap-2">
                <Mail size={14} className="text-slate-400" />
                {form.email || "—"}
              </li>
              <li className="inline-flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                {form.phone || "—"}
              </li>
              <li className="inline-flex items-start gap-2 sm:col-span-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                {form.address || "—"}
              </li>
            </ul>
          </form>
        )}
      </AdminPanel>
    </AdminPageShell>
  );
}
