const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ColorTheme",
      required: true,
    },

    typography: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Typography",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Website", websiteSchema);