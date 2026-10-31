const express = require("express");

const {
  getColorThemes,
  getColorTheme,
  createColorTheme,
  updateColorTheme,
  deleteColorTheme,
} = require("../controllers/colorThemeController");
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getColorThemes);

router.get("/:id", getColorTheme);

router.post("/", protect, requireAdmin, createColorTheme);

router.put("/:id", protect, requireAdmin, updateColorTheme);

router.delete("/:id", protect, requireAdmin, deleteColorTheme);

module.exports = router;
