const mongoose = require("mongoose");
const Website = require("../../models/Website");


const {
  heroSectionSchema,
} = require("../../models/sections/HeroSection");

const validateHeroSection = async (data) => {
  const hero = new mongoose.Document(data, heroSectionSchema);

  await hero.validate();

  return hero.toObject();
};



const createHeroSection = async (req, res, next) => {
  try {
    const website = req.website;


    // Generate all defaults from the Hero schema.
    const heroData = await validateHeroSection({
      sectionName: "hero",
      variant: req.body.variant ?? "split",
      enabled: true,
      order: website.sections.length,
      content: {},
      visibility: req.body.visibility ?? {},
    });

    console.log("Hero data:", heroData);

    // Add the complete default Hero section to Website.sections.
    website.sections.push({
      sectionName: heroData.sectionName,
      variant: heroData.variant,
      enabled: heroData.enabled,
      order: heroData.order,
      content: heroData.content,
      visibility: heroData.visibility,
    });

    await website.save();

    const createdHero = website.sections[website.sections.length - 1];

    return res.status(201).json({
      success: true,
      message: "Hero section added successfully.",
      section: createdHero,
      data: createdHero,
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

// PATCH /:websiteId/sections/hero
const updateHeroSection = async (req, res, next) => {
  try {
    const website = req.website;

    const index = website.sections.findIndex(
      (section) => section.sectionName === "hero" && String(section._id) === String(req.query.sectionId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }

    const existingHero = website.sections[index].toObject
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

    const mergedHero = {
      ...existingHero,
      ...req.body,
      sectionName: "hero",
      content: {
        ...existingHero.content,
        ...(req.body.content || {}),
      },
      visibility: {
        ...existingHero.visibility,
        ...(req.body.visibility || {}),
      },
    };

    const validatedHero = await validateHeroSection(mergedHero);

    validatedHero._id = existingHero._id;
    website.sections.set
      ? website.sections.set(index, validatedHero)
      : website.sections.splice(index, 1, validatedHero);

    website.markModified("sections");
    await website.save();

    return res.status(200).json({
      success: true,
      message: "Hero section updated successfully.",
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

// DELETE /:websiteId/sections/hero
const deleteHeroSection = async (req, res, next) => {
  try {
    const website = req.website;

    const index = website.sections.findIndex(
      (section) => section.sectionName === "hero" && String(section._id) === String(req.query.sectionId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }

    website.sections.splice(index, 1);

    website.markModified("sections");
    await website.save();

    return res.status(200).json({
      success: true,
      message: "Hero section deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // getHeroSection,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
};
