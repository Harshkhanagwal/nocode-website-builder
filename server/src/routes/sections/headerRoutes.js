const express = require("express");
const router = express.Router();
const protect = require("../../middleware/authMiddleware");
const verifyWebsiteOwnership = require("../../middleware/websiteOwnershipMiddleware");
const {
  updateHeaderSection,
  rejectHeaderDeletion,
  rejectManualHeaderCreation,
} = require("../../controllers/sections/headerController");

router
  .route("/:websiteId/sections/header")
  .post(protect, verifyWebsiteOwnership, rejectManualHeaderCreation)
  .patch(protect, verifyWebsiteOwnership, updateHeaderSection)
  .delete(protect, verifyWebsiteOwnership, rejectHeaderDeletion);

module.exports = router;
