const { websitePlanSchema } = require("./plannerSchema");
const { buildPlannerPrompt } = require("./plannerPrompt");
const { completeJson } = require("../groqClient");

function reorderVariantsForBrief(sectionCatalog, brief) {
  const seed = String(brief || "").toLowerCase();
  return Object.fromEntries(Object.entries(sectionCatalog).map(([sectionName, section]) => {
    const variants = Object.entries(section.variants || {});
    if (variants.length < 2) return [sectionName, section];

    // The planner tends to favor the first listed option. Rotate the catalog using
    // the brief so that this positional bias does not always produce the same design.
    let hash = 2166136261;
    for (const character of `${seed}:${sectionName}`) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    const offset = (hash >>> 0) % (variants.length - 1) + 1;
    const orderedVariants = [...variants.slice(offset), ...variants.slice(0, offset)];
    return [sectionName, { ...section, variants: Object.fromEntries(orderedVariants) }];
  }));
}

async function generateWebsitePlan({ prompt, websiteName, themes, typographies, sectionCatalog }) {
  const orderedSectionCatalog = reorderVariantsForBrief(sectionCatalog, `${websiteName || ""}:${prompt}`);
  const system = buildPlannerPrompt({ themes, typographies, sectionCatalog: orderedSectionCatalog });
  const user = `Requested website name: ${websiteName || "(choose a suitable name)"}\nUser request: ${prompt}`;
  const plan = await completeJson({ system, user, schema: websitePlanSchema, label: "website plan", temperature: 0.85 });
  return plan;
}

module.exports = { generateWebsitePlan, reorderVariantsForBrief };
