const mongoose = require("mongoose");

const imageAttributionSchema = new mongoose.Schema({
  photographer: { type: String, default: "" },
  photographerUrl: { type: String, default: "" },
  sourceName: { type: String, default: "Unsplash" },
  sourceUrl: { type: String, default: "" },
}, { _id: false });

const columnItemSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "layers",
      trim: true,
      maxlength: 100,
    },
    title: {
      type: String,
      default: "Feature Title",
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      default: "Describe this feature.",
      trim: true,
      maxlength: 1000,
    },
    role: { type: String, default: "", trim: true, maxlength: 150 },
    image: { type: String, default: "", trim: true, maxlength: 1000 },
    imageAttribution: { type: imageAttributionSchema, default: () => ({}) },
  },
  { _id: false }
);

const columnsContentSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "Our Features",
      trim: true,
      maxlength: 150,
    },
    headline: {
      type: String,
      default: "Everything You Need",
      trim: true,
      maxlength: 250,
    },
    subheadline: {
      type: String,
      default: "Powerful tools to help you grow.",
      trim: true,
      maxlength: 500,
    },
    href: {
      type: String,
      default: "#features",
      trim: true,
      maxlength: 500,
    },
    items: {
      type: [columnItemSchema],
      default: [],
    },
  },
  { _id: false }
);

const columnsSectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      enum: ["columns"],
      default: "columns",
      required: true,
    },
    variant: {
      type: String,
      default: "classic",
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
      required: true,
    },
    content: {
      type: columnsContentSchema,
      default: () => ({}),
    },
    visibility: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  },
  { _id: false }
);

module.exports = { columnsSectionSchema };
