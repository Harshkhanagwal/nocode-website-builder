const mongoose = require("mongoose");

const colorThemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 50,
    },

    colorPalette: {
      primary: {
        type: String,
        required: true,
      },

      primaryHover: {
        type: String,
        required: true,
      },

      secondary: {
        type: String,
        required: true,
      },

      text: {
        type: String,
        required: true,
      },

      textMuted: {
        type: String,
        required: true,
      },

      textLight: {
        type: String,
        required: true,
      },

      background: {
        type: String,
        required: true,
      },

      surface: {
        type: String,
        required: true,
      },

      border: {
        type: String,
        required: true,
      },

      borderDark: {
        type: String,
        required: true,
      },

      success: {
        type: String,
        required: true,
      },

      warning: {
        type: String,
        required: true,
      },

      danger: {
        type: String,
        required: true,
      },

      info: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ColorTheme", colorThemeSchema);