import { useEffect } from "react";
import { fetchCareers } from "../../api/client";
import { SITE_URL } from "../../config/seo";

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

/** Injects JobPosting schema for published careers (Google Jobs / AI discovery) */
export default function CareersJobSchema() {
  useEffect(() => {
    let cancelled = false;

    fetchCareers()
      .then((data) => {
        if (cancelled) return;
        const posts = data?.careers?.posts || [];
        if (!posts.length) {
          const el = document.getElementById("seo-jobs-jsonld");
          if (el) el.remove();
          return;
        }

        upsertJsonLd("seo-jobs-jsonld", {
          "@context": "https://schema.org",
          "@graph": posts.map((post) => ({
            "@type": "JobPosting",
            title: post.title,
            description: post.description,
            hiringOrganization: {
              "@type": "Organization",
              name: "Mr Vilz",
              sameAs: SITE_URL,
              logo: `${SITE_URL}/mrVilz_logo.png`
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressCountry: "LK",
                addressRegion: "Sri Lanka"
              }
            },
            employmentType: post.roleType || "VOLUNTEER",
            datePosted: post.createdAt || new Date().toISOString(),
            url: `${SITE_URL}/careers/apply?role=${encodeURIComponent(post.title)}`,
            applicantLocationRequirements: {
              "@type": "Country",
              name: "Sri Lanka"
            }
          }))
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
