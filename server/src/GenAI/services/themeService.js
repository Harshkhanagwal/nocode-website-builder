const ColorTheme = require("../../models/ColorTheme");

async function getAvailableThemes() {
  return ColorTheme.find({}).sort({ name: 1 }).lean();
}

module.exports = { getAvailableThemes };
