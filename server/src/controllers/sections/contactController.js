
const mongoose = require("mongoose");
const Website = require("../../models/Website");

const {
  contactSectionSchema,
} = require("../../models/sections/ContactSection");

const validateContactSection = async (data) => {
  const contact = new mongoose.Document(
    data,
    contactSectionSchema
  );

  await contact.validate();

  return contact.toObject();
};

// POST /:websiteId/sections/contact
const createContactSection = async (req, res, next) => {
  try {
    const website = req.website;

    const existingContact = website.sections.find(
      (section) => section.sectionName === "contact"
    );

    if (existingContact) {
      return res.status(409).json({
        success: false,
        message: "Contact section already exists.",
      });
    }

    const contactData = await validateContactSection({
      sectionName: "contact",
      variant: req.body.variant ?? "default",
      enabled: true,
      order: website.sections.length,
      content: {},
      visibility: {},
    });

    website.sections.push({
      sectionName: contactData.sectionName,
      variant: contactData.variant,
      enabled: contactData.enabled,
      order: contactData.order,
      content: contactData.content,
      visibility: contactData.visibility,
    });

    await website.save();

    const createdContact =
      website.sections[website.sections.length - 1];

    return res.status(201).json({
      success: true,
      message: "Contact section added successfully.",
      data: createdContact,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

// PATCH /:websiteId/sections/contact
const updateContactSection = async (req, res, next) => {
  try {
    const website = req.website;

    const index = website.sections.findIndex(
      (section) => section.sectionName === "contact"
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact section not found.",
      });
    }

    const existingContact = website.sections[index].toObject
      ? website.sections[index].toObject()
      : website.sections[index];

    const allowedFields = [
      "variant",
      "enabled",
      "order",
      "content",
      "visibility",
    ];

    for (const field of Object.keys(req.body)) {
      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: `Field '${field}' cannot be updated.`,
        });
      }
    }

    const mergedContact = {
      ...existingContact,
      ...req.body,
      sectionName: "contact",
      content: {
        ...existingContact.content,
        ...(req.body.content || {}),
      },
      visibility: {
        ...existingContact.visibility,
        ...(req.body.visibility || {}),
      },
    };

    const validatedContact =
      await validateContactSection(mergedContact);

    if (website.sections.set) {
      website.sections.set(index, validatedContact);
    } else {
      website.sections.splice(index, 1, validatedContact);
    }

    website.markModified("sections");

    await website.save();

    return res.status(200).json({
      success: true,
      message: "Contact section updated successfully.",
      data: website.sections[index],
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

// DELETE /:websiteId/sections/contact
const deleteContactSection = async (req, res, next) => {
  try {
    const website = req.website;

    const index = website.sections.findIndex(
      (section) => section.sectionName === "contact"
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact section not found.",
      });
    }

    website.sections.splice(index, 1);

    website.sections.forEach((section, order) => {
      section.order = order;
    });

    website.markModified("sections");

    await website.save();

    return res.status(200).json({
      success: true,
      message: "Contact section deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContactSection,
  updateContactSection,
  deleteContactSection,
};
