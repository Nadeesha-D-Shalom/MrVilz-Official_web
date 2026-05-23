import { motion } from "motion/react";

export default function MeshBackground({ variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className={`absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full blur-[100px] ${
          isDark ? "bg-white/10" : "bg-brand-red/8"
        }`}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute -right-1/4 top-1/4 h-[480px] w-[480px] rounded-full blur-[100px] ${
          isDark ? "bg-brand-red/15" : "bg-brand-parchment"
        }`}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className={`absolute inset-0 opacity-[0.35] ${
          isDark ? "bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_50%)]" : ""
        }`}
      />
    </div>
  );
}
