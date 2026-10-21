const express = require("express");
const { llm } = require("../GenAI/llm");

const router = express.Router();

router.post("/create-with-ai", llm);

module.exports = router;