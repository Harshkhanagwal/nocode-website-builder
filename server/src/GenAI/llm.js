const { generateWebsite, WebsiteGenerationError } = require("./generateWebsite");

const llm = async (req, res) => {
  const { prompt, websiteName } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ success: false, message: "prompt is required" });
  }
  try {
    const website = await generateWebsite({ prompt, websiteName, ownerId: req.user._id });
    return res.status(201).json({ success: true, website });
  } catch (error) {
    if (error instanceof WebsiteGenerationError) {
      const status = error.websiteId ? 502 : 422;
      return res.status(status).json({
        success: false,
        message: error.message,
        ...(error.websiteId && { websiteId: error.websiteId }),
        ...(error.sectionName && { failedSection: error.sectionName }),
      });
    }
    console.error("Website generation failed");
    return res.status(500).json({ success: false, message: "Failed to generate website" });
  }
};

module.exports = { llm };
