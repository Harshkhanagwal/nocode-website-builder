const mongoose = require("mongoose");

const headerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    href: { type: String, trim: true, default: "#" },
  },
  { _id: false }
);

const headerActionSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, default: "Get Started" },
    href: { type: String, trim: true, default: "#" },
    type: { type: String, enum: ["primary", "secondary"], default: "primary" },
  },
  { _id: false }
);

const headerContentSchema = new mongoose.Schema(
  {
    logo: {
      type: new mongoose.Schema(
        {
          type: { type: String, enum: ["text", "image"], default: "text" },
          text: { type: String, trim: true, default: "Website" },
          image: { type: String, trim: true, default: "" },
          href: { type: String, trim: true, default: "/" },
          visibility: { type: Boolean, default: true },
        },
        { _id: false }
      ),
      default: () => ({}),
    },
    navigation: {
      type: [headerLinkSchema],
      default: () => [],
      validate: {
        validator: (links) => links.length <= 8,
        message: "Header navigation supports up to 8 links.",
      },
    },
    actions: {
      type: [headerActionSchema],
      default: () => [],
      validate: {
        validator: (actions) => actions.length <= 2,
        message: "Header supports up to 2 action buttons.",
      },
    },
    settings: {
      type: new mongoose.Schema(
        {
          sticky: { type: Boolean, default: false },
          showNavigation: { type: Boolean, default: true },
          showActions: { type: Boolean, default: true },
          mobileMenu: { type: Boolean, default: true },
        },
        { _id: false }
      ),
      default: () => ({}),
    },
  },
  { _id: false }
);

const headerSectionSchema = new mongoose.Schema(
  {
    sectionName: { type: String, enum: ["header"], default: "header", required: true },
    variant: {
      type: String,
      enum: ["minimal-centered", "minimal-right", "centered-brand", "floating-solid", "floating-glass"],
      default: "minimal-centered",
    },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    content: { type: headerContentSchema, default: () => ({}) },
    visibility: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  },
  { _id: false }
);

module.exports = { headerSectionSchema };
