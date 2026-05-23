const { query, queryOne } = require("../config/db");
const {
  publicUrlForStoredFile,
  fileHashFromFilename,
  deleteLocalFileIfExists
} = require("../middleware/uploadGallery");
const { slugify } = require("../utils/slugify");
const { projectImage, teamImage } = require("../middleware/uploadHashedImage");

function parseHighlights(raw) {
  if (raw === undefined || raw === null || raw === "") return null;
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return String(raw)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

async function upsertContent(key, value) {
  const existing = await queryOne(
    "SELECT id FROM site_content WHERE content_key = :key LIMIT 1",
    { key }
  );

  if (existing) {
    await query(
      "UPDATE site_content SET content_json = :json WHERE content_key = :key",
      { key, json: JSON.stringify(value) }
    );
  } else {
    await query(
      "INSERT INTO site_content (content_key, content_json) VALUES (:key, :json)",
      { key, json: JSON.stringify(value) }
    );
  }
}

async function updateHero(req, res, next) {
  try {
    const current = await queryOne(
      "SELECT content_json FROM site_content WHERE content_key = 'hero' LIMIT 1"
    );
    const hero =
      typeof current?.content_json === "string"
        ? JSON.parse(current.content_json)
        : current?.content_json || {};

    const nextHero = { ...hero, ...req.body };
    if (!["image", "video"].includes(nextHero.mediaType)) {
      return res.status(400).json({ message: "mediaType must be image or video." });
    }

    await upsertContent("hero", nextHero);
    return res.json({ hero: nextHero });
  } catch (error) {
    return next(error);
  }
}

async function updateAbout(req, res, next) {
  try {
    await upsertContent("about", req.body);
    return res.json({ about: req.body });
  } catch (error) {
    return next(error);
  }
}

async function listStats(_req, res, next) {
  try {
    const stats = await query(
      `SELECT id, stat_key AS statKey, label, value, suffix, sort_order AS sortOrder, is_active AS isActive
       FROM site_stats ORDER BY sort_order ASC`
    );
    return res.json({ stats });
  } catch (error) {
    return next(error);
  }
}

async function updateStat(req, res, next) {
  try {
    const { label, value, suffix, sortOrder, isActive } = req.body;
    await query(
      `UPDATE site_stats
       SET label = COALESCE(:label, label),
           value = COALESCE(:value, value),
           suffix = COALESCE(:suffix, suffix),
           sort_order = COALESCE(:sortOrder, sort_order),
           is_active = COALESCE(:isActive, is_active)
       WHERE id = :id`,
      {
        id: req.params.id,
        label,
        value,
        suffix,
        sortOrder,
        isActive
      }
    );
    const stat = await queryOne("SELECT * FROM site_stats WHERE id = :id", { id: req.params.id });
    return res.json({ stat });
  } catch (error) {
    return next(error);
  }
}

async function listSocialLinks(_req, res, next) {
  try {
    const links = await query("SELECT * FROM social_links ORDER BY sort_order ASC");
    return res.json({ links });
  } catch (error) {
    return next(error);
  }
}

async function updateSocialLink(req, res, next) {
  try {
    const { label, url, icon, sortOrder, isActive } = req.body;
    await query(
      `UPDATE social_links
       SET label = COALESCE(:label, label),
           url = COALESCE(:url, url),
           icon = COALESCE(:icon, icon),
           sort_order = COALESCE(:sortOrder, sort_order),
           is_active = COALESCE(:isActive, is_active)
       WHERE id = :id`,
      { id: req.params.id, label, url, icon, sortOrder, isActive }
    );
    const link = await queryOne("SELECT * FROM social_links WHERE id = :id", { id: req.params.id });
    return res.json({ link });
  } catch (error) {
    return next(error);
  }
}

async function createSocialLink(req, res, next) {
  try {
    const { platform, label, url, icon, sortOrder = 0 } = req.body;
    const result = await query(
      `INSERT INTO social_links (platform, label, url, icon, sort_order)
       VALUES (:platform, :label, :url, :icon, :sortOrder)`,
      { platform, label, url, icon, sortOrder }
    );
    return res.status(201).json({ id: result.insertId });
  } catch (error) {
    return next(error);
  }
}

async function listTeam(_req, res, next) {
  try {
    const team = await query("SELECT * FROM team_members ORDER BY sort_order ASC");
    return res.json({ team });
  } catch (error) {
    return next(error);
  }
}

async function createTeamMember(req, res, next) {
  try {
    const name = (req.body.name || "").trim();
    const position = (req.body.position || "").trim();
    const bio = req.body.bio || null;
    const sortOrder = Number(req.body.sortOrder) || 0;
    const slug = (req.body.slug || slugify(name)).trim() || slugify(name);
    let imageUrl = null;
    if (req.file) {
      imageUrl = teamImage.publicUrlForStoredFile(req.file.filename);
    }

    const result = await query(
      `INSERT INTO team_members (name, slug, position, bio, image_url, sort_order)
       VALUES (:name, :slug, :position, :bio, :imageUrl, :sortOrder)`,
      { name, slug, position, bio: bio || null, imageUrl, sortOrder }
    );
    const member = await queryOne("SELECT * FROM team_members WHERE id = :id", { id: result.insertId });
    return res.status(201).json({ member });
  } catch (error) {
    return next(error);
  }
}

async function updateTeamMember(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT * FROM team_members WHERE id = :id", { id });
    if (!existing) {
      return res.status(404).json({ message: "Team member not found." });
    }

    const name = req.body.name !== undefined ? String(req.body.name).trim() : null;
    const position = req.body.position !== undefined ? String(req.body.position).trim() : null;
    const bio = req.body.bio !== undefined ? req.body.bio : null;
    const sortOrder =
      req.body.sortOrder !== undefined && req.body.sortOrder !== ""
        ? Number(req.body.sortOrder)
        : null;
    const isActive =
      req.body.isActive === undefined || req.body.isActive === ""
        ? null
        : req.body.isActive === "true" || req.body.isActive === true || req.body.isActive === "1"
          ? 1
          : 0;
    const slug =
      req.body.slug !== undefined && String(req.body.slug).trim()
        ? String(req.body.slug).trim()
        : name
          ? slugify(name)
          : null;

    let imageUrl = null;
    if (req.file) {
      teamImage.deleteLocalFileIfExists(existing.image_url);
      imageUrl = teamImage.publicUrlForStoredFile(req.file.filename);
    }

    await query(
      `UPDATE team_members
       SET name = COALESCE(:name, name),
           slug = COALESCE(:slug, slug),
           position = COALESCE(:position, position),
           bio = COALESCE(:bio, bio),
           image_url = COALESCE(:imageUrl, image_url),
           sort_order = COALESCE(:sortOrder, sort_order),
           is_active = COALESCE(:isActive, is_active)
       WHERE id = :id`,
      { id, name, slug, position, bio, imageUrl, sortOrder, isActive }
    );
    const member = await queryOne("SELECT * FROM team_members WHERE id = :id", { id });
    return res.json({ member });
  } catch (error) {
    return next(error);
  }
}

async function deleteTeamMember(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT image_url FROM team_members WHERE id = :id", { id });
    await query("DELETE FROM team_members WHERE id = :id", { id });
    if (existing) teamImage.deleteLocalFileIfExists(existing.image_url);
    return res.json({ message: "Team member removed." });
  } catch (error) {
    return next(error);
  }
}

async function listProjects(_req, res, next) {
  try {
    const projects = await query("SELECT * FROM projects ORDER BY sort_order ASC");
    return res.json({ projects });
  } catch (error) {
    return next(error);
  }
}

async function createProject(req, res, next) {
  try {
    const title = (req.body.title || "").trim();
    const summary = req.body.summary || null;
    const progress = req.body.progress !== undefined ? Number(req.body.progress) : 0;
    const visualLayout = req.body.visualLayout || "landscape";
    const highlights = parseHighlights(req.body.highlights) || [];
    const sortOrder = Number(req.body.sortOrder) || 0;
    let imageUrl = null;
    if (req.file) {
      imageUrl = projectImage.publicUrlForStoredFile(req.file.filename);
    }

    const result = await query(
      `INSERT INTO projects (title, summary, progress, image_url, visual_layout, highlights, sort_order)
       VALUES (:title, :summary, :progress, :imageUrl, :visualLayout, :highlights, :sortOrder)`,
      {
        title,
        summary,
        progress: progress ?? 0,
        imageUrl,
        visualLayout: visualLayout || "landscape",
        highlights: JSON.stringify(highlights),
        sortOrder
      }
    );
    const project = await queryOne("SELECT * FROM projects WHERE id = :id", { id: result.insertId });
    return res.status(201).json({ project });
  } catch (error) {
    return next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT * FROM projects WHERE id = :id", { id });
    if (!existing) {
      return res.status(404).json({ message: "Project not found." });
    }

    const title = req.body.title !== undefined ? String(req.body.title).trim() : null;
    const summary = req.body.summary !== undefined ? req.body.summary : null;
    const progress =
      req.body.progress !== undefined && req.body.progress !== ""
        ? Number(req.body.progress)
        : null;
    const visualLayout = req.body.visualLayout !== undefined ? req.body.visualLayout : null;
    const highlights = parseHighlights(req.body.highlights);
    const sortOrder =
      req.body.sortOrder !== undefined && req.body.sortOrder !== ""
        ? Number(req.body.sortOrder)
        : null;
    const isActive =
      req.body.isActive === undefined || req.body.isActive === ""
        ? null
        : req.body.isActive === "true" || req.body.isActive === true || req.body.isActive === "1"
          ? 1
          : 0;

    let imageUrl = null;
    if (req.file) {
      projectImage.deleteLocalFileIfExists(existing.image_url);
      imageUrl = projectImage.publicUrlForStoredFile(req.file.filename);
    }

    await query(
      `UPDATE projects
       SET title = COALESCE(:title, title),
           summary = COALESCE(:summary, summary),
           progress = COALESCE(:progress, progress),
           image_url = COALESCE(:imageUrl, image_url),
           visual_layout = COALESCE(:visualLayout, visual_layout),
           highlights = COALESCE(:highlights, highlights),
           sort_order = COALESCE(:sortOrder, sort_order),
           is_active = COALESCE(:isActive, is_active)
       WHERE id = :id`,
      {
        id,
        title,
        summary,
        progress,
        imageUrl,
        visualLayout,
        highlights: highlights ? JSON.stringify(highlights) : null,
        sortOrder,
        isActive
      }
    );
    const project = await queryOne("SELECT * FROM projects WHERE id = :id", { id });
    return res.json({ project });
  } catch (error) {
    return next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT image_url FROM projects WHERE id = :id", { id });
    await query("DELETE FROM projects WHERE id = :id", { id });
    if (existing) projectImage.deleteLocalFileIfExists(existing.image_url);
    return res.json({ message: "Project removed." });
  } catch (error) {
    return next(error);
  }
}

async function listMessages(_req, res, next) {
  try {
    const messages = await query(
      `SELECT id, name, email, phone, subject, message, status, created_at AS createdAt
       FROM contact_messages ORDER BY created_at DESC`
    );
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
}

async function updateMessageStatus(req, res, next) {
  try {
    await query("UPDATE contact_messages SET status = :status WHERE id = :id", {
      id: req.params.id,
      status: req.body.status
    });
    return res.json({ message: "Status updated." });
  } catch (error) {
    return next(error);
  }
}

async function uploadMedia(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  const urlPath = `/uploads/${req.file.filename}`;
  return res.status(201).json({
    url: urlPath,
    filename: req.file.filename,
    mimeType: req.file.mimetype
  });
}

async function listTeamApplications(_req, res, next) {
  try {
    const applications = await query(
      `SELECT id, full_name AS fullName, email, phone, address, city, age, gender,
              message, status, created_at AS createdAt
       FROM team_applications ORDER BY created_at DESC`
    );
    return res.json({ applications });
  } catch (error) {
    return next(error);
  }
}

async function updateTeamApplicationStatus(req, res, next) {
  try {
    await query("UPDATE team_applications SET status = :status WHERE id = :id", {
      id: req.params.id,
      status: req.body.status
    });
    return res.json({ message: "Application status updated." });
  } catch (error) {
    return next(error);
  }
}

async function listJobApplications(_req, res, next) {
  try {
    const applications = await query(
      `SELECT id, job_title AS jobTitle, full_name AS fullName, email, phone, address, city, age, gender,
              linkedin_url AS linkedinUrl, portfolio_url AS portfolioUrl,
              current_role AS currentRole, experience_years AS experienceYears,
              cover_letter AS coverLetter, cv_filename AS cvFilename, cv_url AS cvUrl,
              additional_doc_url AS additionalDocUrl, additional_info AS additionalInfo,
              status, created_at AS createdAt
       FROM job_applications ORDER BY created_at DESC`
    );
    return res.json({ applications });
  } catch (error) {
    return next(error);
  }
}

async function updateJobApplicationStatus(req, res, next) {
  try {
    await query("UPDATE job_applications SET status = :status WHERE id = :id", {
      id: req.params.id,
      status: req.body.status
    });
    return res.json({ message: "Job application status updated." });
  } catch (error) {
    return next(error);
  }
}

async function listGallery(_req, res, next) {
  try {
    const items = await query("SELECT * FROM gallery_items ORDER BY sort_order ASC");
    return res.json({ items });
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

    const titleBase = (req.body.title || req.body.titleBase || "").trim();
    const caption = (req.body.caption || "").trim();
    const category = (req.body.category || "general").trim() || "general";
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

      const result = await query(
        `INSERT INTO gallery_items (title, caption, image_url, file_hash, category, sort_order)
         VALUES (:title, :caption, :imageUrl, :fileHash, :category, 0)`,
        { title: itemTitle, caption, imageUrl, fileHash, category }
      );

      const row = await queryOne("SELECT * FROM gallery_items WHERE id = :id", {
        id: result.insertId
      });
      created.push(row);
    }

    return res.status(201).json({ items: created, count: created.length });
  } catch (error) {
    return next(error);
  }
}

async function updateGalleryItem(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT * FROM gallery_items WHERE id = :id", { id });
    if (!existing) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    const title = req.body.title !== undefined ? String(req.body.title).trim() : null;
    const caption = req.body.caption !== undefined ? String(req.body.caption).trim() : null;
    const category =
      req.body.category !== undefined ? String(req.body.category).trim() || "general" : null;
    const sortOrder =
      req.body.sortOrder !== undefined && req.body.sortOrder !== ""
        ? Number(req.body.sortOrder)
        : null;
    const isActive =
      req.body.isActive === undefined || req.body.isActive === ""
        ? null
        : req.body.isActive === "true" || req.body.isActive === true || req.body.isActive === "1"
          ? 1
          : 0;

    let imageUrl = null;
    let fileHash = null;

    if (req.file) {
      deleteLocalFileIfExists(existing.image_url);
      imageUrl = publicUrlForStoredFile(req.file.filename);
      fileHash = fileHashFromFilename(req.file.filename);
    }

    await query(
      `UPDATE gallery_items
       SET title = COALESCE(:title, title),
           caption = COALESCE(:caption, caption),
           image_url = COALESCE(:imageUrl, image_url),
           file_hash = COALESCE(:fileHash, file_hash),
           category = COALESCE(:category, category),
           sort_order = COALESCE(:sortOrder, sort_order),
           is_active = COALESCE(:isActive, is_active)
       WHERE id = :id`,
      { id, title, caption, imageUrl, fileHash, category, sortOrder, isActive }
    );

    const item = await queryOne("SELECT * FROM gallery_items WHERE id = :id", { id });
    return res.json({ item });
  } catch (error) {
    return next(error);
  }
}

async function deleteGalleryItem(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT image_url FROM gallery_items WHERE id = :id", { id });
    if (!existing) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    await query("DELETE FROM gallery_items WHERE id = :id", { id });
    deleteLocalFileIfExists(existing.image_url);
    return res.json({ message: "Gallery item removed." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  updateHero,
  updateAbout,
  listStats,
  updateStat,
  listSocialLinks,
  updateSocialLink,
  createSocialLink,
  listTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  listMessages,
  updateMessageStatus,
  uploadMedia,
  listTeamApplications,
  updateTeamApplicationStatus,
  listJobApplications,
  updateJobApplicationStatus,
  listGallery,
  createGalleryItems,
  updateGalleryItem,
  deleteGalleryItem
};
