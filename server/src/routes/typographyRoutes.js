const express = require("express");

const {
  getTypographies,
  getTypography,
  createTypography,
  updateTypography,
  deleteTypography,
} = require("../controllers/typographyController");

const router = express.Router();

router.get("/", getTypographies);

router.get("/:id", getTypography);

router.post("/", createTypography);

router.put("/:id", updateTypography);

router.delete("/:id", deleteTypography);

module.exports = router;