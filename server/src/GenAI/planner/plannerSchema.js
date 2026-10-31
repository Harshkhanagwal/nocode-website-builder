const { z } = require("zod");

const REQUIRED_SECTION_ORDER = ["hero", "about", "columns", "accordion", "contact"];

const websitePlanSchema = z.object({
  name: z.string().trim().min(1).max(100),
  themeId: z.string().min(1),
  typographyId: z.string().min(1),
  designDirection: z.string().trim().min(1).max(1000),
  sections: z.array(z.object({
    sectionName: z.enum(["hero", "about", "columns", "accordion", "contact"]),
    variant: z.string().trim().min(1),
    prompt: z.string().trim().min(1).max(2000),
  }).strict()).length(REQUIRED_SECTION_ORDER.length).superRefine((sections, context) => {
    const seen = new Set();
    sections.forEach((section, index) => {
      if (seen.has(section.sectionName)) {
        context.addIssue({ code: "custom", path: [index, "sectionName"], message: "Each required section must appear exactly once." });
      }
      if (section.sectionName !== REQUIRED_SECTION_ORDER[index]) {
        context.addIssue({
          code: "custom",
          path: [index, "sectionName"],
          message: `Sections must be ordered: ${REQUIRED_SECTION_ORDER.join(", ")}.`,
        });
      }
      seen.add(section.sectionName);
    });
  }),
}).strict();

module.exports = { websitePlanSchema, REQUIRED_SECTION_ORDER };
