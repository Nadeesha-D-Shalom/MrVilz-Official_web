import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE_URL,
  seoForPath,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
  ORGANIZATION
} from "../../config/seo";

const OG_IMAGE = `${SITE_URL}/mrVilz_logo.png`;

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

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

export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoForPath(pathname);
    const isPublic = !pathname.startsWith("/admin");

    document.title = seo.title;

    if (!isPublic) return;

    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "keywords", seo.keywords);
    upsertMeta("name", "author", ORGANIZATION.legalName);
    upsertMeta("name", "robots", "index, follow, max-image-preview:large");

    upsertLink("canonical", seo.url);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Mr Vilz - Official");
    upsertMeta("property", "og:url", seo.url);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("property", "og:image:alt", "Mr Vilz Official Logo");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);

    upsertJsonLd("seo-org-jsonld", buildOrganizationJsonLd());
    upsertJsonLd("seo-website-jsonld", buildWebSiteJsonLd());
    upsertJsonLd("seo-faq-jsonld", buildFaqJsonLd());
  }, [pathname]);

  return null;
}
