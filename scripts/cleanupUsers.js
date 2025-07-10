// scripts/cleanupUsers.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const result = await User.deleteMany({ telegramId: null });
    console.log(`🧹 Deleted ${result.deletedCount} user(s) with telegramId: null`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup error:", err);
    process.exit(1);
  }
}

cleanup();
