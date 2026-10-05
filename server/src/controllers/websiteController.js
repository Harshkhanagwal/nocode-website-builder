const Website = require("../models/Website");

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Create website
const createWebsite = async (req, res) => {
  try {
    const { name, theme, typography } = req.body;

    if (!name || !theme || !typography) {
      return res.status(400).json({
        success: false,
        message: "Name, theme and typography are required",
      });
    }

    const baseSlug = createSlug(name);

    let slug = baseSlug;
    let count = 1;

    while (await Website.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const website = await Website.create({
      name,
      slug,
      owner: req.user._id,
      theme,
      typography,
    });

    return res.status(201).json({
      success: true,
      message: "Website created successfully",
      website,
    });
  } catch (error) {
    console.error("Create website error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create website",
    });
  }
};

// Get all websites of logged-in user
const getWebsites = async (req, res) => {
  try {
    const websites = await Website.find({
      owner: req.user._id,
    })
      .populate("theme")
      .populate("typography")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: websites.length,
      websites,
    });
  } catch (error) {
    console.error("Get websites error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch websites",
    });
  }
};

// Get single website
const getWebsite = async (req, res) => {
  try {
    const { id } = req.params;

    const website = await Website.findOne({
      _id: id,
      owner: req.user._id,
    })
      .populate("theme")
      .populate("typography");

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    return res.status(200).json({
      success: true,
      website,
    });
  } catch (error) {
    console.error("Get website error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch website",
    });
  }
};

// Update website
const updateWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, theme, typography } = req.body;

    const website = await Website.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    if (name !== undefined) {
      website.name = name;
    }

    if (theme !== undefined) {
      website.theme = theme;
    }

    if (typography !== undefined) {
      website.typography = typography;
    }

    await website.save();

    return res.status(200).json({
      success: true,
      message: "Website updated successfully",
      website,
    });
  } catch (error) {
    console.error("Update website error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update website",
    });
  }
};

// Delete website
const deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;

    const website = await Website.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Website deleted successfully",
    });
  } catch (error) {
    console.error("Delete website error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete website",
    });
  }
};

module.exports = {
  createWebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
};