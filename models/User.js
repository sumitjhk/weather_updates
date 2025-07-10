const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true, // this causes the duplicate key error if telegramId is null or reused
  },
  name: { 
    type: String,
    default: "",
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
