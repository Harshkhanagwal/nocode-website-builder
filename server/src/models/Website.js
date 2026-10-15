
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true,
    },

    variant: {
      type: String,
      default: "default",
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    visibility: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  // Keep MongoDB's generated _id on every section instance. The editor uses
  // this id for selection and targeted updates.
  { _id: true }
);

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

    sections: {
      type: [sectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Website", websiteSchema);
