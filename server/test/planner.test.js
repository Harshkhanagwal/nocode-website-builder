const test = require("node:test");
const assert = require("node:assert/strict");
const { websitePlanSchema } = require("../src/GenAI/planner/plannerSchema");
const { buildPlannerPrompt } = require("../src/GenAI/planner/plannerPrompt");
const { reorderVariantsForBrief } = require("../src/GenAI/planner/generateWebsitePlan");
const { sectionCatalog } = require("../src/GenAI/sections/sectionSchemas");
const { isSupportedSectionPlan } = require("../src/GenAI/generateWebsite");

const basePlan = {
  name: "North Shore Studio",
  themeId: "theme-1",
  typographyId: "type-1",
  designDirection: "Warm coastal editorial",
  sections: [
    { sectionName: "hero", variant: "fullscreen-image", prompt: "Introduce the coastal interior design studio and invite visitors to view its projects." },
    { sectionName: "about", variant: "editorial", prompt: "Explain the studio's approach to thoughtful coastal interiors." },
    { sectionName: "columns", variant: "service-cards", prompt: "Describe residential styling, renovation planning, and furnishing services." },
    { sectionName: "accordion", variant: "rounded-cards", prompt: "Answer common client questions about design projects." },
    { sectionName: "contact", variant: "floating-form-card", prompt: "Invite homeowners to request a design consultation." },
  ],
};

test("website planner schema accepts tailored plans with different variants", () => {
  assert.deepEqual(websitePlanSchema.parse(basePlan), basePlan);
});

test("website planner requires every section in the required display order", () => {
  const duplicate = {
    ...basePlan,
    sections: [
      ...basePlan.sections.slice(0, 4),
      { sectionName: "hero", variant: "centered", prompt: "Repeat the introduction." },
    ],
  };
  assert.equal(websitePlanSchema.safeParse(duplicate).success, false);
  assert.equal(websitePlanSchema.safeParse({ ...basePlan, sections: basePlan.sections.slice(0, 2) }).success, false);
});

test("planner instructions require brief-driven section and variant choices", () => {
  const prompt = buildPlannerPrompt({ themes: [], typographies: [], sectionCatalog });
  assert.match(prompt, /Always plan these five sections, exactly once and in this\s+order: hero, about, columns, accordion, contact/i);
  assert.match(prompt, /Do not select the first listed\s+variant by position/i);
  assert.match(prompt, /Select each variant deliberately from its description/);
  assert.match(prompt, /infer the visual mood,\s+audience, content shape, and industry from this specific brief/i);
  assert.match(prompt, /"cinematic-corner"/);
  assert.match(prompt, /"two-column-faq"/);
});

test("variant catalog order changes per brief while preserving the supported choices", () => {
  const first = reorderVariantsForBrief(sectionCatalog, "A modern bakery website");
  const again = reorderVariantsForBrief(sectionCatalog, "A modern bakery website");
  const second = reorderVariantsForBrief(sectionCatalog, "A legal consulting firm");
  assert.deepEqual(first, again);
  for (const sectionName of Object.keys(sectionCatalog)) {
    assert.deepEqual(
      Object.keys(first[sectionName].variants).sort(),
      Object.keys(sectionCatalog[sectionName].variants).sort(),
    );
    assert.notEqual(
      Object.keys(first[sectionName].variants)[0],
      Object.keys(sectionCatalog[sectionName].variants)[0],
    );
  }
  assert.notDeepEqual(
    Object.fromEntries(Object.entries(first).map(([key, value]) => [key, Object.keys(value.variants)])),
    Object.fromEntries(Object.entries(second).map(([key, value]) => [key, Object.keys(value.variants)])),
  );
});

test("orchestrator accepts catalog object variants and rejects unsupported variants", () => {
  assert.equal(isSupportedSectionPlan({ sectionName: "hero", variant: "cinematic-corner" }), true);
  assert.equal(isSupportedSectionPlan({ sectionName: "contact", variant: "floating-form-card" }), true);
  assert.equal(isSupportedSectionPlan({ sectionName: "contact", variant: "split" }), false);
  assert.equal(isSupportedSectionPlan({ sectionName: "header", variant: "minimal-right" }), false);
});
