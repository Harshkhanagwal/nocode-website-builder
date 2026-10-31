const express = require("express");

const {
  getTypographies,
  getAllTypographiesForAdmin,
  getTypography,
  createTypography,
  updateTypography,
  deleteTypography,
} = require("../controllers/typographyController");
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getTypographies);

router.get("/manage/all", protect, requireAdmin, getAllTypographiesForAdmin);

router.get("/:id", getTypography);

router.post("/", protect, requireAdmin, createTypography);

router.put("/:id", protect, requireAdmin, updateTypography);

router.delete("/:id", protect, requireAdmin, deleteTypography);

module.exports = router;
