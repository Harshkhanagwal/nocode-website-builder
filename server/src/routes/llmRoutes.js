const express = require("express");
const { llm } = require("../GenAI/llm");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-with-ai", protect, llm);

module.exports = router;
