# 🌤 Telegram Weather Bot with Admin Panel

A full-stack Node.js project featuring a Telegram bot that delivers daily weather updates to subscribed users. Includes an admin panel to manage users, API keys, and bot settings. Built for production use with MongoDB, Telegraf, Express, and EJS.

---

## 📁 Project Structure

WEATHER-UPDATES/
├── admin/           # Admin panel (EJS views, routes, server.js)

├── bot/             # Telegram bot logic (index.js)

├── models/          # Mongoose models (User.js, Setting.js)

├── scripts/         # Seeding and cleanup scripts

├── utils/           # Utility functions (e.g., weather fetcher, caching)

├── .env             # Actual environment variables (not committed)

├── .env.example     # Example env file for setup

├── package.json     # Project dependencies and scripts

└── README.md        # Project documentation






---

-------------------------------**## ⚙️ Setup Instructions**----------------------------------------

-----------------------------1. 🔧 Install Dependencies---------------------

npm install

-----------------------------2. 🧪 Create .env File-------------------------

Copy .env.example to .env and fill in the actual values:

TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
MONGODB_URI=your_mongodb_connection_string_here
WEATHER_API_KEY is not required in .env — it can be set via the admin panel.
---
-----------------------------3. 🌱 Seed Admin and Users---------------------

Seed the initial admin password to access the admin panel:
node scripts/seedAdmin.js

Optionally seed test users:
node scripts/seedUsers.js

If needed, run cleanup/fix scripts:
node scripts/dropOldIndex.js
node scripts/cleanup.js

-----------------------------4. 🚀 Run the App------------------------------

npm start

This will start:
--The Telegram bot (using Telegraf and cron jobs)
--The Admin panel at: http://localhost:3000/admin


✨ Features
  👨‍💼 Admin Panel
    Login with password
    View all users
    Block / Unblock / Delete users
    Update weather API key (dynamically cached)

  🤖 Telegram Bot
    Subscribe users by chat ID
    Send daily weather updates at fixed time
    Uses WeatherStack API to fetch weather
    Configurable API key via admin panel
    Uses node-cron for daily jobs

-----------------💾 Utility Scripts-------------------- 
Script                Description

seedAdmin.js —        Add initial admin password
seedUsers.js —        Add demo Telegram users
dropOldIndex.js —     Fix unique index errors
cleanup.js —          Remove duplicate/null users

------------------🔐 Environment Variables-------------

Variable	                Description

TELEGRAM_BOT_TOKEN	      Token from BotFather
MONGODB_URI	              MongoDB Atlas or local URI
WEATHER_API_KEY	          (Optional) WeatherStack API key

----------------------📦 Tech Stack--------------------

**Node.js** – Backend runtime

**Express.js** – Web server for admin panel

**MongoDB + Mongoose** – Database and ODM

**Telegraf (Telegram Bot API)** – Telegram bot framework

**node-cron (daily jobs)** – Scheduled weather upddates

**EJS templating** – Admin panel templating 

**bcrypt (password encryption)** – secure password hashing

**Axios** – HTTP client for calling Weather API

**dotenv** – Secure environment variable management

----------------------🌐 Deployment----------------------

This project is deployable to platforms like Railway.
Steps to deploy:
        Push your code to GitHub
        Connect the GitHub repo to Railway
        Add environment variables on Railway
        App auto-deploys and runs both bot + admin panel

-------------------------------------📄 License---------------------------------------------

MIT License — Free to use, modify, and deploy.

--------------------✍️ Author--------------------

Sumit Saurabh
📧 [sumit.jhk@gmail.com] (optional)
