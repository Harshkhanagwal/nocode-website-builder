const { generateWebsitePlan } = require("./planner/generateWebsitePlan");
const { generateSection } = require("./sections/generateSection");
const { sectionCatalog, sectionSchemas } = require("./sections/sectionSchemas");
const { getAvailableThemes } = require("./services/themeService");
const { getAvailableTypographies } = require("./services/typographyService");
const { createWebsiteRecord, appendValidatedSection, getCompleteWebsite } = require("./services/websiteAssembler");
const { createImageSearchContext } = require("./services/imageService");

class WebsiteGenerationError extends Error {
  constructor(message, websiteId = null, sectionName = null, details = null) {
    super(message);
    this.name = "WebsiteGenerationError";
    this.websiteId = websiteId;
    this.sectionName = sectionName;
    this.details = details;
  }
}

function isSupportedSectionPlan(section) {
  const variants = sectionCatalog[section?.sectionName]?.variants;
  return Boolean(variants && Object.prototype.hasOwnProperty.call(variants, section.variant));
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
      throw Object.assign(new Error("Planner selected an unavailable theme or typography"), {
        validationDetails: [{ message: "Select themeId and typographyId from the supplied database records." }],
      });
    }
    for (const section of plan.sections) {
      if (!isSupportedSectionPlan(section) || !sectionSchemas[section.sectionName]) {
        throw Object.assign(new Error("Planner selected an unsupported section type or variant"), {
          validationDetails: [{ path: `sections.${section.sectionName}.variant`, message: "Choose a variant from the supported variant list for that section." }],
        });
      }
    }
  } catch (error) {
    throw new WebsiteGenerationError(
      "Could not create a valid website plan",
      null,
      null,
      error.validationDetails || [{ message: "Check planner output against the available themes, typographies, section types, and variants." }],
    );
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

  const requestImageContext = createImageSearchContext();
  for (const sectionPlan of plan.sections) {
    try {
      const generated = await generateSection({
        ...sectionPlan,
        prompt: `${sectionPlan.prompt}\n\nUser's full request: ${prompt}`,
        designDirection: plan.designDirection,
        websiteName: plan.name,
        websiteDescription: prompt,
        imageContext: requestImageContext,
      });
      await appendValidatedSection(
        website,
        sectionPlan.sectionName,
        sectionPlan.variant,
        generated.content,
        sectionSchemas[sectionPlan.sectionName],
      );
    } catch (error) {
      const mongooseDetails = error.errors
        ? Object.values(error.errors).map((issue) => ({ path: issue.path, message: issue.message })).slice(0, 12)
        : null;
      throw new WebsiteGenerationError(
        `Website generation stopped while creating the ${sectionPlan.sectionName} section`,
        String(website._id),
        sectionPlan.sectionName,
        error.validationDetails || mongooseDetails || [{ message: error.message }],
      );
    }
  }

  try {
    return await getCompleteWebsite(website._id, ownerId);
  } catch (error) {
    throw new WebsiteGenerationError("Website was created but could not be retrieved", String(website._id));
  }
}

module.exports = { generateWebsite, WebsiteGenerationError, isSupportedSectionPlan };
