const Typography = require("../../models/Typography");

async function getAvailableTypographies() {
  return Typography.find({ isActive: true }).sort({ name: 1 }).lean();
}

module.exports = { getAvailableTypographies };
