const {
  SiteStat,
  SocialLink,
  TeamMember,
  Project,
  ContactMessage,
  GalleryItem,
  TeamApplication,
  JobApplication
} = require("../models");
const { getContentByKey, upsertContent } = require("../utils/content");
const { toObjectId } = require("../utils/mongoId");
const { withId, withIdList, statAdmin, messageAdmin, teamAppAdmin, jobAppAdmin } = require("../utils/serialize");
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

function parseActive(value) {
  if (value === undefined || value === "") return null;
  return value === "true" || value === true || value === "1" ? 1 : 0;
}

async function updateHero(req, res, next) {
  try {
    const hero = (await getContentByKey("hero")) || {};
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
    const stats = await SiteStat.find().sort({ sort_order: 1 }).lean();
    return res.json({ stats: stats.map(statAdmin) });
  } catch (error) {
    return next(error);
  }
}

async function updateStat(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Stat not found." });

    const stat = await SiteStat.findById(oid);
    if (!stat) return res.status(404).json({ message: "Stat not found." });

    const { label, value, suffix, sortOrder, isActive } = req.body;
    if (label !== undefined) stat.label = label;
    if (value !== undefined) stat.value = value;
    if (suffix !== undefined) stat.suffix = suffix;
    if (sortOrder !== undefined) stat.sort_order = sortOrder;
    if (isActive !== undefined) stat.is_active = isActive ? 1 : 0;

    await stat.save();
    return res.json({ stat: statAdmin(stat.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function listSocialLinks(_req, res, next) {
  try {
    const links = await SocialLink.find().sort({ sort_order: 1 }).lean();
    return res.json({ links: withIdList(links) });
  } catch (error) {
    return next(error);
  }
}

async function updateSocialLink(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Link not found." });

    const link = await SocialLink.findById(oid);
    if (!link) return res.status(404).json({ message: "Link not found." });

    const { label, url, icon, sortOrder, isActive } = req.body;
    if (label !== undefined) link.label = label;
    if (url !== undefined) link.url = url;
    if (icon !== undefined) link.icon = icon;
    if (sortOrder !== undefined) link.sort_order = sortOrder;
    if (isActive !== undefined) link.is_active = isActive ? 1 : 0;

    await link.save();
    return res.json({ link: withId(link.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function createSocialLink(req, res, next) {
  try {
    const { platform, label, url, icon, sortOrder = 0 } = req.body;
    const link = await SocialLink.create({ platform, label, url, icon, sort_order: sortOrder });
    return res.status(201).json({ id: String(link._id) });
  } catch (error) {
    return next(error);
  }
}

async function listTeam(_req, res, next) {
  try {
    const team = await TeamMember.find().sort({ sort_order: 1 }).lean();
    return res.json({ team: withIdList(team) });
  } catch (error) {
    return next(error);
  }
}

function parseLeadershipFlag(body) {
  const raw = body.isLeadership ?? body.is_leadership;
  if (raw === true || raw === "true" || raw === 1 || raw === "1") return 1;
  return 0;
}

async function createTeamMember(req, res, next) {
  try {
    const name = (req.body.name || "").trim();
    const position = (req.body.position || "").trim();
    const bio = req.body.bio || null;
    const shortDescription =
      (req.body.shortDescription || req.body.short_description || "").trim() || null;
    const sortOrder = Number(req.body.sortOrder) || 0;
    const slug = (req.body.slug || slugify(name)).trim() || slugify(name);
    const isLeadership = parseLeadershipFlag(req.body);
    let imageUrl = null;
    if (req.file) {
      imageUrl = teamImage.publicUrlForStoredFile(req.file.filename);
    }

    const member = await TeamMember.create({
      name,
      slug,
      position,
      bio: bio || shortDescription || null,
      short_description: shortDescription,
      image_url: imageUrl,
      sort_order: sortOrder,
      is_leadership: isLeadership
    });

    return res.status(201).json({ member: withId(member.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function updateTeamMember(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Team member not found." });

    const existing = await TeamMember.findById(oid);
    if (!existing) {
      return res.status(404).json({ message: "Team member not found." });
    }

    if (req.body.name !== undefined) existing.name = String(req.body.name).trim();
    if (req.body.position !== undefined) existing.position = String(req.body.position).trim();
    if (req.body.bio !== undefined) existing.bio = req.body.bio;
    if (req.body.shortDescription !== undefined || req.body.short_description !== undefined) {
      const short =
        (req.body.shortDescription || req.body.short_description || "").trim() || null;
      existing.short_description = short;
    }
    if (req.body.isLeadership !== undefined || req.body.is_leadership !== undefined) {
      existing.is_leadership = parseLeadershipFlag(req.body);
    }
    if (req.body.sortOrder !== undefined && req.body.sortOrder !== "") {
      existing.sort_order = Number(req.body.sortOrder);
    }
    const active = parseActive(req.body.isActive);
    if (active !== null) existing.is_active = active;

    if (req.body.slug !== undefined && String(req.body.slug).trim()) {
      existing.slug = String(req.body.slug).trim();
    } else if (req.body.name !== undefined) {
      existing.slug = slugify(existing.name);
    }

    if (req.file) {
      teamImage.deleteLocalFileIfExists(existing.image_url);
      existing.image_url = teamImage.publicUrlForStoredFile(req.file.filename);
    }

    await existing.save();
    return res.json({ member: withId(existing.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function deleteTeamMember(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Team member not found." });

    const existing = await TeamMember.findById(oid);
    if (!existing) return res.status(404).json({ message: "Team member not found." });

    await TeamMember.deleteOne({ _id: oid });
    teamImage.deleteLocalFileIfExists(existing.image_url);
    return res.json({ message: "Team member removed." });
  } catch (error) {
    return next(error);
  }
}

async function listProjects(_req, res, next) {
  try {
    const projects = await Project.find().sort({ sort_order: 1 }).lean();
    return res.json({ projects: withIdList(projects) });
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

    const project = await Project.create({
      title,
      summary,
      progress: progress ?? 0,
      image_url: imageUrl,
      visual_layout: visualLayout || "landscape",
      highlights,
      sort_order: sortOrder
    });

    return res.status(201).json({ project: withId(project.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Project not found." });

    const existing = await Project.findById(oid);
    if (!existing) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (req.body.title !== undefined) existing.title = String(req.body.title).trim();
    if (req.body.summary !== undefined) existing.summary = req.body.summary;
    if (req.body.progress !== undefined && req.body.progress !== "") {
      existing.progress = Number(req.body.progress);
    }
    if (req.body.visualLayout !== undefined) existing.visual_layout = req.body.visualLayout;
    const highlights = parseHighlights(req.body.highlights);
    if (highlights) existing.highlights = highlights;
    if (req.body.sortOrder !== undefined && req.body.sortOrder !== "") {
      existing.sort_order = Number(req.body.sortOrder);
    }
    const active = parseActive(req.body.isActive);
    if (active !== null) existing.is_active = active;

    if (req.file) {
      projectImage.deleteLocalFileIfExists(existing.image_url);
      existing.image_url = projectImage.publicUrlForStoredFile(req.file.filename);
    }

    await existing.save();
    return res.json({ project: withId(existing.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Project not found." });

    const existing = await Project.findById(oid);
    if (!existing) return res.status(404).json({ message: "Project not found." });

    await Project.deleteOne({ _id: oid });
    projectImage.deleteLocalFileIfExists(existing.image_url);
    return res.json({ message: "Project removed." });
  } catch (error) {
    return next(error);
  }
}

async function listMessages(_req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ created_at: -1 }).lean();
    return res.json({ messages: messages.map(messageAdmin) });
  } catch (error) {
    return next(error);
  }
}

async function updateMessageStatus(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Message not found." });
    await ContactMessage.updateOne({ _id: oid }, { status: req.body.status });
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
    const applications = await TeamApplication.find().sort({ created_at: -1 }).lean();
    return res.json({ applications: applications.map(teamAppAdmin) });
  } catch (error) {
    return next(error);
  }
}

async function updateTeamApplicationStatus(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Application not found." });
    await TeamApplication.updateOne({ _id: oid }, { status: req.body.status });
    return res.json({ message: "Application status updated." });
  } catch (error) {
    return next(error);
  }
}

async function listJobApplications(_req, res, next) {
  try {
    const applications = await JobApplication.find().sort({ created_at: -1 }).lean();
    return res.json({ applications: applications.map(jobAppAdmin) });
  } catch (error) {
    return next(error);
  }
}

async function updateJobApplicationStatus(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Application not found." });
    await JobApplication.updateOne({ _id: oid }, { status: req.body.status });
    return res.json({ message: "Job application status updated." });
  } catch (error) {
    return next(error);
  }
}

async function listGallery(_req, res, next) {
  try {
    const items = await GalleryItem.find().sort({ sort_order: 1 }).lean();
    return res.json({ items: withIdList(items) });
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

      const row = await GalleryItem.create({
        title: itemTitle,
        caption,
        image_url: imageUrl,
        file_hash: fileHash,
        category
      });
      created.push(withId(row.toObject()));
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
    if (!existing) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    if (req.body.title !== undefined) existing.title = String(req.body.title).trim();
    if (req.body.caption !== undefined) existing.caption = String(req.body.caption).trim();
    if (req.body.category !== undefined) {
      existing.category = String(req.body.category).trim() || "general";
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

    await existing.save();
    return res.json({ item: withId(existing.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function deleteGalleryItem(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) return res.status(404).json({ message: "Gallery item not found." });

    const existing = await GalleryItem.findById(oid);
    if (!existing) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    await GalleryItem.deleteOne({ _id: oid });
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
