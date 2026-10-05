const Typography = require("../models/Typography");

// Get all typography presets
const getTypographies = async (req, res) => {
  try {
    const typographies = await Typography.find({
      isActive: true,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: typographies.length,
      typographies,
    });
  } catch (error) {
    console.error("Get typographies error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch typographies",
    });
  }
};

// Get single typography preset
const getTypography = async (req, res) => {
  try {
    const { id } = req.params;

    const typography = await Typography.findById(id);

    if (!typography) {
      return res.status(404).json({
        success: false,
        message: "Typography not found",
      });
    }

    return res.status(200).json({
      success: true,
      typography,
    });
  } catch (error) {
    console.error("Get typography error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch typography",
    });
  }
};

// Create typography preset
const createTypography = async (req, res) => {
  try {
    const {
      name,
      headingFont,
      bodyFont,
      typography,
      source,
    } = req.body;

    if (!name || !headingFont || !bodyFont) {
      return res.status(400).json({
        success: false,
        message: "Name, heading font and body font are required",
      });
    }

    const existingTypography = await Typography.findOne({
      name,
    });

    if (existingTypography) {
      return res.status(409).json({
        success: false,
        message: "Typography already exists",
      });
    }

    const newTypography = await Typography.create({
      name,
      headingFont,
      bodyFont,
      typography,
      source,
    });

    return res.status(201).json({
      success: true,
      message: "Typography created successfully",
      typography: newTypography,
    });
  } catch (error) {
    console.error("Create typography error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create typography",
    });
  }
};

// Update typography preset
const updateTypography = async (req, res) => {
  try {
    const { id } = req.params;

    const typography = await Typography.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!typography) {
      return res.status(404).json({
        success: false,
        message: "Typography not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Typography updated successfully",
      typography,
    });
  } catch (error) {
    console.error("Update typography error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update typography",
    });
  }
};

// Delete typography preset
const deleteTypography = async (req, res) => {
  try {
    const { id } = req.params;

    const typography = await Typography.findByIdAndDelete(id);

    if (!typography) {
      return res.status(404).json({
        success: false,
        message: "Typography not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Typography deleted successfully",
    });
  } catch (error) {
    console.error("Delete typography error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete typography",
    });
  }
};

module.exports = {
  getTypographies,
  getTypography,
  createTypography,
  updateTypography,
  deleteTypography,
};