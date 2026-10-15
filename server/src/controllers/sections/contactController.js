
const mongoose = require("mongoose");
const Website = require("../../models/Website");
const {
  contactSectionSchema,
} = require("../../models/sections/ContactSection");

const validateContactSection = async (data) => {
  const contact = new mongoose.Document(data, contactSectionSchema);

  await contact.validate();

  return contact.toObject();
};

const createContactSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }


    const sectionData = await validateContactSection({
      sectionName: "contact",
      variant: req.body.variant ?? "default",
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
      message: "Contact section created successfully.",
      section: website.sections[website.sections.length - 1],
    });
  } catch (error) {
    console.error("Create Contact Section Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create Contact section.",
      error: error.message,
    });
  }
};

const updateContactSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === "contact" && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact section not found.",
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
        ...(existingSection.content?.toObject
          ? existingSection.content.toObject()
          : existingSection.content || {}),
        ...(req.body.content || {}),
      },
      visibility: {
        ...(existingSection.visibility || {}),
        ...(req.body.visibility || {}),
      },
    };

    // Preserve existing form properties when only part of the form is updated.
    if (req.body.content?.form) {
      updatedSection.content.form = {
        ...(existingSection.content?.form?.toObject
          ? existingSection.content.form.toObject()
          : existingSection.content?.form || {}),
        ...req.body.content.form,
      };
    }

    const validatedSection = await validateContactSection(updatedSection);

    validatedSection._id = existingSection._id;
    website.sections.set
      ? website.sections.set(sectionIndex, validatedSection)
      : (website.sections[sectionIndex] = validatedSection);

    website.markModified("sections");

    await website.save();

    return res.status(200).json({
      success: true,
      message: "Contact section updated successfully.",
      section: website.sections[sectionIndex],
    });
  } catch (error) {
    console.error("Update Contact Section Error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update Contact section.",
      error: error.message,
    });
  }
};

const deleteContactSection = async (req, res) => {
  try {
    const website = req.website;

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found.",
      });
    }

    const sectionIndex = website.sections.findIndex(
      (section) => section.sectionName === "contact" && String(section._id) === String(req.query.sectionId)
    );

    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact section not found.",
      });
    }

    website.sections.splice(sectionIndex, 1);

    // Keep the remaining section order consistent.
    website.sections.forEach((section, index) => {
      section.order = index;
    });

    website.markModified("sections");

    await website.save();

    return res.status(200).json({
      success: true,
      message: "Contact section deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Contact Section Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete Contact section.",
      error: error.message,
    });
  }
};

module.exports = {
  createContactSection,
  updateContactSection,
  deleteContactSection,
};
