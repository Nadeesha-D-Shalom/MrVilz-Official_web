import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import { submitContact } from "../../api/client";

const fields = [
  { key: "name", label: "Full Name", icon: User, type: "text", required: true },
  { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
  { key: "phone", label: "Phone Number", icon: Phone, type: "tel", required: false },
  { key: "subject", label: "Subject", icon: MessageSquare, type: "text", required: false }
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-brand-ink/8 bg-white p-8 shadow-[0_20px_60px_rgba(26,16,8,0.08)] md:p-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-8 border-b border-brand-ink/8 pb-6">
        <h3 className="font-display text-2xl font-bold">Send a message</h3>
        <p className="mt-2 text-sm text-brand-brown-lt">
          We typically respond within 2–3 business days.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {fields.map(({ key, label, icon: Icon, type, required }) => (
          <label key={key} className={`block ${key === "subject" ? "md:col-span-2" : ""}`}>
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-brown-lt">
              <Icon size={14} />
              {label}
            </span>
            <input
              className="form-input"
              type={type}
              value={form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              required={required}
            />
          </label>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-brown-lt">
          <MessageSquare size={14} />
          Message
        </span>
        <textarea
          className="form-input min-h-36 resize-y"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          required
          placeholder="Tell us how we can help..."
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-ink py-3.5 font-bold text-white transition hover:bg-brand-brown disabled:opacity-60 md:w-auto md:px-10"
      >
        <Send size={18} />
        {status === "sending" ? "Sending..." : "Submit message"}
      </button>

      {status === "success" ? (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          Thank you — your message was sent successfully.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-brand-red">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </motion.form>
  );
}
