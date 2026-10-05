
const Hero = require("../models/Hero");
const mongoose = require("mongoose");

// Create hero section
const createHero = async (req, res) => {
  try {
    const hero = await Hero.create(req.body);

    res.status(201).json({
      success: true,
      message: "Hero section created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all hero sections
const getHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find();

    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get hero section by ID
const getHeroById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hero ID",
      });
    }

    const hero = await Hero.findById(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update hero section
const updateHero = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hero ID",
      });
    }

    const hero = await Hero.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully",
      data: hero,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete hero section
const deleteHero = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hero ID",
      });
    }

    const hero = await Hero.findByIdAndDelete(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHero,
  getHeroes,
  getHeroById,
  updateHero,
  deleteHero,
};
