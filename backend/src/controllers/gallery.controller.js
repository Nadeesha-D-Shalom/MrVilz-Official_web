const { GallerySection, GalleryItem, TeamMember, SiteContent } = require("../models");
const { getContentByKey, upsertContent } = require("../utils/content");
const { slugify } = require("../utils/slugify");
const { isValidId, toObjectId } = require("../utils/mongoId");
const { resolveMediaUrl, getPublicBaseUrl } = require("../utils/mediaUrl");
const {
  publicUrlForStoredFile,
  fileHashFromFilename,
  deleteLocalFileIfExists
} = require("../middleware/uploadGallery");

function parseActive(value) {
  if (value === undefined || value === "") return null;
  return value === true || value === "true" || value === "1" || value === 1 ? 1 : 0;
}

function buildAltText({ title, caption, section }) {
  const parts = [
    title,
    caption,
    section?.project,
    section?.location,
    "Mr Vilz",
    "MrVilz",
    "Nadeesha Shalom"
  ].filter(Boolean);
  return parts.join(" — ").slice(0, 240);
}

async function uniqueSectionSlug(base, excludeId = null) {
  let slug = slugify(base) || "section";
  let candidate = slug;
  let n = 1;
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: toObjectId(excludeId) };
    const exists = await GallerySection.findOne(query).select("_id").lean();
    if (!exists) return candidate;
    candidate = `${slug}-${n++}`;
  }
}

async function getGalleryPageSettings() {
  const data = await getContentByKey("gallery");
  if (!data) {
    return {
      title: "Moments that matter",
      intro:
        "Campaigns, cleanups, behind-the-scenes, and the people driving change across Sri Lanka — Mr Vilz official gallery."
    };
  }
  return {
    title: data.title || "Moments that matter",
    intro: data.intro || ""
  };
}

function sectionPublic(doc) {
  if (!doc) return null;
  const id = doc._id ? String(doc._id) : doc.id;
  return {
    id,
    title: doc.title,
    slug: doc.slug,
    location: doc.location || "",
    project: doc.project || "",
    description: doc.description || "",
    sortOrder: doc.sort_order ?? 0
  };
}

function itemPublic(doc, section) {
  if (!doc) return null;
  const id = doc._id ? String(doc._id) : doc.id;
  const alt =
    doc.alt_text ||
    buildAltText({ title: doc.title, caption: doc.caption, section });
  return {
    id,
    title: doc.title,
    caption: doc.caption,
    imageUrl: resolveMediaUrl(doc.image_url),
    altText: alt,
    sortOrder: doc.sort_order ?? 0
  };
}

function sectionAdmin(doc) {
  const base = sectionPublic(doc);
  if (!base) return null;
  return {
    ...base,
    isActive: doc.is_active === 1,
    is_active: doc.is_active,
    sort_order: doc.sort_order,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at
  };
}

function itemAdmin(doc) {
  if (!doc) return null;
  const id = doc._id ? String(doc._id) : doc.id;
  return {
    id,
    sectionId: doc.section_id ? String(doc.section_id) : null,
    title: doc.title,
    caption: doc.caption,
    alt_text: doc.alt_text || "",
    altText: doc.alt_text || "",
    image_url: resolveMediaUrl(doc.image_url),
    imageUrl: resolveMediaUrl(doc.image_url),
    file_hash: doc.file_hash,
    category: doc.category,
    sort_order: doc.sort_order,
    sortOrder: doc.sort_order,
    is_active: doc.is_active,
    isActive: doc.is_active === 1
  };
}

async function getDefaultSectionId() {
  let section = await GallerySection.findOne({ slug: "general" }).lean();
  if (!section) {
    const created = await GallerySection.create({
      title: "General",
      slug: "general",
      location: "Sri Lanka",
      project: "Mr Vilz",
      sort_order: 0,
      is_active: 1
    });
    return created._id;
  }
  return section._id;
}

async function listPublicGallery(_req, res, next) {
  try {
    const settings = await getGalleryPageSettings();
    const sections = await GallerySection.find({ is_active: 1 })
      .sort({ sort_order: 1, created_at: -1 })
      .lean();
    const items = await GalleryItem.find({ is_active: 1 })
      .sort({ sort_order: 1, created_at: -1 })
      .lean();

    const sectionMap = new Map(sections.map((s) => [String(s._id), s]));
    const grouped = sections.map((section) => ({
      ...sectionPublic(section),
      items: items
        .filter((item) => item.section_id && String(item.section_id) === String(section._id))
        .map((item) => itemPublic(item, section))
    }));

    const orphanItems = items.filter(
      (item) => !item.section_id || !sectionMap.has(String(item.section_id))
    );
    if (orphanItems.length) {
      grouped.push({
        id: "uncategorized",
        title: "Gallery",
        slug: "gallery",
        location: "",
        project: "",
        description: "",
        sortOrder: 9999,
        items: orphanItems.map((item) => itemPublic(item, null))
      });
    }

    return res.json({
      gallery: {
        ...settings,
        sections: grouped.filter((s) => s.items.length > 0)
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function listAdminGallery(_req, res, next) {
  try {
    const settings = await getGalleryPageSettings();
    const sections = await GallerySection.find().sort({ sort_order: 1 }).lean();
    const items = await GalleryItem.find().sort({ sort_order: 1 }).lean();
    return res.json({
      settings,
      sections: sections.map(sectionAdmin),
      items: items.map(itemAdmin)
    });
  } catch (error) {
    return next(error);
  }
}

async function createSection(req, res, next) {
  try {
    const title = (req.body.title || "").trim();
    if (!title) {
      return res.status(400).json({ message: "Section title is required." });
    }
    const slug = await uniqueSectionSlug(req.body.slug?.trim() || title);
    const section = await GallerySection.create({
      title,
      slug,
      location: (req.body.location || "").trim(),
      project: (req.body.project || "").trim(),
      description: (req.body.description || "").trim(),
      sort_order: Number(req.body.sortOrder ?? req.body.sort_order) || 0,
      is_active: parseActive(req.body.isActive ?? 1) ?? 1
    });
    const payload = sectionAdmin(section.toObject());
    if (!payload?.id) {
      return res.status(500).json({ message: "Section was created but could not be read back." });
    }
    return res.status(201).json({ section: payload });
  } catch (error) {
    return next(error);
  }
}

async function saveGalleryBundle(req, res, next) {
  try {
    const pageTitle = (req.body.pageTitle || req.body.page_title || req.body.title || "").trim();
    const intro = (req.body.intro || req.body.description || "").trim();
    const sectionTitle = (req.body.sectionTitle || req.body.title || pageTitle).trim();
    const location = (req.body.location || "").trim();
    const project = (req.body.project || "").trim();
    const sectionId = req.body.sectionId || req.body.section_id;

    if (!pageTitle) {
      return res.status(400).json({ message: "Page title is required." });
    }
    if (!sectionTitle) {
      return res.status(400).json({ message: "Section title is required." });
    }

    await upsertContent("gallery", { title: pageTitle, intro });

    let section;
    const oid = toObjectId(sectionId);
    if (oid) {
      section = await GallerySection.findById(oid);
      if (!section) {
        return res.status(404).json({ message: "Gallery section not found." });
      }
      section.title = sectionTitle;
      section.location = location;
      section.project = project;
      section.description = intro;
      await section.save();
    } else {
      const slug = await uniqueSectionSlug(sectionTitle);
      section = await GallerySection.create({
        title: sectionTitle,
        slug,
        location,
        project,
        description: intro,
        sort_order: 0,
        is_active: 1
      });
    }

    const payload = sectionAdmin(section.toObject());
    return res.json({
      settings: { title: pageTitle, intro },
      section: payload
    });
  } catch (error) {
    return next(error);
  }
}

async function updateSection(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Section not found." });
    const existing = await GallerySection.findById(oid);
    if (!existing) return res.status(404).json({ message: "Section not found." });

    if (req.body.title !== undefined) existing.title = String(req.body.title).trim();
    if (req.body.slug !== undefined && req.body.slug !== "") {
      existing.slug = await uniqueSectionSlug(req.body.slug, existing._id);
    }
    if (req.body.location !== undefined) existing.location = String(req.body.location).trim();
    if (req.body.project !== undefined) existing.project = String(req.body.project).trim();
    if (req.body.description !== undefined) {
      existing.description = String(req.body.description).trim();
    }
    if (req.body.sortOrder !== undefined || req.body.sort_order !== undefined) {
      existing.sort_order = Number(req.body.sortOrder ?? req.body.sort_order) || 0;
    }
    const active = parseActive(req.body.isActive);
    if (active !== null) existing.is_active = active;

    await existing.save();
    return res.json({ section: sectionAdmin(existing.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function deleteSection(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Section not found." });
    const itemCount = await GalleryItem.countDocuments({ section_id: oid });
    if (itemCount > 0) {
      return res.status(400).json({
        message: "Remove or move images in this section before deleting it."
      });
    }
    await GallerySection.deleteOne({ _id: oid });
    return res.json({ message: "Section deleted." });
  } catch (error) {
    return next(error);
  }
}

async function createGalleryItems(req, res, next) {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "Choose at least one image to upload." });
    }

    let sectionId = toObjectId(req.body.sectionId || req.body.section_id);
    if (!sectionId) {
      sectionId = await getDefaultSectionId();
    } else {
      const section = await GallerySection.findById(sectionId);
      if (!section) {
        return res.status(400).json({ message: "Gallery section not found." });
      }
    }

    const section = await GallerySection.findById(sectionId).lean();
    const titleBase = (req.body.title || "").trim();
    const caption = (req.body.caption || "").trim();
    const created = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = publicUrlForStoredFile(file.filename);
      const fileHash = fileHashFromFilename(file.filename);
      const itemTitle =
        files.length > 1
          ? titleBase
            ? `${titleBase} ${i + 1}`
            : `Gallery photo ${i + 1}`
          : titleBase || "Gallery photo";

      const altText =
        (req.body.altText || req.body.alt_text || "").trim() ||
        buildAltText({ title: itemTitle, caption, section });

      const row = await GalleryItem.create({
        section_id: sectionId,
        title: itemTitle,
        caption,
        alt_text: altText,
        image_url: imageUrl,
        file_hash: fileHash,
        category: section?.project || section?.slug || "general"
      });
      created.push(itemAdmin(row.toObject()));
    }

    return res.status(201).json({ items: created, count: created.length });
  } catch (error) {
    return next(error);
  }
}

async function updateGalleryItem(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Gallery item not found." });

    const existing = await GalleryItem.findById(oid);
    if (!existing) return res.status(404).json({ message: "Gallery item not found." });

    if (req.body.sectionId !== undefined || req.body.section_id !== undefined) {
      const sid = toObjectId(req.body.sectionId || req.body.section_id);
      if (!sid) return res.status(400).json({ message: "Invalid section." });
      existing.section_id = sid;
    }
    if (req.body.title !== undefined) existing.title = String(req.body.title).trim();
    if (req.body.caption !== undefined) existing.caption = String(req.body.caption).trim();
    if (req.body.altText !== undefined || req.body.alt_text !== undefined) {
      existing.alt_text = String(req.body.altText ?? req.body.alt_text ?? "").trim();
    }
    if (req.body.sortOrder !== undefined && req.body.sortOrder !== "") {
      existing.sort_order = Number(req.body.sortOrder);
    }
    const active = parseActive(req.body.isActive);
    if (active !== null) existing.is_active = active;

    if (req.file) {
      deleteLocalFileIfExists(existing.image_url);
      existing.image_url = publicUrlForStoredFile(req.file.filename);
      existing.file_hash = fileHashFromFilename(req.file.filename);
    }

    if (!existing.alt_text?.trim()) {
      const section = existing.section_id
        ? await GallerySection.findById(existing.section_id).lean()
        : null;
      existing.alt_text = buildAltText({
        title: existing.title,
        caption: existing.caption,
        section
      });
    }

    await existing.save();
    return res.json({ item: itemAdmin(existing.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function deleteGalleryItem(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Gallery item not found." });

    const existing = await GalleryItem.findById(oid);
    if (!existing) return res.status(404).json({ message: "Gallery item not found." });

    await GalleryItem.deleteOne({ _id: oid });
    deleteLocalFileIfExists(existing.image_url);
    return res.json({ message: "Gallery item removed." });
  } catch (error) {
    return next(error);
  }
}

async function updateGallerySettings(req, res, next) {
  try {
    const title = (req.body.title || "").trim();
    const intro = (req.body.intro || "").trim();
    if (!title) return res.status(400).json({ message: "Page title is required." });
    await upsertContent("gallery", { title, intro });
    return res.json({ settings: { title, intro } });
  } catch (error) {
    return next(error);
  }
}

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getImageSitemap(_req, res, next) {
  try {
    const base = getPublicBaseUrl();
    const entries = [];

    const staticImages = [
      { loc: "/mrVilz_logo.png", title: "Mr Vilz Official Logo — MrVilz" },
      { loc: "/images/background.png", title: "Mr Vilz Marine Conservation Sri Lanka" },
      { loc: "/images/beach.PNG", title: "Clean Panadura Beach — Mr Vilz Nadeesha Shalom" },
      { loc: "/images/plant.PNG", title: "Tree Planting Mr Vilz — Environment Sri Lanka" },
      { loc: "/images/nadeesha1.JPG", title: "Nadeesha Shalom Founder Mr Vilz MrVilz" },
      { loc: "/images/chamidu.jpeg", title: "Chamidu Media Production Mr Vilz" },
      { loc: "/images/paboda.jpeg", title: "Pabodha Nuwangi Creative Producer Mr Vilz" },
      { loc: "/images/nethmina.JPG", title: "Nethmina Creative Director Mr Vilz" }
    ];

    for (const img of staticImages) {
      entries.push({
        page: `${base}/`,
        loc: `${base}${img.loc}`,
        title: img.title
      });
    }

    const galleryItems = await GalleryItem.find({ is_active: 1 }).lean();
    const sections = await GallerySection.find().lean();
    const sectionById = new Map(sections.map((s) => [String(s._id), s]));

    for (const item of galleryItems) {
      if (!item.image_url) continue;
      const section = item.section_id ? sectionById.get(String(item.section_id)) : null;
      entries.push({
        page: `${base}/gallery`,
        loc: resolveMediaUrl(item.image_url),
        title: item.alt_text || buildAltText({ title: item.title, caption: item.caption, section }),
        caption: item.caption || ""
      });
    }

    const team = await TeamMember.find({ is_active: 1 }).lean();
    for (const member of team) {
      if (!member.image_url) continue;
      const slug = member.slug || slugify(member.name);
      entries.push({
        page: `${base}/team-members/${slug}`,
        loc: resolveMediaUrl(member.image_url),
        title: `${member.name} — Mr Vilz Team — Nadeesha Shalom MrVilz`,
        caption: member.position || ""
      });
    }

    const byPage = new Map();
    for (const entry of entries) {
      if (!byPage.has(entry.page)) byPage.set(entry.page, []);
      byPage.get(entry.page).push(entry);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
    for (const [page, images] of byPage) {
      xml += `  <url>\n    <loc>${xmlEscape(page)}</loc>\n`;
      for (const img of images) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${xmlEscape(img.loc)}</image:loc>\n`;
        xml += `      <image:title>${xmlEscape(img.title)}</image:title>\n`;
        if (img.caption) {
          xml += `      <image:caption>${xmlEscape(img.caption)}</image:caption>\n`;
        }
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }
    xml += `</urlset>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    return res.send(xml);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPublicGallery,
  listAdminGallery,
  createSection,
  updateSection,
  deleteSection,
  saveGalleryBundle,
  createGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  updateGallerySettings,
  getImageSitemap,
  buildAltText,
  getDefaultSectionId
};
