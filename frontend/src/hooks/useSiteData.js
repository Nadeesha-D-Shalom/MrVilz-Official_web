import { useEffect, useState } from "react";
import { fetchSiteData } from "../api/client";

const defaultData = {
  hero: {
    eyebrow: "Protecting Sri Lanka's marine future",
    title: "Mr Vilz",
    subtitle: "We are striving to protect the marine environment of Sri Lanka.",
    primaryAction: { label: "Be Involved", href: "#projects" },
    secondaryAction: { label: "Contact", href: "/contact" },
    mediaType: "image",
    mediaUrl: "/images/background.png",
    mediaAlt: "Mr Vilz hero background"
  },
  about: { title: "What Mr Vilz Does", paragraphs: [] },
  stats: [],
  socialLinks: [],
  team: [],
  projects: []
};

export default function useSiteData() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const site = await fetchSiteData();
        if (mounted) {
          setData({ ...defaultData, ...site, hero: { ...defaultData.hero, ...site.hero } });
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load site data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error, setData };
}
