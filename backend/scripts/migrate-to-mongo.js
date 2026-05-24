/**
 * Import data into MongoDB:
 * 1. From local MySQL if DB_HOST is set and MySQL is reachable
 * 2. Otherwise seeds default site data (same as bootstrap)
 *
 * Usage: npm run db:migrate
 * Requires MONGODB_URI in backend/.env
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const env = require("../src/config/env");
const { connectDb, mongoose } = require("../src/config/db");
const { bootstrapDatabase } = require("../src/utils/bootstrap");
const {
  SiteContent,
  SiteStat,
  SocialLink,
  TeamMember,
  Project,
  ContactMessage,
  GalleryItem,
  TeamApplication,
  CareerPost,
  JobApplication,
  Admin
} = require("../src/models");

function parseJson(val) {
  if (!val) return null;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

async function clearAll() {
  await Promise.all([
    SiteContent.deleteMany({}),
    SiteStat.deleteMany({}),
    SocialLink.deleteMany({}),
    TeamMember.deleteMany({}),
    Project.deleteMany({}),
    ContactMessage.deleteMany({}),
    GalleryItem.deleteMany({}),
    TeamApplication.deleteMany({}),
    CareerPost.deleteMany({}),
    JobApplication.deleteMany({}),
    Admin.deleteMany({})
  ]);
}

async function importFromMysql() {
  if (!env.mysql.host) {
    console.log("No DB_HOST — skipping MySQL import.");
    return false;
  }

  let mysql;
  try {
    mysql = require("mysql2/promise");
  } catch {
    console.log("mysql2 not installed — run npm install in backend.");
    return false;
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
      database: env.mysql.database
    });
  } catch (err) {
    console.log("MySQL not reachable:", err.message);
    return false;
  }

  console.log("Importing from MySQL", env.mysql.database, "...");

  const [contentRows] = await connection.query("SELECT content_key, content_json FROM site_content");
  for (const row of contentRows) {
    await SiteContent.create({
      content_key: row.content_key,
      content_json: parseJson(row.content_json)
    });
  }

  const [stats] = await connection.query("SELECT * FROM site_stats");
  if (stats.length) await SiteStat.insertMany(stats);

  const [social] = await connection.query("SELECT * FROM social_links");
  if (social.length) await SocialLink.insertMany(social);

  const [team] = await connection.query("SELECT * FROM team_members");
  if (team.length) await TeamMember.insertMany(team);

  const [projects] = await connection.query("SELECT * FROM projects");
  for (const p of projects) {
    p.highlights = parseJson(p.highlights) || [];
  }
  if (projects.length) await Project.insertMany(projects);

  const [gallery] = await connection.query("SELECT * FROM gallery_items");
  if (gallery.length) await GalleryItem.insertMany(gallery);

  const [messages] = await connection.query("SELECT * FROM contact_messages");
  if (messages.length) await ContactMessage.insertMany(messages);

  const [teamApps] = await connection.query("SELECT * FROM team_applications");
  if (teamApps.length) await TeamApplication.insertMany(teamApps);

  const [careers] = await connection.query("SELECT * FROM career_posts");
  if (careers.length) await CareerPost.insertMany(careers);

  const [jobApps] = await connection.query("SELECT * FROM job_applications");
  if (jobApps.length) await JobApplication.insertMany(jobApps);

  const [admins] = await connection.query("SELECT * FROM admins");
  if (admins.length) await Admin.insertMany(admins);

  await connection.end();
  console.log("MySQL import finished.");
  return true;
}

async function main() {
  if (!env.mongodb.uri) {
    console.error("Set MONGODB_URI in backend/.env first.");
    process.exit(1);
  }

  await connectDb();

  const existing = await SiteContent.countDocuments();
  const force = process.argv.includes("--force");

  if (existing > 0 && !force) {
    console.log(
      "MongoDB already has data. Run with --force to wipe and re-import, or use db:seed for empty collections only."
    );
    await mongoose.disconnect();
    return;
  }

  if (force) {
    console.log("Clearing MongoDB collections...");
    await clearAll();
  }

  const imported = await importFromMysql();

  if (!imported) {
    console.log("Seeding defaults...");
    await bootstrapDatabase();
  } else {
    console.log("Verifying content keys...");
    const careers = await SiteContent.findOne({ content_key: "careers" });
    if (careers?.content_json?.openRoles) {
      const data = parseJson(careers.content_json);
      await SiteContent.updateOne(
        { content_key: "careers" },
        { content_json: { title: data.title, intro: data.intro || "" } }
      );
    }
  }

  const counts = {
    site_content: await SiteContent.countDocuments(),
    team: await TeamMember.countDocuments(),
    projects: await Project.countDocuments(),
    career_posts: await CareerPost.countDocuments(),
    admins: await Admin.countDocuments()
  };
  console.log("Document counts:", counts);
  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
