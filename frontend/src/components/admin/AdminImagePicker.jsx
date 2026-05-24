import { useEffect, useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

export default function AdminImagePicker({
  label = "Choose image",
  hint,
  currentSrc,
  onFileSelect,
  className = ""
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentSrc || "");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setPreview(currentSrc || "");
  }, [currentSrc]);

  function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onFileSelect?.(file);
  }

  return (
    <div className={className}>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 sm:h-24 sm:w-24">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="text-slate-300" size={28} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-ink transition hover:border-brand-ink/25 hover:bg-slate-50 sm:w-auto"
          >
            <Upload size={16} />
            Choose image
          </button>
          {fileName ? (
            <p className="mt-2 truncate text-xs font-semibold text-slate-500">{fileName}</p>
          ) : hint ? (
            <p className="mt-2 text-xs text-slate-400">{hint}</p>
          ) : (
            <p className="mt-2 text-xs text-slate-400">JPG, PNG, WebP, or GIF</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export function buildProjectFormData(project, imageFile) {
  const fd = new FormData();
  fd.append("title", project.title || "");
  if (project.summary !== undefined) fd.append("summary", project.summary || "");
  fd.append("progress", String(Number(project.progress) || 0));
  if (project.visual_layout || project.visualLayout) {
    fd.append("visualLayout", project.visual_layout || project.visualLayout);
  }
  if (imageFile) fd.append("image", imageFile);
  return fd;
}

export function buildTeamFormData(member, imageFile) {
  const fd = new FormData();
  fd.append("name", member.name || "");
  fd.append("position", member.position || "");
  const short =
    member.shortDescription ?? member.short_description ?? member.bio ?? "";
  fd.append("shortDescription", short);
  if (member.bio !== undefined) fd.append("bio", member.bio || "");
  if (member.isLeadership !== undefined) {
    fd.append("isLeadership", member.isLeadership ? "true" : "false");
  } else if (member.is_leadership !== undefined) {
    fd.append("isLeadership", member.is_leadership === 1 ? "true" : "false");
  }
  if (imageFile) fd.append("image", imageFile);
  return fd;
}
