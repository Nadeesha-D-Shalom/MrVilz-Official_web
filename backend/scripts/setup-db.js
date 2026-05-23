/**
 * Manual DB setup helper — run: npm run db:setup --workspace backend
 * Requires MySQL running and backend/.env configured.
 */
const { bootstrapDatabase } = require("../src/utils/bootstrap");

bootstrapDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
