import { useEffect } from "react";
import { absoluteUrl } from "../../config/seo";

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function GalleryImageSchema({ sections = [] }) {
  useEffect(() => {
    const images = sections.flatMap((section) =>
      (section.items || []).map((item) => ({
        "@type": "ImageObject",
        contentUrl: item.imageUrl,
        url: item.imageUrl,
        name: item.altText || item.title,
        description: item.caption || `${section.title} — Mr Vilz MrVilz Nadeesha Shalom`,
        caption: item.caption || "",
        representativeOfPage: false,
        author: {
          "@type": "Organization",
          name: "Mr Vilz",
          alternateName: ["MrVilz", "mrvilz", "Nadeesha Shalom"]
        }
      }))
    );

    if (!images.length) return;

    upsertJsonLd("gallery-images-jsonld", {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Mr Vilz Official Gallery",
      description:
        "Official Mr Vilz (MrVilz) photo gallery — Nadeesha Shalom, beach cleanups, conservation projects Sri Lanka.",
      url: absoluteUrl("/gallery"),
      image: images,
      about: [
        { "@type": "Thing", name: "Mr Vilz" },
        { "@type": "Person", name: "Nadeesha Shalom" },
        { "@type": "Thing", name: "Environmental conservation Sri Lanka" }
      ]
    });

    return () => {
      document.getElementById("gallery-images-jsonld")?.remove();
    };
  }, [sections]);

  return null;
}
