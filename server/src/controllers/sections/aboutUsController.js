
const mongoose = require("mongoose");
const {
  aboutSectionSchema,
} = require("../../models/sections/AboutSection");

const validateAboutSection = async (data) => {
  const about = new mongoose.Document(data, aboutSectionSchema);

  await about.validate();

  return about.toObject();
};

const createAboutSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }


    const sectionData = await validateAboutSection({
      sectionName: "about",
      variant: req.body.variant ?? "editorial",
      enabled: req.body.enabled ?? true,
      order: req.body.order ?? website.sections.length,
      content: req.body.content ?? {},
      visibility: req.body.visibility ?? {},
    });

    website.sections.push(sectionData);
    website.markModified("sections");

    await website.save();

    return res.status(201).json({
      success: true,
      message: "About section created successfully.",
      section: website.sections[website.sections.length - 1],
    });
  } catch (error) {
    console.error("Create About Section Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create About section.",
      error: error.message,
    });
  }
};

const updateAboutSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === "about" && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "About section not found.",
      });
    }

    const existingSection = website.sections[sectionIndex].toObject
      ? website.sections[sectionIndex].toObject()
      : website.sections[sectionIndex];

    const allowedFields = ["variant", "enabled", "order"];

    const updatedSection = {
      ...existingSection,
      ...Object.fromEntries(
        allowedFields
          .filter((field) => req.body[field] !== undefined)
          .map((field) => [field, req.body[field]])
      ),
      content: {
        ...(existingSection.content || {}),
        ...(req.body.content || {}),
      },
      visibility: {
        ...(existingSection.visibility || {}),
        ...(req.body.visibility || {}),
      },
    };

    // Preserve other media properties during partial media updates.
    if (req.body.content?.media) {
      updatedSection.content.media = {
        ...(existingSection.content?.media || {}),
        ...req.body.content.media,
      };
    }

    const validatedSection = await validateAboutSection(updatedSection);

    validatedSection._id = existingSection._id;
    website.sections.set(sectionIndex, validatedSection);
    website.markModified("sections");

    await website.save();

    return res.status(200).json({
      success: true,
      message: "About section updated successfully.",
      section: website.sections[sectionIndex],
    });
  } catch (error) {
    console.error("Update About Section Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update About section.",
      error: error.message,
    });
  }
};

const deleteAboutSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === "about" && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "About section not found.",
      });
    }

    website.sections.splice(sectionIndex, 1);

    website.sections.forEach((section, index) => {
      section.order = index;
    });

    website.markModified("sections");

    await website.save();

    return res.status(200).json({
      success: true,
      message: "About section deleted successfully.",
    });
  } catch (error) {
    console.error("Delete About Section Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete About section.",
      error: error.message,
    });
  }
};

module.exports = {
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
};
    
