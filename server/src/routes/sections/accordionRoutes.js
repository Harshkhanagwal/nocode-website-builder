
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const websiteOwnershipMiddleware = require("../../middleware/websiteOwnershipMiddleware");

const {
  createAccordionSection,
  updateAccordionSection,
  deleteAccordionSection,
} = require("../../controllers/sections/accordionController");

router.use(authMiddleware);
router.use(websiteOwnershipMiddleware);

router
  .route("/:websiteId/sections/accordion")
  .post(createAccordionSection)
  .patch(updateAccordionSection)
  .delete(deleteAccordionSection);

module.exports = router;
