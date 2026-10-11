
const mongoose = require("mongoose");

const heroActionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "Get Started",
      trim: true,
      maxlength: 50,
    },
    href: {
      type: String,
      default: "#",
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

const heroMediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    src: {
      type: String,
      default: "/images/hero.png",
      trim: true,
      maxlength: 1000,
    },
    alt: {
      type: String,
      default: "Website hero illustration",
      trim: true,
      maxlength: 250,
    },
    poster: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const heroTrustIndicatorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image", "icon"],
      default: "text",
    },
    content: {
      type: String,
      default: "Trusted by 10,000+ users",
      trim: true,
      maxlength: 250,
    },
    src: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    alt: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },
    icon: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false }
);

const heroFeatureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Easy to Use",
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "Build beautiful websites without writing code.",
      trim: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      default: "sparkles",
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false }
);

const heroContentSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "INTRODUCING OUR PLATFORM",
      trim: true,
      maxlength: 100,
    },
    headline: {
      type: String,
      default: "Build Your Next Big Idea",
      trim: true,
      maxlength: 200,
    },
    subheadline: {
      type: String,
      default: "Create stunning websites with the power of AI.",
      trim: true,
      maxlength: 250,
    },
    description: {
      type: String,
      default: "Turn your ideas into beautiful websites without writing code.",
      trim: true,
      maxlength: 1000,
    },
    actions: {
      type: [heroActionSchema],
      default: () => [
        {
          text: "Get Started",
          href: "#",
          type: "primary",
        },
        {
          text: "Explore Features",
          href: "#features",
          type: "secondary",
        },
      ],
      validate: {
        validator: (value) => value.length <= 4,
        message: "A hero section can have at most 4 actions.",
      },
    },
    media: {
      type: heroMediaSchema,
      default: () => ({}),
    },
    trustIndicators: {
      type: [heroTrustIndicatorSchema],
      default: () => [
        {
          type: "text",
          content: "Trusted by 10,000+ users",
        },
      ],
      validate: {
        validator: (value) => value.length <= 8,
        message: "A hero section can have at most 8 trust indicators.",
      },
    },
    features: {
      type: [heroFeatureSchema],
      default: () => [
        {
          title: "Easy to Use",
          description: "Build beautiful websites without writing code.",
          icon: "sparkles",
        },
      ],
      validate: {
        validator: (value) => value.length <= 8,
        message: "A hero section can have at most 8 features.",
      },
    },
    additionalContent: {
      type: String,
      default: "Start building your website today.",
      trim: true,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const heroVisibilitySchema = new mongoose.Schema(
  {
    eyebrow: { type: Boolean, default: true },
    headline: { type: Boolean, default: true },
    subheadline: { type: Boolean, default: true },
    description: { type: Boolean, default: true },
    actions: { type: Boolean, default: true },
    media: { type: Boolean, default: true },
    trustIndicators: { type: Boolean, default: false },
    features: { type: Boolean, default: false },
    additionalContent: { type: Boolean, default: false },
  },
  { _id: false }
);

const heroSectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      enum: ["hero"],
      default: "hero",
      required: true,
    },
    variant: {
      type: String,
      default: "split",
      trim: true,
      maxlength: 50,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    content: {
      type: heroContentSchema,
      default: () => ({}),
    },
    visibility: {
      type: heroVisibilitySchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

module.exports = {
  heroSectionSchema,
  heroContentSchema,
  heroVisibilitySchema,
};
