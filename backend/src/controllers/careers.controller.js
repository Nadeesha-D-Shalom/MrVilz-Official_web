const { CareerPost } = require("../models");
const { getContentByKey, upsertContent } = require("../utils/content");
const { careerPostPublic, careerPostAdmin } = require("../utils/serialize");
const { isValidId, toObjectId } = require("../utils/mongoId");

async function getCareersPageSettings() {
  const data = await getContentByKey("careers");
  if (!data) {
    return {
      title: "Careers at Mr Vilz",
      intro:
        "Join a youth-led movement protecting Sri Lanka's beaches, forests, and wildlife through media, community action, and environmental projects."
    };
  }
  return {
    title: data.title || "Careers at Mr Vilz",
    intro: data.intro || ""
  };
}

function parsePublished(value) {
  return (
    value === true || value === "true" || value === "1" || value === 1 ? 1 : 0
  );
}

async function listPublishedCareers(_req, res, next) {
  try {
    const settings = await getCareersPageSettings();
    const posts = await CareerPost.find({ is_published: 1 })
      .sort({ sort_order: 1, created_at: -1 })
      .lean();
    return res.json({
      careers: {
        ...settings,
        posts: posts.map(careerPostPublic)
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function listCareerPosts(_req, res, next) {
  try {
    const posts = await CareerPost.find().sort({ sort_order: 1, created_at: -1 }).lean();
    const settings = await getCareersPageSettings();
    return res.json({
      settings,
      posts: posts.map(careerPostAdmin)
    });
  } catch (error) {
    return next(error);
  }
}

async function getCareerPost(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Career post not found." });
    }
    const post = await CareerPost.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({ message: "Career post not found." });
    }
    return res.json({ post: careerPostAdmin(post) });
  } catch (error) {
    return next(error);
  }
}

async function createCareerPost(req, res, next) {
  try {
    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim();
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const post = await CareerPost.create({
      title,
      description,
      role_type: req.body.roleType?.trim() || null,
      is_published: parsePublished(req.body.isPublished),
      sort_order: Number(req.body.sortOrder) || 0
    });

    return res.status(201).json({ post: careerPostAdmin(post.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function updateCareerPost(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) {
      return res.status(404).json({ message: "Career post not found." });
    }

    const existing = await CareerPost.findById(oid);
    if (!existing) {
      return res.status(404).json({ message: "Career post not found." });
    }

    if (req.body.title !== undefined) existing.title = String(req.body.title).trim();
    if (req.body.description !== undefined) {
      existing.description = String(req.body.description).trim();
    }
    if (req.body.roleType !== undefined) {
      existing.role_type = req.body.roleType ? String(req.body.roleType).trim() : null;
    }
    if (req.body.sortOrder !== undefined && req.body.sortOrder !== "") {
      existing.sort_order = Number(req.body.sortOrder);
    }
    if (req.body.isPublished !== undefined && req.body.isPublished !== "") {
      existing.is_published = parsePublished(req.body.isPublished);
    }

    await existing.save();
    return res.json({ post: careerPostAdmin(existing.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function deleteCareerPost(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) {
      return res.status(404).json({ message: "Career post not found." });
    }
    const result = await CareerPost.deleteOne({ _id: oid });
    if (!result.deletedCount) {
      return res.status(404).json({ message: "Career post not found." });
    }
    return res.json({ message: "Career post deleted." });
  } catch (error) {
    return next(error);
  }
}

async function updateCareersSettings(req, res, next) {
  try {
    const title = (req.body.title || "").trim();
    const intro = (req.body.intro || "").trim();
    if (!title) {
      return res.status(400).json({ message: "Page title is required." });
    }
    await upsertContent("careers", { title, intro });
    return res.json({ settings: { title, intro } });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPublishedCareers,
  listCareerPosts,
  getCareerPost,
  createCareerPost,
  updateCareerPost,
  deleteCareerPost,
  updateCareersSettings
};
