require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin"); // Ensure the model file exists

const MONGODB_URI = process.env.MONGODB_URI;
const RAW_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Admin.findOne({});
    if (existing) {
      console.log("✅ Admin already exists.");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(RAW_PASSWORD, 10);
    await Admin.create({
      username: process.env.ADMIN_USERNAME || "admin",
      passwordHash: hashedPassword,
    });

    console.log("✅ Admin user seeded.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
})();
