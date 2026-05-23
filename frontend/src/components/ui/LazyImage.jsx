export default function LazyImage({
  src,
  alt,
  className = "",
  aspectClass = "aspect-[4/3]"
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-brand-parchment text-brand-brown-lt ${aspectClass} ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-brand-parchment ${aspectClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
