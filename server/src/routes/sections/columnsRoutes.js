
const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const websiteOwnershipMiddleware = require("../../middleware/websiteOwnershipMiddleware");

const {
  createColumnsSection,
  updateColumnsSection,
  deleteColumnsSection,
} = require("../../controllers/sections/columnsController");

const router = express.Router();

router.use(authMiddleware);
router.use(websiteOwnershipMiddleware);

router
  .route("/:websiteId/sections/columns")
  .post(createColumnsSection)
  .patch(updateColumnsSection)
  .delete(deleteColumnsSection);

module.exports = router;
