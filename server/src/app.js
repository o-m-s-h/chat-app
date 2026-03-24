const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = app;