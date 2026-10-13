
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const websiteOwnershipMiddleware = require("../../middleware/websiteOwnershipMiddleware");

const {
  createContactSection,
  updateContactSection,
  deleteContactSection,
} = require("../../controllers/sections/contactController");

router.use(authMiddleware);
router.use(websiteOwnershipMiddleware);

router
  .route("/:websiteId/sections/contact")
  .post(createContactSection)
  .patch(updateContactSection)
  .delete(deleteContactSection);

module.exports = router;
