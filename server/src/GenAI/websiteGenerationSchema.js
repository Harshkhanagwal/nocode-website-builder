    

const { z } = require("zod");

// ============================================================
// Shared schemas
// ============================================================

const actionSchema = z.object({
  text: z.string().default(""),
  href: z.string().default(""),
  type: z.enum(["primary", "secondary"]).default("primary"),
});

const baseSection = {
  id: z.string().min(1),
  enabled: z.boolean().default(true),
  order: z.number().int().nonnegative(),
};

const imageMediaSchema = z.object({
  type: z.enum(["image", "video"]).default("image"),
  src: z.string().default(""),
  imageQuery: z.string().default(""),
  alt: z.string().default(""),
  poster: z.string().default(""),
});

const emptyImageMediaSchema = z.object({
  type: z.enum(["image", "video"]).default("image"),
  src: z.string().default(""),
  imageQuery: z.string().default(""),
  alt: z.string().default(""),
});

const trustIndicatorSchema = z.object({
  type: z.enum(["text", "image"]).default("text"),
  content: z.string().default(""),
  src: z.string().default(""),
  imageQuery: z.string().default(""),
  alt: z.string().default(""),
  icon: z.string().default(""),
});

const featureSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  icon: z.string().default(""),
});

const highlightSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
});

// ============================================================
// Header
// ============================================================

const headerSection = z.object({
  sectionName: z.literal("header"),
  variant: z.enum(["minimal-right"]),

  ...baseSection,

  content: z.object({
    logo: z.object({
      type: z.enum(["text", "image"]).default("text"),
      text: z.string().default(""),
      image: z.string().default(""),
      imageQuery: z.string().default(""),
      href: z.string().default("#home"),
      visibility: z.boolean().default(true),
    }),

    navigation: z.array(
      z.object({
        label: z.string().default(""),
        href: z.string().default("#home"),
      })
    ).default([]),

    actions: z.array(actionSchema).default([]),

    settings: z.object({
      sticky: z.boolean().default(false),
      showNavigation: z.boolean().default(true),
      showActions: z.boolean().default(true),
      mobileMenu: z.boolean().default(true),
    }),
  }),
});

// ============================================================
// Hero
// ============================================================

const heroSection = z.object({
  sectionName: z.literal("hero"),
  variant: z.enum(["centered", "split"]),

  ...baseSection,

  content: z.object({
    eyebrow: z.string().default(""),
    headline: z.string().default(""),
    subheadline: z.string().default(""),
    description: z.string().default(""),

    actions: z.array(actionSchema).default([]),

    media: imageMediaSchema,

    trustIndicators: z.array(trustIndicatorSchema).default([]),

    features: z.array(featureSchema).default([]),

    additionalContent: z.string().default(""),
  }),

  visibility: z.object({
    eyebrow: z.boolean().default(true),
    headline: z.boolean().default(true),
    subheadline: z.boolean().default(true),
    description: z.boolean().default(true),
    actions: z.boolean().default(true),
    media: z.boolean().default(true),
    trustIndicators: z.boolean().default(false),
    features: z.boolean().default(false),
    additionalContent: z.boolean().default(false),
  }),
});

// ============================================================
// About
// ============================================================

const aboutSection = z.object({
  sectionName: z.literal("about"),

  variant: z.enum([
    "editorial",
    "minimal-typography",
    "timeline",
    "bento-grid",
  ]),

  ...baseSection,

  content: z.object({
    eyebrow: z.string().default(""),
    headline: z.string().default(""),
    subheadline: z.string().default(""),
    description: z.string().default(""),
    href: z.string().default(""),

    media: emptyImageMediaSchema,

    highlights: z.array(highlightSchema).default([]),

    actions: z.array(actionSchema).default([]),

    additionalContent: z.string().default(""),
  }),
});

// ============================================================
// Columns
// ============================================================

const columnsHeading = {
  eyebrow: z.string().default(""),
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  href: z.string().default(""),
};

const serviceCardsSection = z.object({
  sectionName: z.literal("columns"),
  variant: z.literal("service-cards"),

  ...baseSection,

  content: z.object({
    ...columnsHeading,

    items: z.array(
      z.object({
        title: z.string().default(""),
        description: z.string().default(""),
        icon: z.string().default(""),
      })
    ).default([]),
  }),
});

const generalColumnsSection = z.object({
  sectionName: z.literal("columns"),

  variant: z.enum(["bento", "classic", "people"]),

  ...baseSection,

  content: z.object({
    ...columnsHeading,

    items: z.array(
      z.object({
        title: z.string().default(""),
        description: z.string().default(""),
        icon: z.string().default(""),
        image: z.string().default(""),
        imageQuery: z.string().default(""),
        href: z.string().default(""),
        tags: z.array(z.string()).default([]),
        name: z.string().default(""),
        role: z.string().default(""),
        avatar: z.string().default(""),
      })
    ).default([]),
  }),
});

// ============================================================
// Accordion / FAQ
// ============================================================

const accordionSection = z.object({
  sectionName: z.literal("accordion"),

  variant: z.enum([
    "borderless-minimal",
    "dark-futuristic",
    "rounded-cards",
    "two-column-faq",
  ]),

  ...baseSection,

  content: z.object({
    eyebrow: z.string().default(""),
    headline: z.string().default(""),
    subheadline: z.string().default(""),
    href: z.string().default(""),

    items: z.array(
      z.object({
        title: z.string().default(""),
        description: z.string().default(""),
        defaultOpen: z.boolean().default(false),
      })
    ).default([]),

    additionalContent: z.string().default(""),
  }),
});

// ============================================================
// Contact
// ============================================================

const contactSection = z.object({
  sectionName: z.literal("contact"),

  variant: z.enum([
    "dark-split-screen",
    "terminal-code-editor",
    "floating-form-card",
    "minimal-typography",
  ]),

  ...baseSection,

  content: z.object({
    eyebrow: z.string().default(""),
    headline: z.string().default(""),
    subheadline: z.string().default(""),
    href: z.string().default("#contact"),
    additionalContent: z.string().default(""),

    contactDetails: z.array(
      z.object({
        type: z.string().default(""),
        label: z.string().default(""),
        value: z.string().default(""),
        href: z.string().default(""),
      })
    ).default([]),

    form: z.object({
      title: z.string().default(""),
      submitText: z.string().default("Send message"),
      successMessage: z.string().default(""),

      fields: z.array(
        z.object({
          name: z.string().default(""),
          label: z.string().default(""),
          type: z.enum(["text", "email", "textarea"]),
          placeholder: z.string().default(""),
          required: z.boolean().default(false),
          options: z.array(z.string()).default([]),
        })
      ).default([]),
    }),

    socialLinks: z.array(
      z.object({
        platform: z.string().default(""),
        url: z.string().default(""),
      })
    ).default([]),

    map: z.object({
      type: z.string().default("embed"),
      src: z.string().default(""),
      alt: z.string().default(""),
    }),
  }),
});

// ============================================================
// Dynamic design direction
// ============================================================

const designSchema = z.object({
  direction: z.string().default("clean and modern"),
  colorMood: z.string().default("balanced"),
  typographyMood: z.string().default("modern sans-serif"),

  colors: z.object({
    primary: z.string().default("#2563EB"),
    primaryHover: z.string().default("#1D4ED8"),
    background: z.string().default("#FFFFFF"),
    surface: z.string().default("#F8FAFC"),
    text: z.string().default("#111827"),
    accent: z.string().default("#14B8A6"),
  }),
});

// ============================================================
// Root schema
// ============================================================

const websiteGenerationSchema = z.object({
  name: z.string().min(1),

  design: designSchema,

  // Variable section count and order.
  sections: z.array(
    z.union([
      headerSection,
      heroSection,
      aboutSection,
      serviceCardsSection,
      generalColumnsSection,
      accordionSection,
      contactSection,
    ])
  ).min(2),
});

module.exports = {
  websiteGenerationSchema,
};
