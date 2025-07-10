require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  try {
    await mongoose.connection.collection('users').dropIndex("telegramId_1");
    console.log("🧹 Dropped old index on telegramId");
  } catch (err) {
    console.log("⚠️ Index telegramId_1 may not exist or already dropped");
  }

  mongoose.disconnect();
})();
