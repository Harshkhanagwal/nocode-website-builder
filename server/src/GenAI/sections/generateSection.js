const { completeJson } = require("../groqClient");
const { sectionPayloadSchema } = require("./sectionSchemas");
const { buildSectionPrompt } = require("./sectionPrompts");

async function generateSection({ sectionName, variant, prompt, designDirection, websiteName }) {
  const system = buildSectionPrompt({ sectionName, variant, designDirection, websiteName });
  return completeJson({
    system,
    user: prompt,
    schema: sectionPayloadSchema,
    label: `${sectionName} section`,
  });
}

module.exports = { generateSection };
