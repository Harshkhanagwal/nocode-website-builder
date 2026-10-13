
const mongoose = require("mongoose");

const accordionItemSchema = new mongoose.Schema(
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
        defaultOpen: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const accordionContentSchema = new mongoose.Schema(
    {
        eyebrow: {
            type: String,
            default: "FAQ",
            trim: true,
        },
        headline: {
            type: String,
            default: "Frequently Asked Questions",
            trim: true,
        },
        subheadline: {
            type: String,
            default: "Find answers to common questions.",
            trim: true,
        },
        href: {
            type: String,
            default: "#faq",
            trim: true,
            maxlength: 500,
        },
        items: {
            type: [accordionItemSchema],
            default: () => [
                {
                    title: "What is your platform?",
                    description:
                        "Our platform helps you build websites without writing code.",
                    defaultOpen: true,
                },
                {
                    title: "Do I need coding experience?",
                    description:
                        "No. You can create and customize websites using a visual editor.",
                    defaultOpen: false,
                },
                {
                    title: "Can I customize my website?",
                    description:
                        "Yes. You can customize content, layouts, and other design options.",
                    defaultOpen: false,
                },
            ],
        },
    },
    { _id: false }
);

const accordionSectionSchema = new mongoose.Schema(
    {
        sectionName: {
            type: String,
            enum: ["accordion"],
            default: "accordion",
            required: true,
        },
        variant: {
            type: String,
            default: "borderless-minimal",
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
            type: accordionContentSchema,
            default: () => ({}),
        },
    },
    { _id: false }
);

module.exports = { accordionSectionSchema };
