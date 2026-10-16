const mongoose = require("mongoose");
const { headerSectionSchema } = require("../../models/sections/HeaderSection");

const validateHeader = async (data) => {
  const header = new mongoose.Document(data, headerSectionSchema);
  await header.validate();
  return header.toObject();
};

const updateHeaderSection = async (req, res, next) => {
  try {
    const website = req.website;
    const index = website.sections.findIndex(
      (section) => section.sectionName === "header" && String(section._id) === String(req.query.sectionId)
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Header section not found." });
    }

    const allowedFields = ["variant", "enabled", "order", "content", "visibility"];
    for (const field of Object.keys(req.body)) {
      if (!allowedFields.includes(field)) {
        return res.status(400).json({ success: false, message: `Field '${field}' cannot be updated.` });
      }
    }

    const existing = website.sections[index].toObject();
    const incomingContent = req.body.content || {};
    const mergedContent = {
      ...existing.content,
      ...incomingContent,
      logo: { ...(existing.content?.logo || {}), ...(incomingContent.logo || {}) },
      settings: { ...(existing.content?.settings || {}), ...(incomingContent.settings || {}) },
      ...(incomingContent.navigation !== undefined && { navigation: incomingContent.navigation }),
      ...(incomingContent.actions !== undefined && { actions: incomingContent.actions }),
    };

    const validated = await validateHeader({
      ...existing,
      ...req.body,
      sectionName: "header",
      enabled: true,
      order: 0,
      content: mergedContent,
    });
    validated._id = existing._id;
    validated.visibility = req.body.visibility ?? existing.visibility ?? {};
    website.sections.set(index, validated);
    website.markModified("sections");
    await website.save();

    return res.status(200).json({
      success: true,
      message: "Header section updated successfully.",
      section: website.sections[index],
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const rejectHeaderDeletion = (req, res) =>
  res.status(400).json({
    success: false,
    message: "The website header is required and cannot be deleted.",
  });

const rejectManualHeaderCreation = (req, res) =>
  res.status(409).json({
    success: false,
    message: "The website header is created automatically.",
  });

module.exports = { updateHeaderSection, rejectHeaderDeletion, rejectManualHeaderCreation };
