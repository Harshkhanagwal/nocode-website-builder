const { generateWebsitePlan } = require("./planner/generateWebsitePlan");
const { generateSection } = require("./sections/generateSection");
const { sectionCatalog, sectionSchemas } = require("./sections/sectionSchemas");
const { getAvailableThemes } = require("./services/themeService");
const { getAvailableTypographies } = require("./services/typographyService");
const { createWebsiteRecord, appendValidatedSection, getCompleteWebsite } = require("./services/websiteAssembler");

class WebsiteGenerationError extends Error {
  constructor(message, websiteId = null, sectionName = null) {
    super(message);
    this.name = "WebsiteGenerationError";
    this.websiteId = websiteId;
    this.sectionName = sectionName;
  }
}

async function generateWebsite({ prompt, websiteName, ownerId }) {
  if (typeof prompt !== "string" || !prompt.trim()) throw new WebsiteGenerationError("A website prompt is required");
  const [themes, typographies] = await Promise.all([getAvailableThemes(), getAvailableTypographies()]);
  if (!themes.length || !typographies.length) throw new WebsiteGenerationError("No themes or typographies are available");

  let plan;
  try {
    plan = await generateWebsitePlan({ prompt: prompt.trim(), websiteName, themes, typographies, sectionCatalog });
    const validThemeIds = new Set(themes.map((theme) => String(theme._id)));
    const validTypographyIds = new Set(typographies.map((item) => String(item._id)));
    if (!validThemeIds.has(plan.themeId) || !validTypographyIds.has(plan.typographyId)) {
      throw new Error("Planner selected an unavailable theme or typography");
    }
    for (const section of plan.sections) {
      if (!sectionCatalog[section.sectionName]?.variants.includes(section.variant) || !sectionSchemas[section.sectionName]) {
        throw new Error("Planner selected an unsupported section type or variant");
      }
    }
  } catch (error) {
    throw new WebsiteGenerationError("Could not create a valid website plan");
  }

  let website;
  try {
    website = await createWebsiteRecord({
      name: plan.name,
      owner: ownerId,
      themeId: plan.themeId,
      typographyId: plan.typographyId,
    });
  } catch (error) {
    throw new WebsiteGenerationError("Could not create the website");
  }

  for (const sectionPlan of plan.sections) {
    try {
      const generated = await generateSection({
        ...sectionPlan,
        prompt: `${sectionPlan.prompt}\n\nUser's full request: ${prompt}`,
        designDirection: plan.designDirection,
        websiteName: plan.name,
      });
      await appendValidatedSection(
        website,
        sectionPlan.sectionName,
        sectionPlan.variant,
        generated.content,
        sectionSchemas[sectionPlan.sectionName],
      );
    } catch (error) {
      throw new WebsiteGenerationError(
        `Website generation stopped while creating the ${sectionPlan.sectionName} section`,
        String(website._id),
        sectionPlan.sectionName,
      );
    }
  }

  try {
    return await getCompleteWebsite(website._id, ownerId);
  } catch (error) {
    throw new WebsiteGenerationError("Website was created but could not be retrieved", String(website._id));
  }
}

module.exports = { generateWebsite, WebsiteGenerationError };
