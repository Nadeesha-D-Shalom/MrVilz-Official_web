const app = require("./app");
const env = require("./config/env");
const { bootstrapDatabase } = require("./utils/bootstrap");

async function start() {
  try {
    await bootstrapDatabase();
  } catch (error) {
    console.error("Database bootstrap failed:", error.message);
    console.error("Check MONGODB_URI in backend/.env and that Atlas allows your IP.");
  }

  app.listen(env.port, () => {
    console.log(`MrVilz server listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
