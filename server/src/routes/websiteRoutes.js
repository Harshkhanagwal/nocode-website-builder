const express = require("express");

const {
  createWebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
} = require("../controllers/websiteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createWebsite);

router.get("/", getWebsites);

router.get("/:id", getWebsite);

router.put("/:id", updateWebsite);

router.delete("/:id", deleteWebsite);

module.exports = router;