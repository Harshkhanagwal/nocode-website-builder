const { completeJson } = require("../groqClient");
const { getSectionGenerationSchema, normalizeSectionResponse } = require("./sectionSchemas");
const { buildSectionPrompt } = require("./sectionPrompts");
const { resolveSectionImages } = require("../services/imageService");

async function generateSection({ sectionName, variant, prompt, designDirection, websiteName, websiteDescription, imageContext }) {
  const system = buildSectionPrompt({ sectionName, variant, designDirection, websiteName });
  const schema = getSectionGenerationSchema(sectionName);
  const generated = await completeJson({
    system,
    user: prompt,
    schema,
    label: `${sectionName} section`,
    normalize: (response) => normalizeSectionResponse(sectionName, response),
  });
  generated.content = await resolveSectionImages({
    sectionName,
    variant,
    content: generated.content,
    sectionPrompt: prompt,
    websiteDescription,
    websiteName,
    context: imageContext,
  });
  return generated;
}

module.exports = { generateSection };
