const { z } = require("zod");

const websitePlanSchema = z.object({
  name: z.string().trim().min(1).max(100),
  themeId: z.string().min(1),
  typographyId: z.string().min(1),
  designDirection: z.string().trim().min(1).max(1000),
  sections: z.array(z.object({
    sectionName: z.enum(["hero", "about", "columns", "accordion", "contact"]),
    variant: z.string().trim().min(1),
    prompt: z.string().trim().min(1).max(2000),
  }).strict()).min(1).max(12),
}).strict();

module.exports = { websitePlanSchema };
