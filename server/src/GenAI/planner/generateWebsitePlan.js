const { websitePlanSchema } = require("./plannerSchema");
const { buildPlannerPrompt } = require("./plannerPrompt");
const { completeJson } = require("../groqClient");

async function generateWebsitePlan({ prompt, websiteName, themes, typographies, sectionCatalog }) {
  const system = buildPlannerPrompt({ themes, typographies, sectionCatalog });
  const user = `Requested website name: ${websiteName || "(choose a suitable name)"}\nUser request: ${prompt}`;
  const plan = await completeJson({ system, user, schema: websitePlanSchema, label: "website plan" });
  return plan;
}

module.exports = { generateWebsitePlan };
