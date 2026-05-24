import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton
} from "./AdminUi";
import { AdminPasswordInput } from "./PasswordInput";

const EMPTY = {
  name: "",
  username: "",
  email: "",
  phone: "",
  address: "",
  password: ""
};

export default function ProfileEditDialog({ open, profile, onClose, onSave, saving, error }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open && profile) {
      setForm({
        name: profile.name || "",
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        password: ""
      });
    }
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="profile-edit-title" className="font-display text-lg font-bold text-brand-ink">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-4">
          {error ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <div className="space-y-3">
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
            <AdminField label="Address" required>
              <AdminTextarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </AdminField>
            <AdminField label="New password" hint="Leave blank to keep current password">
              <AdminPasswordInput
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </AdminField>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <AdminButton variant="secondary" type="button" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" loading={saving}>
              Save changes
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
}
