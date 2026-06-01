import { useEffect, useRef, useState } from "react";
import {
  Images,
  ImagePlus,
  Layers,
  Upload,
  Pencil,
  Plus,
  MapPin,
  FolderOpen,
  ChevronDown
} from "lucide-react";
import api from "../../api/client";
import GalleryImportProgress from "../../components/admin/GalleryImportProgress";
import MediaImage from "../../components/ui/MediaImage";
import {
  AdminPageShell,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminDeleteButton,
  AdminEmpty,
  AdminListCard
} from "../../components/admin/AdminUi";

const EMPTY_META = { title: "", caption: "", altText: "" };
const EMPTY_SECTION = { title: "", location: "", project: "", description: "" };

function previewUrl(file) {
  return URL.createObjectURL(file);
}

export default function GalleryAdminPage() {
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({ title: "", intro: "" });
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [mode, setMode] = useState("single");
  const [meta, setMeta] = useState(EMPTY_META);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [importJob, setImportJob] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    caption: "",
    altText: "",
    sectionId: "",
    file: null,
    preview: ""
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [sectionForm, setSectionForm] = useState(EMPTY_SECTION);
  const [sectionSaving, setSectionSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [expandedSection, setExpandedSection] = useState(null);
  const fileInputRef = useRef(null);
  const editFileRef = useRef(null);

  function showNotice(message, type = "success") {
    setNotice(message);
    setNoticeType(type);
  }

  function load() {
    api
      .get("/admin/gallery")
      .then(({ data }) => {
        setSections(data.sections || []);
        setItems(data.items || []);
        setSettings(data.settings || { title: "", intro: "" });
        if (!selectedSectionId && data.sections?.length) {
          setSelectedSectionId(data.sections[0].id);
        }
      })
      .catch((err) => {
        showNotice(
          err.response?.data?.message ||
            "Could not load gallery. Restart the backend server and try again.",
          "error"
        );
      });
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const urls = files.map((f) => previewUrl(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function onFilesSelected(list) {
    const next = Array.from(list || []).filter((f) => f.type.startsWith("image/"));
    setFiles(next);
  }

  async function uploadFiles(selectedFiles, formMeta, sectionId) {
    const fileList = Array.from(selectedFiles);
    if (!fileList.length) return;

    showNotice("", "success");
    const jobItems = fileList.map((f, i) => ({
      name: f.name,
      title:
        fileList.length > 1
          ? formMeta.title
            ? `${formMeta.title} ${i + 1}`
            : f.name
          : formMeta.title || f.name,
      percent: 0,
      status: "pending",
      error: null,
      hash: null
    }));

    setImportJob({
      active: true,
      finished: false,
      phase: "upload",
      overallPercent: 0,
      currentIndex: 0,
      total: fileList.length,
      items: jobItems
    });

    const formData = new FormData();
    fileList.forEach((f) => formData.append("images", f));
    if (sectionId) formData.append("sectionId", sectionId);
    if (formMeta.title) formData.append("title", formMeta.title);
    if (formMeta.caption) formData.append("caption", formMeta.caption);
    if (formMeta.altText) formData.append("altText", formMeta.altText);

    try {
      const { data } = await api.post("/admin/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const pct = Math.round((event.loaded / event.total) * 85);
          setImportJob((j) =>
            j
              ? {
                  ...j,
                  phase: "upload",
                  overallPercent: pct,
                  items: j.items.map((it) =>
                    it.status === "pending" ? { ...it, status: "active", percent: pct } : it
                  )
                }
              : j
          );
        }
      });

      const saved = data.items || [];
      setImportJob((j) =>
        j
          ? {
              ...j,
              phase: "done",
              overallPercent: 100,
              active: false,
              finished: true,
              items: j.items.map((it, idx) => ({
                ...it,
                status: "done",
                percent: 100,
                hash: saved[idx]?.file_hash || null
              }))
            }
          : j
      );

      setFiles([]);
      setMeta(EMPTY_META);
      if (fileInputRef.current) fileInputRef.current.value = "";
      load();
      showNotice(`${saved.length} image(s) uploaded.`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Upload failed";
      showNotice(message, "error");
      setImportJob((j) =>
        j
          ? {
              ...j,
              active: false,
              finished: true,
              items: j.items.map((it) => ({ ...it, status: "error", error: message }))
            }
          : j
      );
    }
  }

  function handleAddSubmit(event) {
    event.preventDefault();
    uploadFiles(files, meta, selectedSectionId);
  }

  async function saveSection(event) {
    event.preventDefault();
    const pageTitle = settings.title.trim() || sectionForm.title.trim();
    const sectionTitle = sectionForm.title.trim() || settings.title.trim();

    if (!pageTitle) {
      showNotice("Page title is required.", "error");
      return;
    }
    if (!sectionTitle) {
      showNotice("Section title is required.", "error");
      return;
    }

    setSectionSaving(true);
    showNotice("", "success");
    try {
      const { data } = await api.put("/admin/gallery/bundle", {
        pageTitle,
        intro: settings.intro || sectionForm.description,
        sectionTitle,
        location: sectionForm.location,
        project: sectionForm.project,
        description: sectionForm.description,
        sectionId: editingSection || undefined
      });

      if (data.settings) setSettings(data.settings);
      if (data.section?.id) setSelectedSectionId(data.section.id);

      setSectionForm(EMPTY_SECTION);
      setEditingSection(null);
      load();
      showNotice(
        editingSection
          ? "Gallery section updated."
          : "Gallery section saved. You can now upload images."
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? "Gallery API not found — restart or redeploy the backend server."
          : null) ||
        err.message ||
        "Could not save section.";
      showNotice(message, "error");
    } finally {
      setSectionSaving(false);
    }
  }

  function startEditSection(section) {
    setEditingSection(section.id);
    setSectionForm({
      title: section.title,
      location: section.location || "",
      project: section.project || "",
      description: section.description || ""
    });
  }

  async function removeSection(id) {
    if (!confirm("Delete this section? It must have no images first.")) return;
    try {
      await api.delete(`/admin/gallery-sections/${id}`);
      if (selectedSectionId === id) setSelectedSectionId("");
      load();
      showNotice("Section deleted.");
    } catch (err) {
      showNotice(err.response?.data?.message || "Could not delete section.", "error");
    }
  }

  function startEdit(item) {
    setEditing(item.id);
    setEditForm({
      title: item.title || "",
      caption: item.caption || "",
      altText: item.altText || item.alt_text || "",
      sectionId: item.sectionId || "",
      file: null,
      preview: item.imageUrl || item.image_url
    });
    setEditError("");
  }

  function onEditFile(file) {
    if (!file) return;
    if (editForm.preview?.startsWith("blob:")) URL.revokeObjectURL(editForm.preview);
    setEditForm((f) => ({ ...f, file, preview: previewUrl(file) }));
  }

  async function saveEdit(event) {
    event.preventDefault();
    setEditSaving(true);
    setEditError("");
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("caption", editForm.caption);
      formData.append("altText", editForm.altText);
      formData.append("sectionId", editForm.sectionId);
      if (editForm.file) formData.append("image", editForm.file);

      await api.put(`/admin/gallery/${editing}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setEditing(null);
      load();
      showNotice("Image updated.");
    } catch (err) {
      setEditError(err.response?.data?.message || "Could not save changes.");
    } finally {
      setEditSaving(false);
    }
  }

  async function removeItem(id) {
    if (!confirm("Remove this gallery image?")) return;
    await api.delete(`/admin/gallery/${id}`);
    if (editing === id) setEditing(null);
    load();
    showNotice("Image removed.");
  }

  const itemsBySection = sections.map((section) => ({
    section,
    items: items.filter((item) => item.sectionId === section.id)
  }));

  return (
    <AdminPageShell description="Create a gallery section (title, location, project), save it, then upload images. Images use SEO alt text for Google Images.">
      {notice ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            noticeType === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-900"
          }`}
        >
          {notice}
        </p>
      ) : null}

      <AdminPanel
        title={editingSection ? "Edit gallery section" : "Gallery section & page header"}
        description="Save the public page title and create a photo section in one step."
        icon={FolderOpen}
      >
        <form onSubmit={saveSection} className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Page title" required hint="Shown at the top of the public gallery">
            <AdminInput
              value={settings.title}
              onChange={(e) => setSettings((s) => ({ ...s, title: e.target.value }))}
              placeholder="e.g. Beach Cleaning Project"
            />
          </AdminField>
          <AdminField label="Section title" required hint="Heading for this photo group">
            <AdminInput
              value={sectionForm.title}
              onChange={(e) => setSectionForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="e.g. Clean Panadura Beach"
            />
          </AdminField>
          <AdminField label="Location" hint="e.g. Panadura, Sri Lanka">
            <AdminInput
              value={sectionForm.location}
              onChange={(e) => setSectionForm((s) => ({ ...s, location: e.target.value }))}
            />
          </AdminField>
          <AdminField label="Project" hint="e.g. Beach Cleanup 2025">
            <AdminInput
              value={sectionForm.project}
              onChange={(e) => setSectionForm((s) => ({ ...s, project: e.target.value }))}
            />
          </AdminField>
          <AdminField label="Page intro / description" className="sm:col-span-2">
            <AdminTextarea
              rows={2}
              value={settings.intro}
              onChange={(e) => setSettings((s) => ({ ...s, intro: e.target.value }))}
              placeholder="Short intro shown on the gallery page"
            />
          </AdminField>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <AdminButton type="submit" loading={sectionSaving} icon={editingSection ? Pencil : Plus}>
              {editingSection ? "Update section" : "Save section"}
            </AdminButton>
            {editingSection ? (
              <AdminButton
                variant="secondary"
                type="button"
                onClick={() => {
                  setEditingSection(null);
                  setSectionForm(EMPTY_SECTION);
                }}
              >
                Cancel
              </AdminButton>
            ) : null}
          </div>
        </form>
      </AdminPanel>

      {sections.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="font-display font-bold text-slate-900">{section.title}</h3>
              {section.project ? (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <FolderOpen size={12} /> {section.project}
                </p>
              ) : null}
              {section.location ? (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={12} /> {section.location}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-slate-400">
                {items.filter((i) => i.sectionId === section.id).length} image(s)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <AdminButton
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    startEditSection(section);
                  }}
                >
                  Edit
                </AdminButton>
                <AdminDeleteButton label="Delete" onClick={() => removeSection(section.id)} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty
          icon={FolderOpen}
          title="No sections yet"
          description="Create a section first, then upload images into it."
        />
      )}

      {importJob ? (
        <GalleryImportProgress job={importJob} onClose={() => setImportJob(null)} />
      ) : null}

      <AdminPanel
        title="Upload images to section"
        description="Select a section, then choose images from your device."
        icon={Upload}
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <AdminField label="Gallery section" hint="Optional — uses General section if none selected">
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900"
            >
              <option value="">General (default)</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                  {s.project ? ` — ${s.project}` : ""}
                </option>
              ))}
            </select>
          </AdminField>

          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200/80 bg-slate-50 p-1.5">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold sm:flex-none ${
                mode === "single" ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
            >
              <ImagePlus size={16} /> One image
            </button>
            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold sm:flex-none ${
                mode === "bulk" ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
            >
              <Layers size={16} /> Multiple
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Image title (optional)">
              <AdminInput
                value={meta.title}
                onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Caption (optional)">
              <AdminInput
                value={meta.caption}
                onChange={(e) => setMeta((m) => ({ ...m, caption: e.target.value }))}
              />
            </AdminField>
            <AdminField
              label="Alt text (optional)"
              hint="For Google Images — defaults include Mr Vilz, Nadeesha Shalom"
              className="sm:col-span-2"
            >
              <AdminInput
                value={meta.altText}
                onChange={(e) => setMeta((m) => ({ ...m, altText: e.target.value }))}
              />
            </AdminField>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 transition hover:border-brand-red/40">
            <Upload className="text-slate-400" size={32} />
            <span className="mt-3 font-display text-lg font-bold text-slate-900">
              {mode === "single" ? "Choose an image" : "Choose images"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple={mode === "bulk"}
              className="sr-only"
              onChange={(e) => onFilesSelected(e.target.files)}
            />
          </label>

          {files.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {files.map((file, i) => (
                <div key={`${file.name}-${i}`} className="overflow-hidden rounded-xl border bg-white">
                  <img src={previews[i]} alt="" className="aspect-square w-full object-cover" />
                  <p className="truncate px-2 py-1.5 text-xs font-semibold text-slate-600">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <AdminButton
            type="submit"
            disabled={!files.length || importJob?.active}
            loading={importJob?.active}
          >
            Upload images
          </AdminButton>
        </form>
      </AdminPanel>

      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900">
          All images ({items.length})
        </h2>

        {!items.length ? (
          <AdminEmpty icon={Images} title="No images yet" description="Create a section and upload images." />
        ) : (
          <div className="space-y-4">
            {itemsBySection.map(({ section, items: sectionItems }) =>
              sectionItems.length ? (
                <div key={section.id} className="rounded-2xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSection(expandedSection === section.id ? null : section.id)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div>
                      <p className="font-display font-bold text-slate-900">{section.title}</p>
                      <p className="text-xs text-slate-500">{sectionItems.length} image(s)</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition ${expandedSection === section.id ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedSection === section.id || expandedSection === null ? (
                    <div className="space-y-3 border-t border-slate-100 p-4">
                      {sectionItems.map((item) =>
                        editing === item.id ? (
                          <AdminListCard key={item.id}>
                            <form onSubmit={saveEdit} className="space-y-4">
                              {editError ? (
                                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                                  {editError}
                                </p>
                              ) : null}
                              <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
                                <div>
                                  <img
                                    src={editForm.preview}
                                    alt=""
                                    className="aspect-square w-full rounded-xl object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => editFileRef.current?.click()}
                                    className="mt-2 w-full rounded-lg border py-2 text-xs font-bold"
                                  >
                                    Replace
                                  </button>
                                  <input
                                    ref={editFileRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="sr-only"
                                    onChange={(e) => onEditFile(e.target.files?.[0])}
                                  />
                                </div>
                                <div className="space-y-3">
                                  <AdminField label="Section">
                                    <select
                                      value={editForm.sectionId}
                                      onChange={(e) =>
                                        setEditForm((f) => ({ ...f, sectionId: e.target.value }))
                                      }
                                      className="w-full rounded-xl border px-3 py-2 text-sm"
                                    >
                                      {sections.map((s) => (
                                        <option key={s.id} value={s.id}>
                                          {s.title}
                                        </option>
                                      ))}
                                    </select>
                                  </AdminField>
                                  <AdminField label="Title">
                                    <AdminInput
                                      value={editForm.title}
                                      onChange={(e) =>
                                        setEditForm((f) => ({ ...f, title: e.target.value }))
                                      }
                                    />
                                  </AdminField>
                                  <AdminField label="Caption">
                                    <AdminTextarea
                                      rows={2}
                                      value={editForm.caption}
                                      onChange={(e) =>
                                        setEditForm((f) => ({ ...f, caption: e.target.value }))
                                      }
                                    />
                                  </AdminField>
                                  <AdminField label="Alt text (Google Images)">
                                    <AdminInput
                                      value={editForm.altText}
                                      onChange={(e) =>
                                        setEditForm((f) => ({ ...f, altText: e.target.value }))
                                      }
                                    />
                                  </AdminField>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <AdminButton type="submit" loading={editSaving}>
                                  Save
                                </AdminButton>
                                <AdminButton variant="secondary" onClick={() => setEditing(null)}>
                                  Cancel
                                </AdminButton>
                              </div>
                            </form>
                          </AdminListCard>
                        ) : (
                          <article key={item.id} className="flex gap-4 rounded-xl border p-3">
                            <MediaImage
                              src={item.imageUrl || item.image_url}
                              alt={item.altText || item.title}
                              aspectClass="aspect-square w-24 shrink-0 rounded-lg"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-900">{item.title || "Untitled"}</p>
                              {item.caption ? (
                                <p className="text-sm text-slate-500">{item.caption}</p>
                              ) : null}
                              <div className="mt-2 flex gap-2">
                                <AdminButton size="sm" variant="secondary" onClick={() => startEdit(item)}>
                                  Edit
                                </AdminButton>
                                <AdminDeleteButton onClick={() => removeItem(item.id)} />
                              </div>
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}
