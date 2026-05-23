const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const env = require("../config/env");
const { initPool, query, queryOne } = require("../config/db");
const { slugify } = require("./slugify");

const defaultHero = {
  eyebrow: "Protecting Sri Lanka's marine future",
  title: "Mr Vilz",
  subtitle: "We are striving to protect the marine environment of Sri Lanka.",
  primaryAction: { label: "Be Involved", href: "#projects" },
  secondaryAction: { label: "About Us", href: "#about" },
  mediaType: "image",
  mediaUrl: "/images/background.png",
  mediaAlt: "Mr Vilz hero background"
};

const defaultAbout = {
  title: "What Mr Vilz Does",
  paragraphs: [
    "Mr Vilz is a Sri Lankan youth-led environmental and creative media organization combining conservation action, entertainment storytelling, and community campaigns across beaches, forests, and wildlife protection.",
    "We believe small actions can create a big change. Through our projects and social media, we inspire people to protect Sri Lanka's beaches, forests, wildlife, and natural beauty.",
    "Our team consists of passionate individuals and volunteers who are committed to making a positive impact on nature and society.",
    "Would you like to be a part of making Sri Lanka cleaner, greener, and more beautiful?"
  ]
};

async function getRootConnection() {
  return mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true
  });
}

async function ensureDatabaseAndTables() {
  const connection = await getRootConnection();
  const schemaPath = path.join(__dirname, "..", "..", "database", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.changeUser({ database: env.db.database });

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(
      (s) =>
        s &&
        !s.startsWith("--") &&
        !/^CREATE DATABASE/i.test(s) &&
        !/^USE /i.test(s)
    );

  for (const statement of statements) {
    await connection.query(statement);
  }

  await connection.end();
}

async function ensureContent(key, value) {
  const existing = await queryOne(
    "SELECT id FROM site_content WHERE content_key = :key LIMIT 1",
    { key }
  );

  if (!existing) {
    await query(
      "INSERT INTO site_content (content_key, content_json) VALUES (:key, :json)",
      { key, json: JSON.stringify(value) }
    );
  }
}

async function ensureStats() {
  const count = await queryOne("SELECT COUNT(*) AS total FROM site_stats");
  if (Number(count?.total) > 0) return;

  const stats = [
    { stat_key: "volunteers", label: "Volunteers", value: 120, suffix: "+", sort_order: 1 },
    { stat_key: "cleanups", label: "Beach Cleanups", value: 24, suffix: "", sort_order: 2 },
    { stat_key: "trees", label: "Trees Planted", value: 8500, suffix: "+", sort_order: 3 },
    { stat_key: "followers", label: "Community Reach", value: 50000, suffix: "+", sort_order: 4 }
  ];

  for (const stat of stats) {
    await query(
      `INSERT INTO site_stats (stat_key, label, value, suffix, sort_order)
       VALUES (:stat_key, :label, :value, :suffix, :sort_order)`,
      stat
    );
  }
}

async function ensureSocialLinks() {
  const count = await queryOne("SELECT COUNT(*) AS total FROM social_links");
  if (Number(count?.total) > 0) return;

  const links = [
    { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/", icon: "facebook", sort_order: 1 },
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/", icon: "instagram", sort_order: 2 },
    { platform: "youtube", label: "YouTube", url: "https://www.youtube.com/", icon: "youtube", sort_order: 3 },
    { platform: "tiktok", label: "TikTok", url: "https://www.tiktok.com/", icon: "tiktok", sort_order: 4 }
  ];

  for (const link of links) {
    await query(
      `INSERT INTO social_links (platform, label, url, icon, sort_order)
       VALUES (:platform, :label, :url, :icon, :sort_order)`,
      link
    );
  }
}

async function ensureTeam() {
  const count = await queryOne("SELECT COUNT(*) AS total FROM team_members");
  if (Number(count?.total) > 0) return;

  const members = [
    {
      name: "Nadeesha D Shalom",
      slug: "nadeesha",
      position: "Founder, Presenter & Full-Stack Developer",
      bio: "Software Engineering undergraduate and Founder of MrVilz — building digital solutions, cinematic travel content, and nature storytelling through modern technology.",
      image_url: "/images/nadeesha1.JPG",
      sort_order: 1
    },
    {
      name: "Chamidu",
      slug: "chamidu",
      position: "Co-Founder & Head of Media Production",
      bio: "Videography and photography for MrVilz — field shoots, campaigns, and visual storytelling.",
      image_url: "/images/chamidu.jpeg",
      sort_order: 2
    },
    {
      name: "Pabodha Nuwangi",
      slug: "pabodha",
      position: "Creative Producer & Brand Partnerships",
      bio: "Creative media, content creation, and brand partnerships — passionate about environmental awareness and community projects.",
      image_url: "/images/paboda.jpeg",
      sort_order: 3
    },
    {
      name: "Nethmina",
      slug: "nethmina",
      position: "Co-Host & Head of Creative Director",
      bio: "Shapes creative direction and co-hosts MrVilz content with a focus on bold visual storytelling and audience engagement.",
      image_url: "/images/nethmina.JPG",
      sort_order: 4
    }
  ];

  for (const member of members) {
    await query(
      `INSERT INTO team_members (name, slug, position, bio, image_url, sort_order)
       VALUES (:name, :slug, :position, :bio, :image_url, :sort_order)`,
      member
    );
  }
}

async function ensureProjects() {
  const count = await queryOne("SELECT COUNT(*) AS total FROM projects");
  if (Number(count?.total) > 0) return;

  const projects = [
    {
      title: "Clean Panadura Beach Sri Lanka",
      summary:
        "A coastal cleanup effort focused on reducing waste, protecting the shoreline, and building stronger community action around a cleaner beach environment.",
      progress: 46,
      image_url: "/images/beach.PNG",
      visual_layout: "landscape",
      highlights: JSON.stringify(["Beach cleanup", "Volunteer action", "Coastal protection"]),
      sort_order: 1
    },
    {
      title: "Plants Donation Campaign",
      summary:
        "A greening campaign that encourages communities to plant, nurture, and protect young trees for a healthier and cleaner future.",
      progress: 2,
      image_url: "/images/plant.PNG",
      visual_layout: "portrait",
      highlights: JSON.stringify(["Plant today", "Nurture growth", "Protect nature"]),
      sort_order: 2
    }
  ];

  for (const project of projects) {
    await query(
      `INSERT INTO projects (title, summary, progress, image_url, visual_layout, highlights, sort_order)
       VALUES (:title, :summary, :progress, :image_url, :visual_layout, :highlights, :sort_order)`,
      project
    );
  }
}

const defaultCareersPage = {
  title: "Careers at Mr Vilz",
  intro:
    "Join a youth-led movement protecting Sri Lanka's beaches, forests, and wildlife through media, community action, and environmental projects."
};

const defaultCareerPosts = [
  {
    title: "Content Creator",
    role_type: "Volunteer / Part-time",
    description: "Create photo and video content for campaigns and social platforms."
  },
  {
    title: "Community Coordinator",
    role_type: "Volunteer",
    description: "Organize cleanups, tree planting, and local outreach events."
  },
  {
    title: "Media Production Assistant",
    role_type: "Internship",
    description: "Support filming, editing, and publishing for Mr Vilz channels."
  }
];

async function ensureCareers() {
  const row = await queryOne(
    "SELECT content_json FROM site_content WHERE content_key = 'careers' LIMIT 1"
  );
  if (!row) {
    await ensureContent("careers", defaultCareersPage);
    return;
  }
  const data =
    typeof row.content_json === "string" ? JSON.parse(row.content_json) : row.content_json;
  const slim = {
    title: data.title || defaultCareersPage.title,
    intro: data.intro || defaultCareersPage.intro
  };
  await query(
    "UPDATE site_content SET content_json = :json WHERE content_key = 'careers'",
    { json: JSON.stringify(slim) }
  );
}

async function migrateCareerPosts() {
  const tables = await query("SHOW TABLES LIKE 'career_posts'");
  if (!tables.length) {
    await query(`
      CREATE TABLE career_posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        role_type VARCHAR(120) DEFAULT NULL,
        is_published TINYINT(1) NOT NULL DEFAULT 0,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  const count = await queryOne("SELECT COUNT(*) AS total FROM career_posts");
  if (Number(count?.total) > 0) return;

  const contentRow = await queryOne(
    "SELECT content_json FROM site_content WHERE content_key = 'careers' LIMIT 1"
  );
  let roles = defaultCareerPosts;
  if (contentRow) {
    const data =
      typeof contentRow.content_json === "string"
        ? JSON.parse(contentRow.content_json)
        : contentRow.content_json;
    if (Array.isArray(data.openRoles) && data.openRoles.length) {
      roles = data.openRoles.map((role) => ({
        title: role.title,
        role_type: role.type || role.role_type || null,
        description: role.description
      }));
    }
  }

  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    if (!role.title || !role.description) continue;
    await query(
      `INSERT INTO career_posts (title, description, role_type, is_published, sort_order)
       VALUES (:title, :description, :roleType, 1, :sortOrder)`,
      {
        title: role.title,
        description: role.description,
        roleType: role.role_type || null,
        sortOrder: i
      }
    );
  }
}

async function ensureGallery() {
  const count = await queryOne("SELECT COUNT(*) AS total FROM gallery_items");
  if (Number(count?.total) > 0) return;

  const items = [
    { title: "Beach Cleanup", caption: "Panadura shoreline action", image_url: "/images/beach.PNG", category: "projects", sort_order: 1 },
    { title: "Tree Planting", caption: "Greening our communities", image_url: "/images/plant.PNG", category: "projects", sort_order: 2 },
    { title: "Team Moment", caption: "Behind the scenes", image_url: "/images/nadeesha1.JPG", category: "team", sort_order: 3 },
    { title: "On Location", caption: "Field production", image_url: "/images/chamidu.jpeg", category: "media", sort_order: 4 }
  ];

  for (const item of items) {
    await query(
      `INSERT INTO gallery_items (title, caption, image_url, category, sort_order)
       VALUES (:title, :caption, :image_url, :category, :sort_order)`,
      item
    );
  }
}

async function migrateApplicationsTables() {
  const tables = await query("SHOW TABLES LIKE 'job_applications'");
  if (!tables.length) {
    await query(`
      CREATE TABLE job_applications (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        job_title VARCHAR(200) NOT NULL,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(180) NOT NULL,
        phone VARCHAR(40) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        age INT UNSIGNED NOT NULL,
        gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NOT NULL,
        linkedin_url VARCHAR(500) DEFAULT NULL,
        portfolio_url VARCHAR(500) DEFAULT NULL,
        current_role VARCHAR(200) DEFAULT NULL,
        experience_years INT UNSIGNED DEFAULT NULL,
        cover_letter TEXT,
        cv_filename VARCHAR(255) NOT NULL,
        cv_url VARCHAR(500) NOT NULL,
        additional_doc_filename VARCHAR(255) DEFAULT NULL,
        additional_doc_url VARCHAR(500) DEFAULT NULL,
        additional_info TEXT,
        status ENUM('new', 'reviewing', 'shortlisted', 'rejected', 'hired') NOT NULL DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  const teamCols = await query("SHOW COLUMNS FROM team_applications");
  const colNames = teamCols.map((c) => c.Field);
  if (colNames.includes("cv_filename") && !colNames.includes("message")) {
    await query("ALTER TABLE team_applications ADD COLUMN message TEXT AFTER gender");
  }
  if (colNames.includes("linkedin_url")) {
    await query(`
      ALTER TABLE team_applications
        DROP COLUMN linkedin_url,
        DROP COLUMN portfolio_url,
        DROP COLUMN current_role,
        DROP COLUMN experience_years,
        DROP COLUMN cover_letter,
        DROP COLUMN cv_filename,
        DROP COLUMN cv_url,
        DROP COLUMN additional_doc_filename,
        DROP COLUMN additional_doc_url,
        DROP COLUMN additional_info
    `).catch(() => {});
  }
}

async function migrateAdminsTable() {
  const cols = await query("SHOW COLUMNS FROM admins");
  const names = cols.map((c) => c.Field);

  if (!names.includes("email")) {
    await query("ALTER TABLE admins ADD COLUMN email VARCHAR(180) NULL AFTER display_name");
  }
  if (!names.includes("phone")) {
    await query("ALTER TABLE admins ADD COLUMN phone VARCHAR(40) NULL AFTER email");
  }
  if (!names.includes("address")) {
    await query("ALTER TABLE admins ADD COLUMN address TEXT NULL AFTER phone");
  }
  if (!names.includes("is_active")) {
    await query(
      "ALTER TABLE admins ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER address"
    );
  }
}

async function migrateTeamMembers() {
  const cols = await query("SHOW COLUMNS FROM team_members");
  const names = cols.map((c) => c.Field);

  if (!names.includes("slug")) {
    await query("ALTER TABLE team_members ADD COLUMN slug VARCHAR(120) NULL AFTER name");
    await query("ALTER TABLE team_members ADD UNIQUE KEY uq_team_slug (slug)").catch(() => {});
  }

  const rows = await query("SELECT id, name, slug FROM team_members");
  for (const row of rows) {
    if (!row.slug) {
      const slug = slugify(row.name);
      if (slug) {
        await query("UPDATE team_members SET slug = :slug WHERE id = :id", { slug, id: row.id }).catch(
          () => {}
        );
      }
    }
  }

  const profileUpdates = [
    {
      slug: "nadeesha",
      name: "Nadeesha D Shalom",
      position: "Founder, Presenter & Full-Stack Developer",
      bio: "Software Engineering undergraduate and Founder of MrVilz — building digital solutions, cinematic travel content, and nature storytelling through modern technology."
    },
    {
      slug: "nethmina",
      name: "Nethmina",
      position: "Co-Host & Head of Creative Director",
      bio: "Shapes creative direction and co-hosts MrVilz content with a focus on bold visual storytelling and audience engagement."
    },
    {
      slug: "chamidu",
      name: "Chamidu",
      position: "Co-Founder & Head of Media Production",
      bio: "Videography and photography for MrVilz — field shoots, campaigns, and visual storytelling."
    },
    {
      slug: "pabodha",
      name: "Pabodha Nuwangi",
      position: "Creative Producer & Brand Partnerships",
      bio: "Creative media, content creation, and brand partnerships — passionate about environmental awareness and community projects."
    }
  ];

  for (const profile of profileUpdates) {
    await query(
      `UPDATE team_members
       SET name = :name, position = :position, bio = :bio, slug = :slug
       WHERE slug = :slug OR name LIKE :nameLike`,
      {
        ...profile,
        nameLike:
          profile.slug === "nadeesha"
            ? "Nadeesha%"
            : profile.slug === "pabodha"
              ? "Pabodh%"
              : profile.slug === "chamidu"
                ? "Chamidu%"
                : `${profile.name}%`
      }
    );
  }
}

async function migrateGalleryTable() {
  const cols = await query("SHOW COLUMNS FROM gallery_items");
  const names = cols.map((c) => c.Field);
  if (!names.includes("file_hash")) {
    await query("ALTER TABLE gallery_items ADD COLUMN file_hash VARCHAR(64) NULL AFTER image_url");
  }
}

async function ensureAdmin() {
  const existing = await queryOne("SELECT id FROM admins LIMIT 1");
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.admin.password, 12);
  await query(
    `INSERT INTO admins (username, password_hash, display_name)
     VALUES (:username, :password_hash, :display_name)`,
    {
      username: env.admin.username,
      password_hash: passwordHash,
      display_name: "Site Admin"
    }
  );
}

async function bootstrapDatabase() {
  try {
    await ensureDatabaseAndTables();
    initPool();
    await migrateApplicationsTables();
    await migrateAdminsTable();
    await migrateGalleryTable();
    await migrateTeamMembers();
    await migrateCareerPosts();
    await ensureAdmin();
    await ensureContent("hero", defaultHero);
    await ensureContent("about", defaultAbout);
    await ensureStats();
    await ensureSocialLinks();
    await ensureTeam();
    await ensureProjects();
    await query(
      `UPDATE projects SET title = 'Plants Donation Campaign'
       WHERE title LIKE '%10,000 Plants%' OR title LIKE '%10000 Plants%'`
    );
    await ensureCareers();
    await ensureGallery();
    console.log("Database bootstrap completed.");
  } catch (error) {
    console.error("Database bootstrap failed:", error.message);
    console.error("Check MySQL is running and backend/.env credentials are correct.");
  }
}

module.exports = { bootstrapDatabase };
