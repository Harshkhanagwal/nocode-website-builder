const express = require("express");

const {
  getColorThemes,
  getColorTheme,
  createColorTheme,
  deleteColorTheme,
} = require("../controllers/colorThemeController");

const router = express.Router();

router.get("/", getColorThemes);

router.get("/:id", getColorTheme);

router.post("/", createColorTheme);

router.delete("/:id", deleteColorTheme);

module.exports = router;