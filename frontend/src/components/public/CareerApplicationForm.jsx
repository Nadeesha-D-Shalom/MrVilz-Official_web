import { useState } from "react";
import {
  Upload,
  Linkedin,
  Link2,
  Briefcase,
  User,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText
} from "lucide-react";
import { submitJobApplication } from "../../api/client";

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Professional", icon: Briefcase },
  { id: 3, label: "Submit", icon: FileText }
];

const initialForm = {
  jobTitle: "",
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  age: "",
  gender: "",
  linkedinUrl: "",
  portfolioUrl: "",
  currentRole: "",
  experienceYears: ""
};

export default function CareerApplicationForm({ jobTitle }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...initialForm, jobTitle: jobTitle || "" });
  const [cv, setCv] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validateStep(targetStep) {
    const next = {};
    if (targetStep >= 2) {
      if (!form.fullName.trim()) next.fullName = "Required";
      if (!form.email.trim()) next.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Invalid email";
      if (!form.phone.trim()) next.phone = "Required";
      if (!form.address.trim()) next.address = "Required";
      if (!form.city.trim()) next.city = "Required";
      if (!form.age || Number(form.age) < 16) next.age = "Enter a valid age";
      if (!form.gender) next.gender = "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (step === 1 && validateStep(2)) setStep(2);
    else if (step === 2) setStep(3);
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!cv) {
      setStatus("no-cv");
      return;
    }
    if (!validateStep(2)) {
      setStep(1);
      return;
    }

    setStatus("sending");
    const payload = new FormData();
    const data = { ...form, jobTitle: form.jobTitle || jobTitle };
    Object.entries(data).forEach(([key, value]) => payload.append(key, value));
    payload.append("coverLetter", "");
    payload.append("additionalInfo", "");
    payload.append("cv", cv);

    try {
      await submitJobApplication(payload);
      setStatus("success");
      setCv(null);
      setStep(1);
      setForm({ ...initialForm, jobTitle: jobTitle || "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-brand-ink/8 bg-white p-10 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="mt-6 font-display text-2xl font-bold">Application sent</h3>
        <p className="mt-2 text-brand-brown-lt">
          Thank you for applying to <strong className="text-brand-ink">{jobTitle}</strong>. We will
          review your CV and get in touch.
        </p>
      </div>
    );
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border border-brand-ink/8 bg-white shadow-[0_24px_70px_rgba(26,16,8,0.1)]"
    >
      <div className="border-b border-brand-ink/8 bg-gradient-to-r from-brand-cream via-white to-brand-cream px-6 py-6 md:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">
          Step {step} of {STEPS.length}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold text-brand-ink">Job application</h3>
        <p className="mt-1 text-sm text-brand-brown-lt">
          Role: <strong className="text-brand-ink">{jobTitle || form.jobTitle}</strong>
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-brand-ink/10">
          <div
            className="h-full rounded-full bg-brand-ink transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="mt-5 flex justify-between gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <li
                key={s.id}
                className={`flex flex-1 flex-col items-center gap-1.5 text-center ${
                  active ? "text-brand-ink" : done ? "text-brand-brown" : "text-brand-brown-lt/70"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                    active
                      ? "border-brand-ink bg-brand-ink text-white"
                      : done
                        ? "border-brand-ink bg-brand-ink/10 text-brand-ink"
                        : "border-brand-ink/15 bg-white"
                  }`}
                >
                  {done ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        {step === 1 ? (
          <section className="animate-[fadeIn_0.35s_ease]">
            <h4 className="font-display text-xl font-bold">Personal information</h4>
            <p className="mt-1 text-sm text-brand-brown-lt">Tell us how to reach you.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full name" required error={errors.fullName} className="md:col-span-2">
                <input
                  className="form-input"
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </Field>
              <Field label="Email" required error={errors.email}>
                <input
                  className="form-input"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <input
                  className="form-input"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </Field>
              <Field label="Address" required error={errors.address} className="md:col-span-2">
                <input
                  className="form-input"
                  required
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </Field>
              <Field label="City" required error={errors.city}>
                <input
                  className="form-input"
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </Field>
              <Field label="Age" required error={errors.age}>
                <input
                  className="form-input"
                  type="number"
                  min="16"
                  max="80"
                  required
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                />
              </Field>
              <Field label="Gender" required error={errors.gender} className="md:col-span-2">
                <select
                  className="form-input"
                  required
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </Field>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="animate-[fadeIn_0.35s_ease]">
            <h4 className="font-display text-xl font-bold">Professional profile</h4>
            <p className="mt-1 text-sm text-brand-brown-lt">Share your experience and links.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="LinkedIn URL" icon={Linkedin}>
                <input
                  className="form-input"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedinUrl}
                  onChange={(e) => update("linkedinUrl", e.target.value)}
                />
              </Field>
              <Field label="Portfolio / website" icon={Link2}>
                <input
                  className="form-input"
                  type="url"
                  placeholder="https://"
                  value={form.portfolioUrl}
                  onChange={(e) => update("portfolioUrl", e.target.value)}
                />
              </Field>
              <Field label="Current role" icon={Briefcase}>
                <input
                  className="form-input"
                  placeholder="e.g. Content Creator"
                  value={form.currentRole}
                  onChange={(e) => update("currentRole", e.target.value)}
                />
              </Field>
              <Field label="Years of experience">
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="0"
                  value={form.experienceYears}
                  onChange={(e) => update("experienceYears", e.target.value)}
                />
              </Field>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="animate-[fadeIn_0.35s_ease]">
            <h4 className="font-display text-xl font-bold">Upload & submit</h4>
            <p className="mt-1 text-sm text-brand-brown-lt">
              Attach your CV to complete the application.
            </p>

            <div className="mt-6 rounded-2xl border border-brand-ink/8 bg-brand-cream/40 p-5">
              <h5 className="text-xs font-bold uppercase tracking-widest text-brand-brown-lt">
                Summary
              </h5>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-brand-brown-lt">Name</dt>
                  <dd className="font-semibold">{form.fullName}</dd>
                </div>
                <div>
                  <dt className="text-brand-brown-lt">Email</dt>
                  <dd className="font-semibold">{form.email}</dd>
                </div>
                <div>
                  <dt className="text-brand-brown-lt">Phone</dt>
                  <dd className="font-semibold">{form.phone}</dd>
                </div>
                <div>
                  <dt className="text-brand-brown-lt">City</dt>
                  <dd className="font-semibold">{form.city}</dd>
                </div>
                {form.currentRole ? (
                  <div className="sm:col-span-2">
                    <dt className="text-brand-brown-lt">Current role</dt>
                    <dd className="font-semibold">{form.currentRole}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-ink/20 bg-white px-6 py-12 transition hover:border-brand-ink/40 hover:bg-brand-cream/30">
              <Upload className="text-brand-brown-lt" size={28} />
              <span className="mt-3 font-display text-lg font-bold">CV / Resume *</span>
              <span className="mt-1 text-xs text-brand-brown-lt">PDF, DOC, or DOCX</span>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  setCv(e.target.files?.[0] || null);
                  setStatus("idle");
                }}
              />
              {cv ? (
                <span className="mt-4 rounded-full bg-brand-ink/5 px-4 py-1.5 text-sm font-semibold text-brand-ink">
                  {cv.name}
                </span>
              ) : null}
            </label>

            {status === "no-cv" ? (
              <p className="mt-3 text-sm font-semibold text-brand-red">Please upload your CV.</p>
            ) : null}
            {status === "error" ? (
              <p className="mt-3 text-sm font-semibold text-brand-red">
                Submission failed. Please try again.
              </p>
            ) : null}
          </section>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-brand-ink/8 bg-brand-cream/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-10">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-ink/15 bg-white px-6 py-3 text-sm font-bold text-brand-ink transition hover:bg-brand-cream"
          >
            <ChevronLeft size={18} /> Back
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-ink px-8 py-3 text-sm font-bold text-white transition hover:bg-brand-brown sm:ml-auto"
          >
            Continue <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-10 py-3.5 text-sm font-bold text-white transition hover:bg-brand-red-mid disabled:opacity-60 sm:ml-auto"
          >
            {status === "sending" ? "Submitting…" : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, required, error, icon: Icon, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-brand-ink">
        {Icon ? <Icon size={15} className="text-brand-brown-lt" /> : null}
        {label}
        {required ? <span className="text-brand-red">*</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs font-semibold text-brand-red">{error}</span> : null}
    </label>
  );
}
