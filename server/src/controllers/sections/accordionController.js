
const mongoose = require("mongoose");

const {
  accordionSectionSchema,
} = require("../../models/sections/AccordionSection");

const validateAccordionSection = async (data) => {
  const accordion = new mongoose.Document(data, accordionSectionSchema);

  await accordion.validate();

  return accordion.toObject();
};

const createAccordionSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }


    const sectionData = await validateAccordionSection({
      sectionName: "accordion",
      variant: req.body.variant ?? "borderless-minimal",
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
      message: "Accordion section created successfully.",
      section: website.sections[website.sections.length - 1],
    });
  } catch (error) {
    console.error("Create Accordion Section Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create Accordion section.",
      error: error.message,
    });
  }
};

const updateAccordionSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === "accordion" && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Accordion section not found.",
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

    const validatedSection = await validateAccordionSection(updatedSection);

    validatedSection._id = existingSection._id;
    website.sections.set(sectionIndex, validatedSection);
    website.markModified("sections");

    await website.save();

    return res.status(200).json({
      success: true,
      message: "Accordion section updated successfully.",
      section: website.sections[sectionIndex],
    });
  } catch (error) {
    console.error("Update Accordion Section Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update Accordion section.",
      error: error.message,
    });
  }
};

const deleteAccordionSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === "accordion" && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Accordion section not found.",
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
      message: "Accordion section deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Accordion Section Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete Accordion section.",
      error: error.message,
    });
  }
};

module.exports = {
  createAccordionSection,
  updateAccordionSection,
  deleteAccordionSection,
};
