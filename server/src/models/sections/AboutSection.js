
const mongoose = require("mongoose");

const imageAttributionSchema = new mongoose.Schema({
  photographer: { type: String, default: "" },
  photographerUrl: { type: String, default: "" },
  sourceName: { type: String, default: "Unsplash" },
  sourceUrl: { type: String, default: "" },
}, { _id: false });

const aboutMediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    src: {
      type: String,
      default: "/images/about.png",
      trim: true,
    },
    alt: {
      type: String,
      default: "Our team working together",
      trim: true,
    },
    imageAttribution: { type: imageAttributionSchema, default: () => ({}) },
  },
  { _id: false }
);

const aboutHighlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const aboutActionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "Learn More",
      trim: true,
      maxlength: 50,
    },
    href: {
      type: String,
      default: "/about",
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["primary", "secondary"],
      default: "primary",
    },
  },
  { _id: false }
);

const aboutContentSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "About Us",
      trim: true,
    },
    headline: {
      type: String,
      default: "We Build Digital Experiences",
      trim: true,
    },
    subheadline: {
      type: String,
      default: "Helping businesses grow through innovative solutions.",
      trim: true,
    },
    description: {
      type: String,
      default:
        "We are a team dedicated to creating meaningful digital experiences through technology, creativity, and collaboration.",
      trim: true,
    },

    // Section-level link, separate from actions[].href
    href: {
      type: String,
      default: "/about",
      trim: true,
      maxlength: 500,
    },

    media: {
      type: aboutMediaSchema,
      default: () => ({}),
    },

    highlights: {
      type: [aboutHighlightSchema],
      default: () => [
        {
          title: "Our Mission",
          description:
            "To empower businesses with accessible digital solutions.",
        },
        {
          title: "Our Vision",
          description:
            "To make technology simple and impactful for everyone.",
        },
      ],
    },

    actions: {
      type: [aboutActionSchema],
      default: () => [
        {
          text: "Learn More",
          href: "/about",
          type: "primary",
        },
      ],
    },

    additionalContent: {
      type: String,
      default: "Building better digital experiences since 2020.",
      trim: true,
    },
  },
  { _id: false }
);

const aboutSectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      enum: ["about"],
      default: "about",
      required: true,
    },
    variant: {
      type: String,
      default: "editorial",
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    content: {
      type: aboutContentSchema,
      default: () => ({}),
    },
    visibility: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  },
  { _id: false }
);

module.exports = { aboutSectionSchema };
