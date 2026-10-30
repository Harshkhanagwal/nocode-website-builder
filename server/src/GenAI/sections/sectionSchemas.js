const { z } = require("zod");

const actionSchema = z.object({
  text: z.string().trim().min(1).max(50),
  href: z.string().trim().min(1).max(500),
  type: z.enum(["primary", "secondary"]),
}).strict();

const mediaSchema = z.object({
  type: z.literal("image"),
  src: z.string(),
  alt: z.string().trim().min(1).max(250),
  imageQuery: z.string().trim().min(1).max(180),
  poster: z.string(),
}).strict();

const heroSchema = z.object({
  content: z.object({
    eyebrow: z.string().trim().min(1).max(100),
    headline: z.string().trim().min(1).max(200),
    subheadline: z.string().trim().min(1).max(250),
    description: z.string().trim().min(1).max(1000),
    actions: z.array(actionSchema).min(1).max(4),
    media: mediaSchema,
    trustIndicators: z.array(z.object({
      type: z.enum(["text", "image", "icon"]), content: z.string(), src: z.string(), alt: z.string(), icon: z.string(),
    }).strict()).max(8),
    features: z.array(z.object({
      title: z.string(), description: z.string(), icon: z.string(),
    }).strict()).max(8),
    additionalContent: z.string(),
  }).strict(),
}).strict();

const aboutSchema = z.object({
  content: z.object({
    eyebrow: z.string().trim().min(1),
    headline: z.string().trim().min(1),
    subheadline: z.string().trim().min(1),
    description: z.string().trim().min(1),
    href: z.string(),
    media: z.object({ type: z.literal("image"), src: z.string(), alt: z.string().trim().min(1), imageQuery: z.string().trim().min(1).max(180) }).strict(),
    highlights: z.array(z.object({ title: z.string().trim().min(1), description: z.string().trim().min(1) }).strict()).min(1),
    actions: z.array(actionSchema),
    additionalContent: z.string(),
  }).strict(),
}).strict();

const columnsSchema = z.object({
  content: z.object({
    eyebrow: z.string().trim().min(1),
    headline: z.string().trim().min(1),
    subheadline: z.string().trim().min(1),
    href: z.string(),
    items: z.array(z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      icon: z.string(),
      image: z.string(),
      imageQuery: z.string(),
      role: z.string(),
    }).strict()).min(1),
  }).strict(),
}).strict();

const accordionSchema = z.object({
  content: z.object({
    eyebrow: z.string().trim().min(1),
    headline: z.string().trim().min(1),
    subheadline: z.string().trim().min(1),
    href: z.string(),
    items: z.array(z.object({
      title: z.string().trim().min(1), description: z.string().trim().min(1), defaultOpen: z.boolean(),
    }).strict()).min(1),
  }).strict(),
}).strict();

const contactSchema = z.object({
  content: z.object({
    eyebrow: z.string().trim().min(1),
    headline: z.string().trim().min(1),
    subheadline: z.string().trim().min(1),
    href: z.string(),
    additionalContent: z.string(),
    contactDetails: z.array(z.object({
      type: z.enum(["email", "phone", "address"]), label: z.string(), value: z.string(), href: z.string(),
    }).strict()),
    form: z.object({
      title: z.string().trim().min(1), submitText: z.string().trim().min(1), successMessage: z.string().trim().min(1),
      fields: z.array(z.object({
        name: z.string().trim().min(1), label: z.string().trim().min(1),
        type: z.enum(["text", "email", "tel", "textarea", "select", "url"]),
        placeholder: z.string().default(""), required: z.boolean().default(false), options: z.array(z.string()).default([]),
      }).strict()).min(1),
    }).strict(),
    socialLinks: z.array(z.object({ platform: z.string(), url: z.string() }).strict()),
    map: z.object({ type: z.enum(["embed", "link"]), src: z.string(), alt: z.string() }).strict(),
  }).strict(),
}).strict();

const generationSchemas = {
  hero: heroSchema,
  about: aboutSchema,
  columns: columnsSchema,
  accordion: accordionSchema,
  contact: contactSchema,
};

const sectionSchemas = {
  hero: require("../../models/sections/HeroSection").heroSectionSchema,
  about: require("../../models/sections/AboutSection").aboutSectionSchema,
  columns: require("../../models/sections/ColumnsSection").columnsSectionSchema,
  accordion: require("../../models/sections/AccordionSection").accordionSectionSchema,
  contact: require("../../models/sections/ContactSection").contactSectionSchema,
};

const sectionTypes = Object.keys(sectionSchemas);
const sectionCatalog = {
  hero: { variants: ["split", "centered", "fullscreen-image", "cinematic-corner"], purpose: "Main introduction and call to action" },
  about: { variants: ["editorial", "minimal-typography", "timeline", "bento-grid"], purpose: "Business story, approach, or background" },
  columns: { variants: ["bento", "classic", "people", "service-cards"], purpose: "Services, features, or team" },
  accordion: { variants: ["borderless-minimal", "dark-futuristic", "rounded-cards", "two-column-faq"], purpose: "Frequently asked questions" },
  contact: { variants: ["dark-split-screen", "terminal-code-editor", "floating-form-card", "minimal-typography"], purpose: "Contact details and inquiry form" },
};

function getSectionGenerationSchema(sectionName) {
  const schema = generationSchemas[sectionName];
  if (!schema) throw new Error(`Unsupported section type: ${sectionName}`);
  return schema;
}

function normalizeSectionResponse(sectionName, response) {
  if (sectionName !== "contact" || !response || typeof response !== "object" || Array.isArray(response)) {
    return response;
  }
  const contactKeys = [
    "eyebrow", "headline", "subheadline", "href", "additionalContent",
    "contactDetails", "form", "socialLinks", "map",
  ];
  const normalized = { ...response };
  const content = normalized.content && typeof normalized.content === "object" && !Array.isArray(normalized.content)
    ? { ...normalized.content }
    : {};
  for (const key of contactKeys) {
    if (content[key] === undefined && normalized[key] !== undefined) {
      content[key] = normalized[key];
    }
    delete normalized[key];
  }
  normalized.content = content;
  return normalized;
}

module.exports = { sectionSchemas, generationSchemas, getSectionGenerationSchema, normalizeSectionResponse, sectionTypes, sectionCatalog };
