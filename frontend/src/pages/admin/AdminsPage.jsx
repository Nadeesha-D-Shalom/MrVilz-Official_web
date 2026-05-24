import { useEffect, useState } from "react";
import {
  Shield,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Pencil,
  UserX,
  List
} from "lucide-react";
import api from "../../api/client";
import { loadAdminList } from "../../utils/adminDataLoad";
import { useAuth } from "../../context/AuthContext";
import { isSuperAdmin, ROLE_LABELS, effectiveRole } from "../../utils/adminRole";
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
import { AdminPasswordInput } from "../../components/admin/PasswordInput";

const EMPTY_FORM = {
  name: "",
  phone: "",
  address: "",
  email: "",
  username: "",
  password: "",
  role: "admin"
};

export default function AdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const canManageRoles = isSuperAdmin(currentAdmin);
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM, password: "", isActive: true });
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  function closeCreateForm() {
    setShowCreate(false);
    setForm(EMPTY_FORM);
    setError("");
  }

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
      const payload = { ...form };
      if (!canManageRoles) {
        delete payload.role;
      }
      await api.post("/admin/users", payload);
      setForm(EMPTY_FORM);
      setShowCreate(false);
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
      isActive: admin.isActive,
      role: admin.role || "admin"
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
      if (canManageRoles) {
        payload.role = editForm.role;
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
      description={`${activeCount} active admin${activeCount === 1 ? "" : "s"}. Manage staff logins or add a new admin account.`}
      loadError={loadError}
      action={
        showCreate ? (
          <AdminButton variant="secondary" onClick={closeCreateForm}>
            Cancel
          </AdminButton>
        ) : (
          <AdminAddButton onClick={() => setShowCreate(true)}>Add admin</AdminAddButton>
        )
      }
    >
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {showCreate ? (
      <AdminPanel
        title="Create admin"
        description="Add a new staff login with username, password, and contact details."
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
            <AdminPasswordInput
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => updateForm(setForm, "password", e.target.value)}
            />
          </AdminField>
          {canManageRoles ? (
            <AdminField label="Role" required className="sm:col-span-2">
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800"
                value={form.role}
                onChange={(e) => updateForm(setForm, "role", e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super admin</option>
              </select>
            </AdminField>
          ) : null}
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <AdminButton type="submit" loading={saving}>
              Create admin
            </AdminButton>
            <AdminButton variant="secondary" type="button" onClick={closeCreateForm}>
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminPanel>
      ) : null}

      <div className={showCreate ? "mt-6" : ""}>
        <AdminPanel
          title="Admin list"
          description="All admin accounts. Edit details or deactivate staff who should no longer log in."
          icon={List}
        >
          {admins.length === 0 ? (
            <AdminEmpty
              icon={Shield}
              title="No admin accounts yet"
              description='Click "Add admin" above to create the first staff login.'
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
                            <AdminPasswordInput
                              autoComplete="new-password"
                              value={editForm.password}
                              onChange={(e) => updateForm(setEditForm, "password", e.target.value)}
                            />
                          </AdminField>
                          {canManageRoles ? (
                            <AdminField label="Role" className="sm:col-span-2">
                              <select
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800"
                                value={editForm.role}
                                onChange={(e) => updateForm(setEditForm, "role", e.target.value)}
                              >
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super admin</option>
                              </select>
                            </AdminField>
                          ) : null}
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
                              <span className="text-sm font-semibold text-slate-700">
                                Active account
                              </span>
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
                                    admin.role === "super_admin"
                                      ? "bg-violet-100 text-violet-800"
                                      : "bg-sky-100 text-sky-800"
                                  }`}
                                >
                                  {ROLE_LABELS[effectiveRole(admin)] || "Admin"}
                                </span>
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
                              <p className="mt-0.5 text-sm font-semibold text-slate-500">
                                @{admin.username}
                              </p>
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
        </AdminPanel>
      </div>
    </AdminPageShell>
  );
}
