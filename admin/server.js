const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const User = require('../models/User');
const Setting = require('../models/Setting');

const app = express();
const PORT = 3000;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKeyHere',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// ✅ Flash message middleware
app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  req.session.success = null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Hardcoded Admin Credentials (hashed for "admin123")
const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || "admin",
  passwordHash: process.env.ADMIN_PASSWORD_HASH
};

// ✅ Auth Middleware
function checkAuth(req, res, next) {
  if (req.session && req.session.user === ADMIN_USER.username) {
    return next();
  }
  res.redirect('/admin/login');
}

//✅ Routes
// Root redirect to login
app.get("/", (req, res) => {
  res.redirect("/admin/login");
});

// ✅ Login Routes
app.get('/admin/login', (req, res) => {
  res.render('login', { error: null });
});

// Login Submission
app.post('/admin/login', async (req, res) => {
  const { password } = req.body;

  // Check if both password and hash exist
  if (!password || !ADMIN_USER.passwordHash) {
    return res.render('login', { error: "Missing password or configuration." });
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, ADMIN_USER.passwordHash);

    if (isPasswordValid) {
      req.session.user = ADMIN_USER.username;
      res.redirect('/admin');
    } else {
      res.render('login', { error: "Invalid password." });
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    res.render('login', { error: "Internal server error." });
  }
});

// ✅ Dashboard Route (Searchable by telegramId)
app.get('/admin', checkAuth, async (req, res) => {
  const search = req.query.search || '';
  try {
    const users = await User.find({
      telegramId: { $regex: search, $options: 'i' }
    });
    res.render('dashboard', { users: users || [], query: search });
  } catch (err) {
    console.error("❌ Error loading dashboard:", err);
    res.send("Error loading dashboard");
  }
});

// ✅ Block User
app.post('/admin/block/:id', checkAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
  req.session.success = '✅ User blocked successfully!';
  res.redirect('/admin');
});

// ✅ Unblock User
app.post('/admin/unblock/:id', checkAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
  req.session.success = '✅ User unblocked successfully!';
  res.redirect('/admin');
});

// ✅ Delete User
app.post('/admin/delete/:id', checkAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  req.session.success = '✅ User deleted successfully!';
  res.redirect('/admin');
});

// ✅ Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🌐 Admin panel running at http://localhost:${PORT}/admin`);
});
