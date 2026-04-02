const express = require("express");
const router = express.Router();

const { getAllUsers, addContact, getContacts } = require("./user.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// router.get("/", authMiddleware, getAllUsers);
router.get("/", authMiddleware, getContacts);
router.post("/add", authMiddleware, addContact);
router.get("/contacts", authMiddleware, getContacts);

module.exports = router;