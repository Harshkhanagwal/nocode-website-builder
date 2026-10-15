
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const verifyWebsiteOwnership = require("../../middleware/websiteOwnershipMiddleware");

const {
  createColumnsSection,
  updateColumnsSection,
  deleteColumnsSection,
} = require("../../controllers/sections/columnsController");

router
  .route("/:websiteId/sections/columns")
  .post(
    authMiddleware,
    verifyWebsiteOwnership,
    createColumnsSection
  )
  .patch(
    authMiddleware,
    verifyWebsiteOwnership,
    updateColumnsSection
  )
  .delete(
    authMiddleware,
    verifyWebsiteOwnership,
    deleteColumnsSection
  );

module.exports = router;
