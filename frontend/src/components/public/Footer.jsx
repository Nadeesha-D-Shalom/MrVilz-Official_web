import { ArrowUpRight, Leaf, Sparkles, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import ScrollLink from "../navigation/ScrollLink";
import { ORGANIZATION } from "../../config/seo";

const explore = [
  { to: "/", label: "Home" },
  { to: "/#about", label: "About" },
  { to: "/#projects", label: "Projects" },
  { to: "/gallery", label: "Gallery" },
  { to: "/discover", label: "AI Discover" }
];

const engage = [
  { to: "/careers", label: "Careers" },
  { to: "/join", label: "Become a Member" },
  { to: "/team-members", label: "Our Team Members" },
  { to: "/contact", label: "Contact" }
];

export default function Footer({ socialLinks = [] }) {
  return (
    <footer className="relative mt-16 overflow-hidden bg-brand-ink text-white sm:mt-24">
      <div className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:py-14 md:flex-row md:items-center lg:px-8">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red-light">
              <Sparkles size={14} /> Make an impact
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl md:text-4xl">
              Ready to protect Sri Lanka together?
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <ScrollLink
              to="/join"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-ink transition hover:bg-white/90 sm:px-7"
            >
              Apply now <ArrowUpRight size={18} />
            </ScrollLink>
            <ScrollLink
              to="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold transition hover:bg-white/10 sm:px-7"
            >
              AI Discover <Sparkles size={16} />
            </ScrollLink>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="shrink-0 overflow-hidden rounded-2xl sm:rounded-[1.25rem]">
              <Logo
                variant="footer"
                className="block h-12 w-auto max-w-[130px] rounded-2xl object-contain sm:h-14 sm:max-w-[150px]"
              />
            </div>
            <div>
              <p className="font-display text-xl font-bold sm:text-2xl">Mr Vilz</p>
              <p className="text-sm text-white/55">Social Media Group</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-justify text-sm leading-relaxed text-white/65">
            {ORGANIZATION.description}
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs text-white/45">
            <MapPin size={14} /> {ORGANIZATION.areaServed}
          </p>
        </div>

        <div className="sm:col-span-1 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.to}>
                {l.to.includes("#") ? (
                  <a href={l.to} className="text-sm text-white/75 transition hover:text-white">
                    {l.label}
                  </a>
                ) : (
                  <ScrollLink to={l.to} className="text-sm text-white/75 transition hover:text-white">
                    {l.label}
                  </ScrollLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-1 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">Engage</p>
          <ul className="mt-4 space-y-2.5">
            {engage.map((l) => (
              <li key={l.to}>
                <ScrollLink to={l.to} className="text-sm text-white/75 transition hover:text-white">
                  {l.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">Connect</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.id || link.platform}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10 sm:px-4 sm:py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
          <ScrollLink
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red-light hover:text-white"
          >
            <Mail size={16} /> Send a message
          </ScrollLink>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400/90">
              <Leaf size={14} /> AI & search optimized
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/55">
              Structured for environment, entertainment & creative discovery — see{" "}
              <ScrollLink to="/discover" className="font-semibold text-white underline">
                /discover
              </ScrollLink>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Mr Vilz. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <ScrollLink to="/discover" className="hover:text-white/70">
              Entity profile
            </ScrollLink>
            <a href="/llms.txt" className="hover:text-white/70">
              llms.txt
            </a>
            <ScrollLink to="/admin/login" className="hover:text-white/70">
              Admin
            </ScrollLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
