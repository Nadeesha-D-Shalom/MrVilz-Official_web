import { motion } from "motion/react";
import { Facebook, Instagram, Youtube, Music2, Link2 } from "lucide-react";

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2
};

export default function SocialLinksBar({ links = [], variant = "floating" }) {
  if (!links.length) return null;

  const isFloating = variant === "floating";

  return (
    <motion.aside
      className={
        isFloating
          ? "fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
          : "flex flex-wrap items-center justify-center gap-3"
      }
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      aria-label="Social media links"
    >
      {links.map((link, index) => {
        const Icon = iconMap[link.icon] || iconMap[link.platform] || Link2;
        return (
          <motion.a
            key={link.id || link.platform}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            title={link.label}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-brand-ink/80 text-white shadow-xl backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.08 }}
          >
            <Icon size={20} />
            <span className="sr-only">{link.label}</span>
          </motion.a>
        );
      })}
    </motion.aside>
  );
}
