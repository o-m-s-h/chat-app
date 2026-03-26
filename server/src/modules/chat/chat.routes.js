const express = require("express");
const router = express.Router();

const { getUserChats, getChatMessages } = require("./chat.controller");
const authMiddleware = require("../../middleware/auth.middleware");

router.get("/", authMiddleware, getUserChats);
router.get("/:chatId/messages", authMiddleware, getChatMessages);

module.exports = router;