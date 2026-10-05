const mongoose = require("mongoose");

const typographySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 50,
    },

    headingFont: {
      family: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        enum: [
          "sans-serif",
          "serif",
          "monospace",
          "display",
          "handwriting",
        ],
        required: true,
      },

      weights: {
        type: [Number],
        default: [400, 500, 600, 700],
      },
    },

    bodyFont: {
      family: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        enum: [
          "sans-serif",
          "serif",
          "monospace",
          "display",
          "handwriting",
        ],
        required: true,
      },

      weights: {
        type: [Number],
        default: [400, 500, 600, 700],
      },
    },

    typography: {
      baseSize: {
        type: Number,
        default: 16,
      },

      h1: {
        size: { type: Number, default: 48 },
        weight: { type: Number, default: 700 },
        lineHeight: { type: Number, default: 1.2 },
      },

      h2: {
        size: { type: Number, default: 40 },
        weight: { type: Number, default: 700 },
        lineHeight: { type: Number, default: 1.2 },
      },

      h3: {
        size: { type: Number, default: 32 },
        weight: { type: Number, default: 600 },
        lineHeight: { type: Number, default: 1.25 },
      },

      h4: {
        size: { type: Number, default: 26 },
        weight: { type: Number, default: 600 },
        lineHeight: { type: Number, default: 1.3 },
      },

      h5: {
        size: { type: Number, default: 22 },
        weight: { type: Number, default: 600 },
        lineHeight: { type: Number, default: 1.35 },
      },

      h6: {
        size: { type: Number, default: 18 },
        weight: { type: Number, default: 600 },
        lineHeight: { type: Number, default: 1.4 },
      },

      body: {
        size: { type: Number, default: 16 },
        weight: { type: Number, default: 400 },
        lineHeight: { type: Number, default: 1.5 },
      },

      small: {
        size: { type: Number, default: 14 },
        weight: { type: Number, default: 400 },
        lineHeight: { type: Number, default: 1.4 },
      },
    },

    source: {
      type: String,
      enum: ["google", "system", "custom"],
      default: "google",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Typography", typographySchema);