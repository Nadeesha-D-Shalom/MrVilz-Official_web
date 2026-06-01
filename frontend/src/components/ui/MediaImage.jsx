import { resolveMediaUrl } from "../../utils/mediaUrl";

export default function MediaImage({
  src,
  alt,
  className = "",
  aspectClass = "",
  loading = "lazy"
}) {
  const url = resolveMediaUrl(src);

  if (!url) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${aspectClass} ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-slate-100 ${aspectClass} ${className}`}>
      <img
        src={url}
        alt={alt || "Mr Vilz gallery"}
        loading={loading}
        decoding="async"
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement?.classList.add("flex", "items-center", "justify-center");
          if (e.currentTarget.parentElement) {
            e.currentTarget.parentElement.dataset.broken = "true";
          }
        }}
      />
    </div>
  );
}
