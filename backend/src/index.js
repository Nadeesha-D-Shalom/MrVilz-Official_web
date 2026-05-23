const app = require("./app");
const env = require("./config/env");
const { bootstrapDatabase } = require("./utils/bootstrap");

async function start() {
  try {
    await bootstrapDatabase();
  } catch (error) {
    console.error("Database bootstrap failed:", error.message);
    console.error("Check MySQL is running and backend/.env credentials are correct.");
  }

  app.listen(env.port, () => {
    console.log(`MrVilz server listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
