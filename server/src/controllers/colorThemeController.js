const ColorTheme = require("../models/ColorTheme");

// Get all color themes
const getColorThemes = async (req, res) => {
  try {
    const themes = await ColorTheme.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: themes.length,
      themes,
    });
  } catch (error) {
    console.error("Get color themes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch color themes",
    });
  }
};

// Get single color theme
const getColorTheme = async (req, res) => {
  try {
    const { id } = req.params;

    const theme = await ColorTheme.findById(id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Color theme not found",
      });
    }

    return res.status(200).json({
      success: true,
      theme,
    });
  } catch (error) {
    console.error("Get color theme error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch color theme",
    });
  }
};

// Create color theme
const createColorTheme = async (req, res) => {
  try {
    const { name, colorPalette } = req.body;

    if (!name || !colorPalette) {
      return res.status(400).json({
        success: false,
        message: "Name and color palette are required",
      });
    }

    const existingTheme = await ColorTheme.findOne({ name });

    if (existingTheme) {
      return res.status(409).json({
        success: false,
        message: "Color theme already exists",
      });
    }

    const theme = await ColorTheme.create({
      name,
      colorPalette,
    });

    return res.status(201).json({
      success: true,
      message: "Color theme created successfully",
      theme,
    });
  } catch (error) {
    console.error("Create color theme error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create color theme",
    });
  }
};

// Delete color theme
const deleteColorTheme = async (req, res) => {
  try {
    const { id } = req.params;

    const theme = await ColorTheme.findByIdAndDelete(id);

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Color theme not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Color theme deleted successfully",
    });
  } catch (error) {
    console.error("Delete color theme error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete color theme",
    });
  }
};

module.exports = {
  getColorThemes,
  getColorTheme,
  createColorTheme,
  deleteColorTheme,
};