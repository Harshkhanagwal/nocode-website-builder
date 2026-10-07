const express = require("express");

const {
  createWebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
  getAllWebsites,
  getWebsiteById
} = require("../controllers/websiteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/all", getAllWebsites);
router.get("/by-id/:id", getWebsiteById);

router.use(protect);
router.get("/:id", getWebsite);


router.post("/", createWebsite);

router.get("/", getWebsites);


router.put("/:id", updateWebsite);

router.delete("/:id", deleteWebsite);

module.exports = router;