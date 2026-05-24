import { Facebook, Instagram, Link2, Music2, Youtube } from "lucide-react";
import ContactForm from "../../components/public/ContactForm";
import useReveal from "../../hooks/useReveal";
import { useSite } from "../../context/SiteDataContext";

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2
};

const pillars = [
  {
    title: "Let's build together",
    description:
      "Partnerships, press, volunteering — send a message and we'll respond soon."
  },
  {
    title: "Collaborate",
    description: "Brands, NGOs, schools — co-create conservation campaigns."
  },
  {
    title: "Volunteer",
    description: "Join cleanups, planting drives, and field media days."
  }
];

function ContactSocial({ links = [] }) {
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {links.map((link) => {
        const Icon = iconMap[link.icon] || iconMap[link.platform] || Link2;
        return (
          <a
            key={link.id || link.platform}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-ink/12 bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink shadow-sm transition hover:border-brand-ink/25 hover:bg-brand-ink hover:text-white"
          >
            <Icon size={18} aria-hidden />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}

export default function ContactPage() {
  const { data } = useSite();
  const headerReveal = useReveal();
  const pillarsReveal = useReveal();
  const socialReveal = useReveal();
  const formReveal = useReveal();

  return (
    <main className="min-h-screen bg-brand-cream pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div ref={headerReveal.ref} className={`reveal text-center ${headerReveal.className}`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Let&apos;s build together
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-brown sm:text-lg">
            Partnerships, press, volunteering — send a message and we&apos;ll respond soon.
          </p>
        </div>

        <div
          ref={pillarsReveal.ref}
          className={`reveal mt-12 grid gap-8 sm:mt-14 md:grid-cols-3 md:gap-6 lg:gap-10 ${pillarsReveal.className}`}
        >
          {pillars.map((item) => (
            <div key={item.title} className="text-center md:px-2">
              <h2 className="font-display text-lg font-bold text-brand-ink sm:text-xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-brown-lt sm:text-[15px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div
          ref={socialReveal.ref}
          className={`reveal mt-14 text-center sm:mt-16 ${socialReveal.className}`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">Social</p>
          <p className="mt-3 font-display text-2xl font-bold text-brand-ink sm:text-3xl">Mr Vilz Nature</p>
          <div className="mt-6">
            <ContactSocial links={data.socialLinks} />
          </div>
        </div>

        <div
          ref={formReveal.ref}
          className={`reveal mx-auto mt-14 max-w-3xl sm:mt-16 ${formReveal.className}`}
        >
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
