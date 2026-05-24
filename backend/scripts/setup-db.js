require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { bootstrapDatabase } = require("../src/utils/bootstrap");
const { mongoose } = require("../src/config/db");

bootstrapDatabase()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
