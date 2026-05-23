import ContactForm from "../../components/public/ContactForm";
import SocialLinksBar from "../../components/public/SocialLinksBar";
import useReveal from "../../hooks/useReveal";
import { useSite } from "../../context/SiteDataContext";

export default function ContactPage() {
  const { data } = useSite();
  const headerReveal = useReveal();
  const sideReveal = useReveal();
  const formReveal = useReveal();

  return (
    <main className="min-h-screen bg-brand-cream pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div ref={headerReveal.ref} className={`reveal ${headerReveal.className}`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown-lt">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-6xl">Let&apos;s build together</h1>
          <p className="mt-4 max-w-xl text-lg text-brand-brown">
            Partnerships, press, volunteering — send a message and we&apos;ll respond soon.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div ref={sideReveal.ref} className={`reveal space-y-5 ${sideReveal.className}`}>
            {[
              { t: "Collaborate", d: "Brands, NGOs, schools — co-create conservation campaigns." },
              { t: "Volunteer", d: "Join cleanups, planting drives, and field media days." },
              { t: "Media", d: "Interviews, features, and creative collaborations." }
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-brand-ink/8 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-display font-bold">{item.t}</h3>
                <p className="mt-1 text-sm text-brand-brown-lt">{item.d}</p>
              </div>
            ))}
            <div className="pt-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-brown-lt">
                Social
              </p>
              <SocialLinksBar links={data.socialLinks} variant="inline" />
            </div>
          </div>

          <div ref={formReveal.ref} className={`reveal ${formReveal.className}`}>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
