const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const chatRoutes = require("./modules/chat/chat.routes");
const userRoutes = require("./modules/user/user.routes");
const { globalLimiter, authLimiter } = require("./middleware/rateLimiter.middleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==============================
// 🌐 Global Rate Limiter
// ==============================
app.use(globalLimiter);

// ==============================
// 🛣️ Routes
// ==============================
app.use("/api/auth", authLimiter, authRoutes);  // stricter limiter on auth
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = app;