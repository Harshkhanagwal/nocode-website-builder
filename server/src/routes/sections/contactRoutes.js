
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const websiteOwnershipMiddleware = require("../../middleware/websiteOwnershipMiddleware");

const {
  createContactSection,
  updateContactSection,
  deleteContactSection,
} = require("../../controllers/sections/contactController");

router
  .route("/:websiteId/sections/contact")
  .post(authMiddleware, websiteOwnershipMiddleware, createContactSection)
  .patch(authMiddleware, websiteOwnershipMiddleware, updateContactSection)
  .delete(authMiddleware, websiteOwnershipMiddleware, deleteContactSection);

module.exports = router;
