
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const websiteOwnershipMiddleware = require("../../middleware/websiteOwnershipMiddleware");

const {
  createAccordionSection,
  updateAccordionSection,
  deleteAccordionSection,
} = require("../../controllers/sections/accordionController");

router
  .route("/:websiteId/sections/accordion")
  .post(authMiddleware, websiteOwnershipMiddleware, createAccordionSection)
  .patch(authMiddleware, websiteOwnershipMiddleware, updateAccordionSection)
  .delete(authMiddleware, websiteOwnershipMiddleware, deleteAccordionSection);

module.exports = router;
