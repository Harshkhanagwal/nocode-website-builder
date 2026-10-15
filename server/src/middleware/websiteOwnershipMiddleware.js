
const mongoose = require("mongoose");
const Website = require("../models/Website");

const verifyWebsiteOwnership = async (req, res, next) => {
  try {
    const websiteId =
      req.params.websiteId ||
      req.body?.websiteId ||
      req.query?.websiteId;
    console.log("Route params:", req.params);
    console.log("Extracted websiteId:", websiteId);
    console.log("Is valid ObjectId:", mongoose.isValidObjectId(websiteId));
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!mongoose.isValidObjectId(websiteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid website ID.",
      });
    }

    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    if (website.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to modify this website.",
      });
    }

    req.website = website;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyWebsiteOwnership;
