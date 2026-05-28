const bcrypt = require("bcrypt");
const env = require("../config/env");
const { ROLES } = require("./adminRoles");
const { connectDb } = require("../config/db");
const { upsertContent } = require("./content");
const { slugify } = require("./slugify");
const {
  SiteStat,
  SocialLink,
  TeamMember,
  Project,
  GalleryItem,
  CareerPost,
  Admin
} = require("../models");
const {
  defaultHero,
  defaultAbout,
  defaultCareersPage,
  defaultStats,
  defaultSocialLinks,
  defaultTeam,
  defaultProjects,
  defaultCareerPosts,
  defaultGallery
} = require("../data/defaults");

async function ensureAdmin() {
  const existing = await Admin.findOne().lean();
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.admin.password, 12);
  await Admin.create({
    username: env.admin.username,
    password_hash: passwordHash,
    display_name: "Site Admin",
    role: ROLES.SUPER_ADMIN,
    is_active: 1
  });
}

async function migrateAdminRoles() {
  await Admin.updateMany(
    { $or: [{ role: { $exists: false } }, { role: null }, { role: "" }] },
    { $set: { role: ROLES.ADMIN } }
  );
  await Admin.updateOne(
    { username: env.admin.username },
    { $set: { role: ROLES.SUPER_ADMIN } }
  );
  await Admin.updateOne({ username: "nadeesha24" }, { $set: { role: ROLES.SUPER_ADMIN } });
}

async function ensureStats() {
  const count = await SiteStat.countDocuments();
  if (count > 0) return;
  await SiteStat.insertMany(defaultStats);
}

async function ensureSocialLinks() {
  const count = await SocialLink.countDocuments();
  if (count > 0) return;
  await SocialLink.insertMany(defaultSocialLinks);
}

async function ensureTeam() {
  const count = await TeamMember.countDocuments();
  if (count > 0) return;
  await TeamMember.insertMany(defaultTeam);
}

async function ensureProjects() {
  const count = await Project.countDocuments();
  if (count > 0) return;
  await Project.insertMany(defaultProjects);
}

async function ensureCareerPosts() {
  const count = await CareerPost.countDocuments();
  if (count > 0) return;
  await CareerPost.insertMany(defaultCareerPosts);
}

async function ensureGallery() {
  const count = await GalleryItem.countDocuments();
  if (count > 0) return;
  await GalleryItem.insertMany(defaultGallery);
}

async function ensureContentDefaults() {
  const { SiteContent } = require("../models");
  const hero = await SiteContent.findOne({ content_key: "hero" });
  if (!hero) await upsertContent("hero", defaultHero);

  const about = await SiteContent.findOne({ content_key: "about" });
  if (!about) await upsertContent("about", defaultAbout);

  const careers = await SiteContent.findOne({ content_key: "careers" });
  if (!careers) await upsertContent("careers", defaultCareersPage);
}

async function syncTeamProfiles() {
  await TeamMember.updateMany(
    { name: /nadeesha/i, slug: { $nin: ["nadeesha", null, ""] } },
    { $set: { slug: "nadeesha" } }
  );

  const profileUpdates = [
    {
      slug: "nadeesha",
      name: "Nadeesha D Shalom",
      position: "Founder, Presenter & Full-Stack Developer",
      bio: "Nadeesha D Shalom is the Founder and Creative Technology Lead of Mr Vilz, driving environmental awareness through digital innovation, media storytelling, and youth-led community initiatives."
    },
    {
      slug: "nethmina",
      name: "Nethmina",
      position: "Co-Host & Head of Creative Director",
      bio: "Shapes creative direction and co-hosts Mr Vilz content with a focus on bold visual storytelling and audience engagement."
    },
    {
      slug: "chamidu",
      name: "Chamidu",
      position: "Co-Founder & Head of Media Production",
      bio: "Co-Founder and Head of Media Production at Mr Vilz — videography and photography for beach cleanups, events, field work, and conservation storytelling across Sri Lanka."
    },
    {
      slug: "pabodha",
      name: "Pabodha Nuwangi",
      position: "Creative Producer & Brand Partnerships",
      bio: "Creative Producer and Brand Partnerships lead at Mr Vilz — AI-focused IT undergraduate driving content creation, brand partnerships, and environmental campaigns with strong community engagement."
    }
  ];

  for (const profile of profileUpdates) {
    await TeamMember.updateOne(
      { slug: profile.slug },
      {
        $set: {
          name: profile.name,
          position: profile.position,
          bio: profile.bio,
          slug: profile.slug,
          is_leadership: 1
        }
      }
    );
    const byName = await TeamMember.findOne({
      name: new RegExp(`^${profile.name.split(" ")[0]}`, "i"),
      slug: { $ne: profile.slug }
    });
    if (byName && !byName.slug) {
      await TeamMember.updateOne(
        { _id: byName._id },
        { $set: { slug: profile.slug || slugify(profile.name) } }
      );
    }
  }
}

async function migrateTeamLeadership() {
  const leadershipSlugs = ["nadeesha", "chamidu", "pabodha", "nethmina"];
  await TeamMember.updateMany({ slug: { $in: leadershipSlugs } }, { $set: { is_leadership: 1 } });
}

async function ensureLeadershipTeam() {
  for (const member of defaultTeam) {
    await TeamMember.updateOne(
      { slug: member.slug },
      {
        $set: {
          name: member.name,
          slug: member.slug,
          position: member.position,
          bio: member.bio,
          image_url: member.image_url,
          sort_order: member.sort_order,
          is_leadership: 1,
          is_active: 1
        }
      },
      { upsert: true }
    );
  }
}

async function bootstrapDatabase() {
  await connectDb();
  await ensureContentDefaults();
  await ensureAdmin();
  await migrateAdminRoles();
  await ensureStats();
  await ensureSocialLinks();
  await ensureTeam();
  await ensureProjects();
  await ensureCareerPosts();
  await ensureGallery();
  await syncTeamProfiles();
  await migrateTeamLeadership();
  await ensureLeadershipTeam();
  console.log("MongoDB bootstrap completed.");
}

module.exports = { bootstrapDatabase };
