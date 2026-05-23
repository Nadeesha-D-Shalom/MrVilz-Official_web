import { useEffect, useRef, useState } from "react";
import { Images, ImagePlus, Layers, Upload, Pencil } from "lucide-react";
import api from "../../api/client";
import GalleryImportProgress from "../../components/admin/GalleryImportProgress";
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

const EMPTY_META = { title: "", caption: "" };

function previewUrl(file) {
  return URL.createObjectURL(file);
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("single");
  const [meta, setMeta] = useState(EMPTY_META);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [importJob, setImportJob] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", caption: "", file: null, preview: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const fileInputRef = useRef(null);
  const editFileRef = useRef(null);

  function load() {
    api.get("/admin/gallery").then(({ data }) => setItems(data.items));
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

  async function uploadFiles(selectedFiles, formMeta) {
    const fileList = Array.from(selectedFiles);
    if (!fileList.length) return;

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
    if (formMeta.title) formData.append("title", formMeta.title);
    if (formMeta.caption) formData.append("caption", formMeta.caption);

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
      setImportJob((j) => {
        if (!j) return j;
        return {
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
        };
      });

      setFiles([]);
      setMeta(EMPTY_META);
      if (fileInputRef.current) fileInputRef.current.value = "";
      load();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Upload failed";
      setImportJob((j) =>
        j
          ? {
              ...j,
              active: false,
              finished: true,
              overallPercent: 100,
              items: j.items.map((it) => ({
                ...it,
                status: "error",
                error: message
              }))
            }
          : j
      );
    }
  }

  function handleAddSubmit(event) {
    event.preventDefault();
    uploadFiles(files, meta);
  }

  function startEdit(item) {
    setEditing(item.id);
    setEditForm({
      title: item.title || "",
      caption: item.caption || "",
      file: null,
      preview: item.image_url
    });
    setEditError("");
  }

  function onEditFile(file) {
    if (!file) return;
    if (editForm.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(editForm.preview);
    }
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
      if (editForm.file) formData.append("image", editForm.file);

      await api.put(`/admin/gallery/${editing}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setEditing(null);
      load();
    } catch (err) {
      setEditError(err.response?.data?.message || "Could not save changes.");
    } finally {
      setEditSaving(false);
    }
  }

  async function removeItem(id) {
    if (!confirm("Remove this gallery item?")) return;
    await api.delete(`/admin/gallery/${id}`);
    if (editing === id) setEditing(null);
    load();
  }

  return (
    <AdminPageShell description="Choose images from your device — they are saved on the server with secure hashed file names. Edit title, caption, or replace the photo anytime.">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
            mode === "single"
              ? "bg-brand-ink text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ImagePlus size={16} />
          One image
        </button>
        <button
          type="button"
          onClick={() => setMode("bulk")}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
            mode === "bulk"
              ? "bg-brand-ink text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Layers size={16} />
          Multiple images
        </button>
      </div>

      {importJob ? (
        <GalleryImportProgress job={importJob} onClose={() => setImportJob(null)} />
      ) : null}

      <AdminPanel
        title={mode === "single" ? "Add one image" : "Add multiple images"}
        description="JPG, PNG, WebP, or GIF from your computer — no external URLs."
        icon={Upload}
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Title (optional)">
              <AdminInput
                placeholder={mode === "bulk" ? "e.g. Beach cleanup (adds 1, 2, 3…)" : "e.g. Beach cleanup 2025"}
                value={meta.title}
                onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Caption (optional)">
              <AdminInput
                placeholder="Shown on the public gallery"
                value={meta.caption}
                onChange={(e) => setMeta((m) => ({ ...m, caption: e.target.value }))}
              />
            </AdminField>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 transition hover:border-brand-red/40 hover:bg-brand-cream/30">
            <Upload className="text-brand-brown-lt" size={32} />
            <span className="mt-3 font-display text-lg font-bold text-brand-ink">
              {mode === "single" ? "Choose an image" : "Choose images"}
            </span>
            <span className="mt-1 text-sm text-slate-500">
              {mode === "single" ? "Click to browse (1 file)" : "Click to browse (many files)"}
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
                <div
                  key={`${file.name}-${i}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <img
                    src={previews[i]}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
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
            Upload {files.length ? `${files.length} image${files.length > 1 ? "s" : ""}` : ""} to gallery
          </AdminButton>
        </form>
      </AdminPanel>

      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-brand-ink">
          Gallery ({items.length})
        </h2>

        {items.length === 0 ? (
          <AdminEmpty icon={Images} title="Gallery is empty" description="Upload your first image above." />
        ) : (
          <div className="space-y-4">
            {items.map((item) =>
              editing === item.id ? (
                <AdminListCard key={item.id}>
                  <form onSubmit={saveEdit} className="space-y-4">
                    <p className="font-display text-lg font-bold text-brand-ink">Edit gallery item</p>
                    {editError ? (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                        {editError}
                      </p>
                    ) : null}
                    <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                          Photo
                        </p>
                        <img
                          src={editForm.preview}
                          alt=""
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => editFileRef.current?.click()}
                          className="mt-2 w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-brand-ink hover:bg-slate-50"
                        >
                          Replace image
                        </button>
                        <input
                          ref={editFileRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="sr-only"
                          onChange={(e) => onEditFile(e.target.files?.[0])}
                        />
                        {item.file_hash ? (
                          <p className="mt-2 truncate font-mono text-[10px] text-slate-400" title={item.file_hash}>
                            Stored as #{item.file_hash.slice(0, 16)}…
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-4">
                        <AdminField label="Title">
                          <AdminInput
                            value={editForm.title}
                            onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                          />
                        </AdminField>
                        <AdminField label="Caption">
                          <AdminTextarea
                            rows={3}
                            value={editForm.caption}
                            onChange={(e) => setEditForm((f) => ({ ...f, caption: e.target.value }))}
                          />
                        </AdminField>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AdminButton type="submit" loading={editSaving}>
                        Save changes
                      </AdminButton>
                      <AdminButton variant="secondary" onClick={() => setEditing(null)}>
                        Cancel
                      </AdminButton>
                    </div>
                  </form>
                </AdminListCard>
              ) : (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:flex"
                >
                  <div className="relative aspect-video w-full shrink-0 bg-slate-100 sm:aspect-square sm:w-40">
                    <img
                      src={item.image_url}
                      alt={item.title || "Gallery"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                    <div>
                      <p className="font-display font-bold text-brand-ink">{item.title || "Untitled"}</p>
                      {item.caption ? (
                        <p className="mt-1 text-sm text-slate-500">{item.caption}</p>
                      ) : null}
                      {item.file_hash ? (
                        <p className="mt-1 font-mono text-[10px] text-slate-400">
                          #{item.file_hash.slice(0, 20)}…
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <AdminButton variant="secondary" size="sm" icon={Pencil} onClick={() => startEdit(item)}>
                        Edit
                      </AdminButton>
                      <AdminDeleteButton onClick={() => removeItem(item.id)} />
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}
