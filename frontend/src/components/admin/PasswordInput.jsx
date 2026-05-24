import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AdminInput } from "./AdminUi";

export function AdminPasswordInput({ className = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <AdminInput
        {...props}
        type={visible ? "text" : "password"}
        className={`pr-11 ${props.className || ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function PublicPasswordInput({
  id,
  value,
  onChange,
  className = "",
  invalid = false,
  autoComplete,
  placeholder
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input mt-2 pr-11 ${invalid ? "field-shake border-brand-red ring-2 ring-brand-red/15" : ""} ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-[calc(50%+4px)] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-brand-brown-lt transition hover:bg-brand-cream hover:text-brand-ink"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
