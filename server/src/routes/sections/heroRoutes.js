const express = require("express");
const router = express.Router();

const protect = require("../../middleware/authMiddleware");
const verifyWebsiteOwnership = require("../../middleware/websiteOwnershipMiddleware");

const {
  getHeroSection,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
} = require("../../controllers/sections/heroController");

router
  .route("/:websiteId/sections/hero")
  // .get(
  //   protect,
  //   verifyWebsiteOwnership,
  //   getHeroSection
  // )
  .post(
    (req, res, next) => {
      console.log("HERO ROUTE MATCHED");
      console.log("URL:", req.originalUrl);
      console.log("PARAMS:", req.params);
      next();
    },
    protect,
    verifyWebsiteOwnership,
    createHeroSection
  )
  .patch(
    protect,
    verifyWebsiteOwnership,
    updateHeroSection
  )

  .delete(
    protect,
    verifyWebsiteOwnership,
    deleteHeroSection
  );


module.exports = router;
