const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const verifyWebsiteOwnership = require("../../middleware/websiteOwnershipMiddleware");

const {
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
} = require("../../controllers/sections/aboutUsController");

router.post(
  "/:websiteId/sections/about",
  authMiddleware,
  verifyWebsiteOwnership,
  createAboutSection
);

router.patch(
  "/:websiteId/sections/about",
  authMiddleware,
  verifyWebsiteOwnership,
  updateAboutSection
);



router.delete(
  "/:websiteId/sections/about",
  authMiddleware,
  verifyWebsiteOwnership,
  deleteAboutSection
);

module.exports = router;