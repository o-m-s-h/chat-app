const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const chatRoutes = require("./modules/chat/chat.routes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = app;