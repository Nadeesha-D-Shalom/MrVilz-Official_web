/**
 * Promote an admin user to super_admin.
 * Usage (from backend folder):
 *   node scripts/promote-super-admin.js
 *   node scripts/promote-super-admin.js nadeesha24
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { connectDb, mongoose } = require("../src/config/db");
const { Admin } = require("../src/models");

const username = process.argv[2] || "nadeesha24";

async function main() {
  await connectDb();

  const result = await Admin.updateOne({ username }, { $set: { role: "super_admin" } });

  if (result.matchedCount === 0) {
    console.error(`No admin found with username "${username}".`);
    process.exit(1);
  }

  const doc = await Admin.findOne({ username }).select("username role display_name").lean();
  console.log(`Updated "${username}" to super_admin:`);
  console.log(doc);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
