const bcrypt = require("bcrypt");
const env = require("../config/env");
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
    is_active: 1
  });
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
    await TeamMember.updateOne(
      { slug: profile.slug },
      {
        $set: {
          name: profile.name,
          position: profile.position,
          bio: profile.bio,
          slug: profile.slug
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

async function bootstrapDatabase() {
  await connectDb();
  await ensureContentDefaults();
  await ensureAdmin();
  await ensureStats();
  await ensureSocialLinks();
  await ensureTeam();
  await ensureProjects();
  await ensureCareerPosts();
  await ensureGallery();
  await syncTeamProfiles();
  console.log("MongoDB bootstrap completed.");
}

module.exports = { bootstrapDatabase };
