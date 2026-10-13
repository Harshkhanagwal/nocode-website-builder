
const mongoose = require("mongoose");

const contactFieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    label: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "email", "tel", "textarea", "select"],
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
      trim: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const contactSectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      default: "contact",
      enum: ["contact"],
    },
    variant: {
      type: String,
      default: "default",
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
      eyebrow: {
        type: String,
        default: "Contact Us",
        trim: true,
      },
      headline: {
        type: String,
        default: "Let's Talk",
        trim: true,
      },
      href: {
        type: String,
        default: "#contact",
        trim: true,
      },
      subheadline: {
        type: String,
        default: "We would love to hear from you.",
        trim: true,
      },
      description: {
        type: String,
        default: "Get in touch with our team.",
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
      },
      phone: {
        type: String,
        default: "",
        trim: true,
      },
      address: {
        type: String,
        default: "",
        trim: true,
      },
      formFields: {
        type: [contactFieldSchema],
        default: () => [
          {
            name: "name",
            label: "Full Name",
            type: "text",
            placeholder: "Enter your name",
            required: true,
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            placeholder: "Enter your email",
            required: true,
          },
          {
            name: "message",
            label: "Message",
            type: "textarea",
            placeholder: "Write your message",
            required: true,
          },
        ],
      },
      submitButtonText: {
        type: String,
        default: "Send Message",
        trim: true,
      },
      successMessage: {
        type: String,
        default: "Your message has been sent successfully.",
        trim: true,
      },
      additionalContent: {
        type: String,
        default: "",
        trim: true,
      },
    },
    visibility: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        eyebrow: true,
        headline: true,
        href: true,
        subheadline: true,
        description: true,
        email: true,
        phone: true,
        address: true,
        formFields: true,
        submitButtonText: true,
        additionalContent: false,
      }),
    },
  },
  { _id: false }
);

module.exports = {
  contactSectionSchema,
};
