
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const websiteOwnershipMiddleware = require("../../middleware/websiteOwnershipMiddleware");

const {
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
} = require("../../controllers/sections/aboutUsController");

router.use(authMiddleware);
router.use(websiteOwnershipMiddleware);

router
  .route("/:websiteId/sections/about")
  .post(createAboutSection)
  .patch(updateAboutSection)
  .delete(deleteAboutSection);

module.exports = router;
