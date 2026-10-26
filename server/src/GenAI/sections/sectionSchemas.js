const { z } = require("zod");

const sectionContentSchema = z.object({
  content: z.record(z.string(), z.unknown()),
}).passthrough();

const schemas = {
  hero: require("../../models/sections/HeroSection").heroSectionSchema,
  about: require("../../models/sections/AboutSection").aboutSectionSchema,
  columns: require("../../models/sections/ColumnsSection").columnsSectionSchema,
  accordion: require("../../models/sections/AccordionSection").accordionSectionSchema,
  contact: require("../../models/sections/ContactSection").contactSectionSchema,
};

const sectionTypes = Object.keys(schemas);
const sectionCatalog = {
  hero: { variants: ["split", "centered", "fullscreen-image", "cinematic-corner"], purpose: "Main introduction and call to action" },
  about: { variants: ["editorial", "minimal-typography", "timeline", "bento-grid"], purpose: "Business story, approach, or background" },
  columns: { variants: ["bento", "classic", "people", "service-cards"], purpose: "Services, features, or team" },
  accordion: { variants: ["borderless-minimal", "dark-futuristic", "rounded-cards", "two-column-faq"], purpose: "Frequently asked questions" },
  contact: { variants: ["dark-split-screen", "terminal-code-editor", "floating-form-card", "minimal-typography"], purpose: "Contact details and inquiry form" },
};

const sectionPayloadSchema = sectionContentSchema;

module.exports = { sectionSchemas: schemas, sectionTypes, sectionCatalog, sectionPayloadSchema };
