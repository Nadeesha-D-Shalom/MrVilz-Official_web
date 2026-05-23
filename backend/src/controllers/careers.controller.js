const { query, queryOne } = require("../config/db");

async function getCareersPageSettings() {
  const row = await queryOne(
    "SELECT content_json FROM site_content WHERE content_key = 'careers' LIMIT 1"
  );
  if (!row) {
    return {
      title: "Careers at Mr Vilz",
      intro:
        "Join a youth-led movement protecting Sri Lanka's beaches, forests, and wildlife through media, community action, and environmental projects."
    };
  }
  const data =
    typeof row.content_json === "string" ? JSON.parse(row.content_json) : row.content_json;
  return {
    title: data.title || "Careers at Mr Vilz",
    intro: data.intro || ""
  };
}

async function saveCareersPageSettings({ title, intro }) {
  const payload = JSON.stringify({ title, intro });
  const existing = await queryOne(
    "SELECT id FROM site_content WHERE content_key = 'careers' LIMIT 1"
  );
  if (existing) {
    await query(
      "UPDATE site_content SET content_json = :json WHERE content_key = 'careers'",
      { json: payload }
    );
  } else {
    await query(
      "INSERT INTO site_content (content_key, content_json) VALUES ('careers', :json)",
      { json: payload }
    );
  }
}

function mapCareerPost(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    roleType: row.role_type,
    isPublished: Boolean(row.is_published),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/** Public — published posts only */
async function listPublishedCareers(_req, res, next) {
  try {
    const settings = await getCareersPageSettings();
    const posts = await query(
      `SELECT id, title, description, role_type AS roleType, sort_order AS sortOrder, created_at AS createdAt
       FROM career_posts
       WHERE is_published = 1
       ORDER BY sort_order ASC, created_at DESC`
    );
    return res.json({
      careers: {
        ...settings,
        posts
      }
    });
  } catch (error) {
    return next(error);
  }
}

/** Admin — all posts */
async function listCareerPosts(_req, res, next) {
  try {
    const posts = await query(
      `SELECT id, title, description, role_type, is_published, sort_order, created_at, updated_at
       FROM career_posts
       ORDER BY sort_order ASC, created_at DESC`
    );
    const settings = await getCareersPageSettings();
    return res.json({
      settings,
      posts: posts.map(mapCareerPost)
    });
  } catch (error) {
    return next(error);
  }
}

async function getCareerPost(req, res, next) {
  try {
    const row = await queryOne(
      `SELECT id, title, description, role_type, is_published, sort_order, created_at, updated_at
       FROM career_posts WHERE id = :id`,
      { id: req.params.id }
    );
    if (!row) {
      return res.status(404).json({ message: "Career post not found." });
    }
    return res.json({ post: mapCareerPost(row) });
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

    const isPublished =
      req.body.isPublished === true ||
      req.body.isPublished === "true" ||
      req.body.isPublished === "1" ||
      req.body.isPublished === 1;

    const result = await query(
      `INSERT INTO career_posts (title, description, role_type, is_published, sort_order)
       VALUES (:title, :description, :roleType, :isPublished, :sortOrder)`,
      {
        title,
        description,
        roleType: req.body.roleType?.trim() || null,
        isPublished: isPublished ? 1 : 0,
        sortOrder: Number(req.body.sortOrder) || 0
      }
    );

    const post = await queryOne("SELECT * FROM career_posts WHERE id = :id", {
      id: result.insertId
    });
    return res.status(201).json({ post: mapCareerPost(post) });
  } catch (error) {
    return next(error);
  }
}

async function updateCareerPost(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT id FROM career_posts WHERE id = :id", { id });
    if (!existing) {
      return res.status(404).json({ message: "Career post not found." });
    }

    const title = req.body.title !== undefined ? String(req.body.title).trim() : null;
    const description =
      req.body.description !== undefined ? String(req.body.description).trim() : null;
    const roleType =
      req.body.roleType !== undefined
        ? req.body.roleType
          ? String(req.body.roleType).trim()
          : null
        : null;
    const sortOrder =
      req.body.sortOrder !== undefined && req.body.sortOrder !== ""
        ? Number(req.body.sortOrder)
        : null;

    let isPublished = null;
    if (req.body.isPublished !== undefined && req.body.isPublished !== "") {
      isPublished =
        req.body.isPublished === true ||
        req.body.isPublished === "true" ||
        req.body.isPublished === "1" ||
        req.body.isPublished === 1
          ? 1
          : 0;
    }

    await query(
      `UPDATE career_posts
       SET title = COALESCE(:title, title),
           description = COALESCE(:description, description),
           role_type = COALESCE(:roleType, role_type),
           is_published = COALESCE(:isPublished, is_published),
           sort_order = COALESCE(:sortOrder, sort_order)
       WHERE id = :id`,
      { id, title, description, roleType, isPublished, sortOrder }
    );

    const post = await queryOne("SELECT * FROM career_posts WHERE id = :id", { id });
    return res.json({ post: mapCareerPost(post) });
  } catch (error) {
    return next(error);
  }
}

async function deleteCareerPost(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await queryOne("SELECT id FROM career_posts WHERE id = :id", { id });
    if (!existing) {
      return res.status(404).json({ message: "Career post not found." });
    }
    await query("DELETE FROM career_posts WHERE id = :id", { id });
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
    await saveCareersPageSettings({ title, intro });
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
