
const mongoose = require("mongoose");

const contactDetailSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["email", "phone", "address"],
      default: "email",
    },
    label: { type: String, default: "", trim: true },
    value: { type: String, default: "", trim: true },
    href: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const contactFieldSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    label: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ["text", "email", "tel", "textarea", "select", "url"],
      default: "text",
    },
    placeholder: { type: String, default: "", trim: true },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, default: "", trim: true },
    url: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const contactMapSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["embed", "link"],
      default: "embed",
    },
    src: { type: String, default: "", trim: true },
    alt: { type: String, default: "Our office location", trim: true },
  },
  { _id: false }
);

const contactFormSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Send Us a Message", trim: true },
    submitText: { type: String, default: "Send Message", trim: true },
    successMessage: {
      type: String,
      default: "Your message has been sent successfully.",
      trim: true,
    },
    fields: {
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
          name: "subject",
          label: "Subject",
          type: "text",
          placeholder: "Enter subject",
          required: false,
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
  },
  { _id: false }
);

const contactContentSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "Get in Touch", trim: true },
    headline: { type: String, default: "Contact Us", trim: true },
    subheadline: {
      type: String,
      default:
        "Have a question or project in mind? We'd love to hear from you.",
      trim: true,
    },
    href: { type: String, default: "#contact", trim: true },

    contactDetails: {
      type: [contactDetailSchema],
      default: () => [
        {
          type: "email",
          label: "Email",
          value: "hello@example.com",
          href: "mailto:hello@example.com",
        },
        {
          type: "phone",
          label: "Phone",
          value: "+1 234 567 890",
          href: "tel:+1234567890",
        },
        {
          type: "address",
          label: "Address",
          value: "123 Main Street, New York, NY",
        },
      ],
    },

    form: {
      type: contactFormSchema,
      default: () => ({}),
    },

    socialLinks: {
      type: [socialLinkSchema],
      default: () => [
        {
          platform: "instagram",
          url: "https://instagram.com/example",
        },
        {
          platform: "linkedin",
          url: "https://linkedin.com/company/example",
        },
      ],
    },

    map: {
      type: contactMapSchema,
      default: () => ({}),
    },

    additionalContent: {
      type: String,
      default: "We typically respond within 24 hours.",
      trim: true,
    },
  },
  { _id: false }
);

const contactSectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      enum: ["contact"],
      default: "contact",
      required: true,
    },
    variant: {
      type: String,
      default: "default",
      trim: true,
    },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    content: {
      type: contactContentSchema,
      default: () => ({}),
    },
    visibility: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  },
  { _id: false }
);

module.exports = { contactSectionSchema };
