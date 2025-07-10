require("dotenv").config();
const axios = require("axios");
const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const cron = require("node-cron");

const User = require("../models/User");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const bot = new Telegraf(TOKEN);

// 🌤️ Fetch Weather Data
const fetchWeather = async (cityName) => {
  try {
    if (!WEATHER_API_KEY) return "⚠️ Weather API key not configured. Ask admin.";

    const url = `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${cityName}`;
    const res = await axios.get(url);
    const data = res.data;

    if (!data.current) return "❌ Invalid city or API error.";

    return `📍 ${data.location.name}, ${data.location.country}
🌡️ Temp: ${data.current.temperature}°C
🌥️ ${data.current.weather_descriptions[0]}
💨 Wind: ${data.current.wind_speed} km/h`;
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    return "❌ Failed to fetch weather.";
  }
};

// 🤖 Setup Bot Commands & Listeners
const setupBotHandlers = () => {
  bot.use(async (ctx, next) => {
    const chatId = ctx.chat?.id?.toString();
    const firstName = ctx.from?.first_name || "";
    const lastName = ctx.from?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    console.log(`📩 Message from ${fullName} (${chatId})`);

    if (chatId) {
      await User.updateOne(
        { chatId },
        {
          $set: { name: fullName },
          $setOnInsert: {
            isSubscribed: false,
            isBlocked: false,
            location: null,
            chatId,
          },
        },
        { upsert: true }
      );
    }

    return next();
  });

  bot.start((ctx) => {
    ctx.reply("👋 Welcome! Use /subscribe to get daily weather updates.");
  });

  bot.command("help", (ctx) => {
    ctx.reply(`🛠 Available Commands:
/subscribe - Get daily weather updates
/unsubscribe - Stop daily updates
/setcity <city> - Set your preferred city
/status - Show your current settings
/help - Show this help message

Or just send a city name to get its current weather.`);
  });

  bot.command("subscribe", async (ctx) => {
    const chatId = ctx.chat?.id?.toString();
    if (!chatId) return ctx.reply("❌ Invalid chat ID");

    try {
      await User.updateOne({ chatId }, { isSubscribed: true });
      ctx.reply("✅ Subscribed for daily weather updates!");
    } catch (err) {
      console.error("Subscription error:", err);
      ctx.reply("❌ Subscription failed.");
    }
  });

  bot.command("unsubscribe", async (ctx) => {
    const chatId = ctx.chat?.id?.toString();
    if (!chatId) return ctx.reply("❌ Invalid chat ID");

    try {
      await User.updateOne({ chatId }, { isSubscribed: false });
      ctx.reply("❌ Unsubscribed from updates.");
    } catch (err) {
      console.error("Unsubscribe error:", err);
      ctx.reply("❌ Unsubscription failed.");
    }
  });

  bot.command("setcity", async (ctx) => {
    const chatId = ctx.chat?.id?.toString();
    const parts = ctx.message.text.split(" ");

    if (!chatId || parts.length < 2) {
      return ctx.reply("❗ Usage: /setcity <your_city>");
    }

    const city = parts.slice(1).join(" ");
    try {
      await User.updateOne({ chatId }, { location: city }, { upsert: true });
      ctx.reply(`📍 Preferred city set to: ${city}`);
    } catch (err) {
      console.error("City update error:", err);
      ctx.reply("❌ Failed to set city.");
    }
  });

  bot.command("status", async (ctx) => {
    const chatId = ctx.chat?.id?.toString();
    if (!chatId) return ctx.reply("❌ Invalid chat ID");

    const user = await User.findOne({ chatId });

    if (!user) return ctx.reply("👤 You are not subscribed yet.");

    ctx.reply(`🧾 Your Settings:
✅ Subscribed: ${user.isSubscribed ? "Yes" : "No"}
📍 City: ${user.location || "Not set"}`);
  });

  bot.on("text", async (ctx) => {
    const city = ctx.message.text.trim();
    const weather = await fetchWeather(city);
    ctx.reply(weather);
  });
};

// ⏰ Schedule Daily Updates at 8 AM
const scheduleDailyWeather = () => {
  cron.schedule("0 8 * * *", async () => {
    const users = await User.find({ isSubscribed: true });

    if (!users.length) {
      console.log("📭 No users subscribed for daily updates.");
      return;
    }

    for (const user of users) {
      const city = user.location || "Delhi";
      const weather = await fetchWeather(city);
      await bot.telegram.sendMessage(
        user.chatId,
        `☀️ Daily Weather for ${city}:\n${weather}`
      );
    }

    console.log(`✅ Sent daily updates to ${users.length} users.`);
  });
};

// 🚀 Initialize Bot
(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    setupBotHandlers();
    scheduleDailyWeather();

    await bot.launch();
    console.log("🤖 Telegram bot started");

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  } catch (err) {
    console.error("❌ Bot initialization failed:", err);
  }
})();
