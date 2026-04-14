const express = require("express");
const router = express.Router();

const { register, login } = require("./auth.controller");
const { authLimiter } = require("../../middleware/rateLimiter.middleware");

router.post("/login", authLimiter, register);
router.post("/register", authLimiter, login);

module.exports = router;