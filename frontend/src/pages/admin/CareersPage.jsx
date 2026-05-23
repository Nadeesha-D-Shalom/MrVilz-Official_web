import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  LayoutList,
  FileText
} from "lucide-react";
import api from "../../api/client";
import { loadAdminList } from "../../utils/adminDataLoad";
import {
  AdminPageShell,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton
} from "../../components/admin/AdminUi";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "hidden", label: "Hidden" }
];

const emptyPost = {
  title: "",
  description: "",
  roleType: "",
  isPublished: false,
  sortOrder: 0
};

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function CareerPreviewCard({ post, compact }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
        compact ? "" : "max-w-xl"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-ink text-sm font-bold text-white">
          MV
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-brand-ink">Mr Vilz</p>
          <p className="text-xs text-slate-500">{formatDate(post.createdAt || post.updatedAt)}</p>
        </div>
        {!post.isPublished ? (
          <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
            Hidden
          </span>
        ) : null}
      </div>
      <div className="px-4 py-4">
        <h3 className="font-display text-lg font-bold text-brand-ink">{post.title || "Untitled"}</h3>
        {post.roleType ? (
          <p className="mt-1 text-xs font-semibold text-brand-brown-lt">{post.roleType}</p>
        ) : null}
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {post.description || "Add a description…"}
        </p>
      </div>
    </article>
  );
}

export default function CareersPage() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({ title: "", intro: "" });
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(emptyPost);
  const [editing, setEditing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function load() {
    loadAdminList(
      api.get("/admin/careers"),
      (d) => {
        setSettings(d.settings || { title: "", intro: "" });
        return d.posts;
      },
      setPosts,
      setLoadError
    );
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "published") return posts.filter((p) => p.isPublished);
    if (filter === "hidden") return posts.filter((p) => !p.isPublished);
    return posts;
  }, [posts, filter]);

  const selected = useMemo(
    () => posts.find((p) => p.id === selectedId) || null,
    [posts, selectedId]
  );

  function openNew() {
    setDraft({ ...emptyPost });
    setEditing(true);
    setView("edit");
    setSelectedId(null);
  }

  function openEdit(post) {
    setDraft({
      title: post.title,
      description: post.description,
      roleType: post.roleType || "",
      isPublished: Boolean(post.isPublished),
      sortOrder: post.sortOrder ?? 0
    });
    setSelectedId(post.id);
    setEditing(true);
    setView("edit");
  }

  function openDetail(post) {
    setSelectedId(post.id);
    setEditing(false);
    setView("detail");
  }

  async function saveSettings() {
    setSettingsSaving(true);
    setNotice("");
    try {
      const { data } = await api.put("/admin/careers-settings/page", settings);
      setSettings(data.settings);
      setNotice("Page settings saved.");
    } catch {
      setNotice("Could not save page settings.");
    } finally {
      setSettingsSaving(false);
    }
  }

  async function savePost() {
    if (!draft.title.trim() || !draft.description.trim()) {
      setNotice("Title and description are required.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      const payload = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        roleType: draft.roleType.trim() || null,
        isPublished: draft.isPublished,
        sortOrder: Number(draft.sortOrder) || 0
      };
      if (selectedId) {
        await api.put(`/admin/careers/${selectedId}`, payload);
      } else {
        await api.post("/admin/careers", payload);
      }
      setEditing(false);
      setView("list");
      setSelectedId(null);
      setDraft(emptyPost);
      load();
      setNotice("Career post saved.");
    } catch {
      setNotice("Could not save career post.");
    } finally {
      setSaving(false);
    }
  }

  async function removePost(id) {
    if (!confirm("Delete this career post? This cannot be undone.")) return;
    await api.delete(`/admin/careers/${id}`);
    if (selectedId === id) {
      setSelectedId(null);
      setView("list");
    }
    load();
    setNotice("Career post deleted.");
  }

  async function togglePublish(post) {
    await api.put(`/admin/careers/${post.id}`, { isPublished: !post.isPublished });
    load();
  }

  return (
    <AdminPageShell
      description="Manage career posts like LinkedIn — title, role type, and description. Hidden posts stay off the public careers page but remain visible here."
      loadError={loadError}
      action={
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-brown"
        >
          <Plus size={16} />
          New post
        </button>
      }
    >
      {notice ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          {notice}
        </p>
      ) : null}

      <AdminPanel title="Careers page header" icon={Briefcase}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Page title" required>
            <AdminInput
              value={settings.title}
              onChange={(e) => setSettings((s) => ({ ...s, title: e.target.value }))}
            />
          </AdminField>
          <AdminField label="Intro" className="sm:col-span-2">
            <AdminTextarea
              rows={3}
              value={settings.intro}
              onChange={(e) => setSettings((s) => ({ ...s, intro: e.target.value }))}
            />
          </AdminField>
        </div>
        <div className="mt-4 flex justify-end">
          <AdminButton loading={settingsSaving} onClick={saveSettings}>
            Save header
          </AdminButton>
        </div>
      </AdminPanel>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              filter === f.id
                ? "bg-brand-ink text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-70">
              (
              {f.id === "all"
                ? posts.length
                : f.id === "published"
                  ? posts.filter((p) => p.isPublished).length
                  : posts.filter((p) => !p.isPublished).length}
              )
            </span>
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => {
              setView("list");
              setEditing(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${
              view === "list" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            <LayoutList size={14} />
            All together
          </button>
          {selected ? (
            <button
              type="button"
              onClick={() => setView("detail")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${
                view === "detail" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              <FileText size={14} />
              Single view
            </button>
          ) : null}
        </div>
      </div>

      {view === "edit" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminPanel title={selectedId ? "Edit post" : "New post"} icon={Pencil}>
            <div className="space-y-4">
              <AdminField label="Title" required>
                <AdminInput
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Role type" hint="e.g. Volunteer, Internship, Part-time">
                <AdminInput
                  value={draft.roleType}
                  onChange={(e) => setDraft((d) => ({ ...d, roleType: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Description" required hint="Shown like a LinkedIn post body">
                <AdminTextarea
                  rows={10}
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                />
              </AdminField>
              <div className="flex flex-wrap gap-4">
                <AdminField label="Sort order">
                  <AdminInput
                    type="number"
                    min={0}
                    value={draft.sortOrder}
                    onChange={(e) => setDraft((d) => ({ ...d, sortOrder: e.target.value }))}
                    className="max-w-[120px]"
                  />
                </AdminField>
                <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.isPublished}
                    onChange={(e) => setDraft((d) => ({ ...d, isPublished: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Visible on public careers page
                </label>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setEditing(false);
                  setView(selectedId ? "detail" : "list");
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton loading={saving} onClick={savePost}>
                Save post
              </AdminButton>
            </div>
          </AdminPanel>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Preview</p>
            <CareerPreviewCard post={draft} />
          </div>
        </div>
      ) : view === "detail" && selected ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <CareerPreviewCard post={selected} />
          <div className="space-y-3">
            <AdminButton className="w-full" onClick={() => openEdit(selected)}>
              <Pencil size={16} className="mr-2 inline" />
              Edit
            </AdminButton>
            <AdminButton
              variant="secondary"
              className="w-full"
              onClick={() => togglePublish(selected)}
            >
              {selected.isPublished ? (
                <>
                  <EyeOff size={16} className="mr-2 inline" />
                  Hide from public
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2 inline" />
                  Publish
                </>
              )}
            </AdminButton>
            <button
              type="button"
              onClick={() => removePost(selected.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              type="button"
              onClick={() => {
                setView("list");
                setSelectedId(null);
              }}
              className="w-full text-center text-sm font-semibold text-slate-500 hover:text-brand-ink"
            >
              ← Back to all posts
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!filtered.length ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
              No career posts in this view. Create one or change the filter.
            </p>
          ) : (
            filtered.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between"
              >
                <button
                  type="button"
                  onClick={() => openDetail(post)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-brand-ink">{post.title}</h3>
                    {post.roleType ? (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {post.roleType}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        post.isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-600">
                    {post.description}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">Updated {formatDate(post.updatedAt)}</p>
                </button>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(post)}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    {post.isPublished ? "Hide" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removePost(post.id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminPageShell>
  );
}
