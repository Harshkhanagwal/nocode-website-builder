
const mongoose = require("mongoose");
const { columnsSectionSchema } = require("../../models/sections/ColumnsSection");

const SECTION_NAME = "columns";

const validateColumnsSection = async (data) => {
  const section = new mongoose.Document(data, columnsSectionSchema);
  await section.validate();
  return section.toObject();
};

// Create Columns section
const createColumnsSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }


    const sectionData = await validateColumnsSection({
      sectionName: SECTION_NAME,
      variant: req.body.variant || "classic",
      enabled: req.body.enabled ?? true,
      order: req.body.order ?? website.sections.length,
      content: req.body.content || {},
      visibility: req.body.visibility || {},
    });

    website.sections.push(sectionData);
    website.markModified("sections");
    await website.save();

    return res.status(201).json({
      success: true,
      message: "Columns section created successfully.",
      section: website.sections[website.sections.length - 1],
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Columns section data.",
        errors: error.errors,
      });
    }

    console.error("Create Columns section error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Columns section.",
    });
  }
};

// Update Columns section
const updateColumnsSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === SECTION_NAME && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Columns section not found.",
      });
    }

    const existingSection = website.sections[sectionIndex].toObject
      ? website.sections[sectionIndex].toObject()
      : website.sections[sectionIndex];

    const updatedData = {
      ...existingSection,
      ...(req.body.variant !== undefined && {
        variant: req.body.variant,
      }),
      ...(req.body.enabled !== undefined && {
        enabled: req.body.enabled,
      }),
      ...(req.body.order !== undefined && {
        order: req.body.order,
      }),
      content: {
        ...existingSection.content,
        ...(req.body.content || {}),
      },
      visibility: {
        ...(existingSection.visibility || {}),
        ...(req.body.visibility || {}),
      },
    };

    const validatedSection = await validateColumnsSection(updatedData);

    validatedSection._id = existingSection._id;
    website.sections[sectionIndex] = validatedSection;
    website.markModified("sections");
    await website.save();

    return res.status(200).json({
      success: true,
      message: "Columns section updated successfully.",
      section: website.sections.find(
        (section) => section.sectionName === SECTION_NAME && String(section._id) === String(req.query.sectionId)
      ),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Columns section data.",
        errors: error.errors,
      });
    }

    console.error("Update Columns section error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Columns section.",
    });
  }
};

// Delete Columns section
const deleteColumnsSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === SECTION_NAME && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Columns section not found.",
      });
    }

    website.sections.splice(sectionIndex, 1);

    // Keep the remaining section order sequential.
    website.sections.sort((a, b) => a.order - b.order);
    website.sections.forEach((section, index) => {
      section.order = index;
    });

    website.markModified("sections");
    await website.save();

    return res.status(200).json({
      success: true,
      message: "Columns section deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Columns section error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete Columns section.",
    });
  }
};

module.exports = {
  createColumnsSection,
  updateColumnsSection,
  deleteColumnsSection,
};
