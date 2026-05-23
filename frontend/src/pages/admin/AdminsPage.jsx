import { useEffect, useState } from "react";
import {
  Shield,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Pencil,
  UserX
} from "lucide-react";
import api from "../../api/client";
import { loadAdminList } from "../../utils/adminDataLoad";
import { useAuth } from "../../context/AuthContext";
import {
  AdminPageShell,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminAddButton,
  AdminEmpty,
  AdminListCard
} from "../../components/admin/AdminUi";

const EMPTY_FORM = {
  name: "",
  phone: "",
  address: "",
  email: "",
  username: "",
  password: ""
};

export default function AdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM, password: "", isActive: true });
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    loadAdminList(api.get("/admin/users"), (d) => d.admins, setAdmins, setLoadError);
  }

  useEffect(() => {
    load();
  }, []);

  function updateForm(setter, key, value) {
    setter((f) => ({ ...f, [key]: value }));
    setError("");
  }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/admin/users", form);
      setForm(EMPTY_FORM);
      setShowAdd(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create admin.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(admin) {
    setEditingId(admin.id);
    setEditForm({
      name: admin.name || "",
      phone: admin.phone || "",
      address: admin.address || "",
      email: admin.email || "",
      username: admin.username || "",
      password: "",
      isActive: admin.isActive
    });
    setError("");
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        email: editForm.email,
        username: editForm.username,
        isActive: editForm.isActive
      };
      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }
      await api.put(`/admin/users/${editingId}`, payload);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update admin.");
    } finally {
      setSaving(false);
    }
  }

  async function deactivateAdmin(id) {
    if (!confirm("Deactivate this admin? They will not be able to log in.")) return;
    try {
      await api.patch(`/admin/users/${id}/deactivate`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not deactivate admin.");
    }
  }

  const activeCount = admins.filter((a) => a.isActive).length;

  return (
    <AdminPageShell
      description={`${activeCount} active admin${activeCount === 1 ? "" : "s"}. Add staff with login details and contact info.`}
      loadError={loadError}
      action={
        <AdminAddButton onClick={() => setShowAdd((v) => !v)}>Add admin</AdminAddButton>
      }
    >
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {showAdd ? (
        <AdminPanel
          title="New admin account"
          description="They can log in with the username and password you set."
          icon={UserPlus}
        >
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Full name" required>
              <AdminInput
                required
                value={form.name}
                onChange={(e) => updateForm(setForm, "name", e.target.value)}
              />
            </AdminField>
            <AdminField label="Username" required>
              <AdminInput
                required
                value={form.username}
                onChange={(e) => updateForm(setForm, "username", e.target.value)}
              />
            </AdminField>
            <AdminField label="Email" required>
              <AdminInput
                required
                type="email"
                value={form.email}
                onChange={(e) => updateForm(setForm, "email", e.target.value)}
              />
            </AdminField>
            <AdminField label="Phone" required>
              <AdminInput
                required
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm(setForm, "phone", e.target.value)}
              />
            </AdminField>
            <AdminField label="Address" required className="sm:col-span-2">
              <AdminTextarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => updateForm(setForm, "address", e.target.value)}
              />
            </AdminField>
            <AdminField label="Password" required hint="Minimum 8 characters" className="sm:col-span-2">
              <AdminInput
                required
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => updateForm(setForm, "password", e.target.value)}
              />
            </AdminField>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <AdminButton type="submit" loading={saving}>
                Create admin
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </AdminPanel>
      ) : null}

      {admins.length === 0 ? (
        <AdminEmpty
          icon={Shield}
          title="No admin accounts"
          description="Create the first additional admin using the button above."
        />
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => {
            const isEditing = editingId === admin.id;
            const isSelf = currentAdmin?.id === admin.id;

            return (
              <AdminListCard key={admin.id}>
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <p className="font-display text-lg font-bold text-brand-ink">Edit admin</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AdminField label="Full name" required>
                        <AdminInput
                          value={editForm.name}
                          onChange={(e) => updateForm(setEditForm, "name", e.target.value)}
                        />
                      </AdminField>
                      <AdminField label="Username" required>
                        <AdminInput
                          value={editForm.username}
                          onChange={(e) => updateForm(setEditForm, "username", e.target.value)}
                        />
                      </AdminField>
                      <AdminField label="Email" required>
                        <AdminInput
                          type="email"
                          value={editForm.email}
                          onChange={(e) => updateForm(setEditForm, "email", e.target.value)}
                        />
                      </AdminField>
                      <AdminField label="Phone" required>
                        <AdminInput
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => updateForm(setEditForm, "phone", e.target.value)}
                        />
                      </AdminField>
                      <AdminField label="Address" required className="sm:col-span-2">
                        <AdminTextarea
                          rows={2}
                          value={editForm.address}
                          onChange={(e) => updateForm(setEditForm, "address", e.target.value)}
                        />
                      </AdminField>
                      <AdminField
                        label="New password"
                        hint="Leave blank to keep current password"
                        className="sm:col-span-2"
                      >
                        <AdminInput
                          type="password"
                          autoComplete="new-password"
                          value={editForm.password}
                          onChange={(e) => updateForm(setEditForm, "password", e.target.value)}
                        />
                      </AdminField>
                      {!isSelf ? (
                        <label className="flex items-center gap-2 sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={editForm.isActive}
                            onChange={(e) =>
                              updateForm(setEditForm, "isActive", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          <span className="text-sm font-semibold text-slate-700">Active account</span>
                        </label>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AdminButton type="submit" loading={saving}>
                        Save changes
                      </AdminButton>
                      <AdminButton variant="secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </AdminButton>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                          <Shield size={22} />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-brand-ink">
                              {admin.name || admin.username}
                            </h3>
                            {isSelf ? (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                                You
                              </span>
                            ) : null}
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                admin.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {admin.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm font-semibold text-slate-500">@{admin.username}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          icon={Pencil}
                          onClick={() => startEdit(admin)}
                        >
                          Edit
                        </AdminButton>
                        {admin.isActive && !isSelf ? (
                          <AdminButton
                            variant="danger"
                            size="sm"
                            icon={UserX}
                            onClick={() => deactivateAdmin(admin.id)}
                          >
                            Deactivate
                          </AdminButton>
                        ) : null}
                      </div>
                    </div>

                    <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <li className="inline-flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {admin.email || "—"}
                      </li>
                      <li className="inline-flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {admin.phone || "—"}
                      </li>
                      <li className="inline-flex items-start gap-2 sm:col-span-2">
                        <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                        {admin.address || "—"}
                      </li>
                    </ul>
                  </>
                )}
              </AdminListCard>
            );
          })}
        </div>
      )}
    </AdminPageShell>
  );
}
