require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const MONGODB_URI = process.env.MONGODB_URI;

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB. Seeding users...");

    const users = [
      {
        chatId: "123456789", // ✔️ valid
        isSubscribed: true,
        isBlocked: false,
      },
      {
        chatId: "987654321", // ✔️ another unique ID (was probably missing earlier!)
        isSubscribed: true,
        isBlocked: false,
      }
    ];

    await User.insertMany(users, { ordered: false });
    console.log("✅ Users seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
}

seedUsers();
