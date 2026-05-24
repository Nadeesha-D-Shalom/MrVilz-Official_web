import { useCallback, useEffect, useState } from "react";
import { Mail, MapPin, Pencil, Phone, Shield, User } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { effectiveRole, roleLabel } from "../../utils/adminRole";
import { AdminPageShell, AdminPanel, AdminButton } from "../../components/admin/AdminUi";
import ProfileEditDialog from "../../components/admin/ProfileEditDialog";

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-brand-ink">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { admin, updateAdmin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/auth/me");
      if (data?.admin) {
        setProfile(data.admin);
        updateAdmin(data.admin);
      }
    } catch (err) {
      setLoadError(err.response?.data?.message || "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }, [updateAdmin]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const display = profile || admin;
  const role = effectiveRole(display);

  async function handleSave(form) {
    if (!display?.id) return;
    setSaving(true);
    setEditError("");
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
      const { data } = await api.put(`/admin/users/${display.id}`, payload);
      setProfile(data.admin);
      updateAdmin(data.admin);
      setEditOpen(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setEditError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell
      description="Your account details for the Mr Vilz admin panel."
      loadError={loadError}
      action={
        <AdminButton icon={Pencil} onClick={() => setEditOpen(true)} disabled={loading || !display}>
          Edit profile
        </AdminButton>
      }
    >
      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {success}
        </p>
      ) : null}

      <AdminPanel title="My details" description="Read-only view of your account." icon={User}>
        {loading ? (
          <p className="text-sm text-slate-500">Loading profile…</p>
        ) : display ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/80 px-4 py-3">
              <Shield size={18} className="text-violet-600" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-violet-600/80">
                  Account role
                </p>
                <p className="text-sm font-bold text-violet-900">{roleLabel(display)}</p>
                <p className="text-xs text-violet-700/80">
                  {role === "super_admin"
                    ? "You can manage other admins and all site content."
                    : "You can manage site content. Admin management is for super admins only."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailRow icon={User} label="Full name" value={display.name} />
              <DetailRow icon={User} label="Username" value={`@${display.username}`} />
              <DetailRow icon={Mail} label="Email" value={display.email} />
              <DetailRow icon={Phone} label="Phone" value={display.phone} />
              <div className="sm:col-span-2">
                <DetailRow icon={MapPin} label="Address" value={display.address} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No profile data available.</p>
        )}
      </AdminPanel>

      <ProfileEditDialog
        open={editOpen}
        profile={display}
        onClose={() => {
          setEditOpen(false);
          setEditError("");
        }}
        onSave={handleSave}
        saving={saving}
        error={editError}
      />
    </AdminPageShell>
  );
}
