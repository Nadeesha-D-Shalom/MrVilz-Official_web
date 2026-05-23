export default function SectionHeader({
  label,
  title,
  description,
  align = "center",
  titleClass = "",
  descriptionClass = ""
}) {
  const alignClass =
    align === "left" ? "text-left" : "mx-auto max-w-3xl text-center";

  return (
    <header className={alignClass}>
      {label ? (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">{label}</p>
      ) : null}
      <h2
        className={`mt-3 font-display text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl lg:text-5xl ${titleClass}`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed text-brand-brown-lt sm:text-lg ${descriptionClass}`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
