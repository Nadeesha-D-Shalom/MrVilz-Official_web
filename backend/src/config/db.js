const mongoose = require("mongoose");
const env = require("./env");

mongoose.set("strictQuery", true);

async function connectDb() {
  if (!env.mongodb.uri) {
    throw new Error("MONGODB_URI is not set. Add it to backend/.env");
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  await mongoose.connect(env.mongodb.uri, {
    dbName: env.mongodb.dbName
  });
  return mongoose.connection;
}

module.exports = { connectDb, mongoose };
