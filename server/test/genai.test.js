const test = require("node:test");
const assert = require("node:assert/strict");
const { websitePlanSchema } = require("../src/GenAI/planner/plannerSchema");
const { sectionCatalog, sectionSchemas } = require("../src/GenAI/sections/sectionSchemas");
const { appendValidatedSection } = require("../src/GenAI/services/websiteAssembler");

test("planner schema accepts an existing section plan and rejects headers", () => {
  const valid = {
    name: "Sample Studio",
    themeId: "theme-id",
    typographyId: "typography-id",
    designDirection: "Warm editorial",
    sections: [{ sectionName: "hero", variant: "split", prompt: "Introduce the studio." }],
  };
  assert.equal(websitePlanSchema.parse(valid).sections.length, 1);
  assert.equal(websitePlanSchema.safeParse({ ...valid, sections: [{ sectionName: "header", variant: "minimal-right", prompt: "Header" }] }).success, false);
});

test("planner variants match registered renderable types and omit generated headers", () => {
  assert.deepEqual(Object.keys(sectionCatalog), Object.keys(sectionSchemas));
  assert.equal(Object.hasOwn(sectionCatalog, "header"), false);
  for (const [name, schema] of Object.entries(sectionSchemas)) {
    assert.ok(schema instanceof require("mongoose").Schema, `${name} uses its application schema`);
  }
});

test("section validation and persistence happen before returning the section", async () => {
  const website = {
    sections: [{ sectionName: "header", order: 0 }],
    markModified() {},
    async save() { this.saved = true; },
  };
  const section = await appendValidatedSection(
    website,
    "hero",
    "split",
    { headline: "A better way to plan" },
    sectionSchemas.hero,
  );
  assert.equal(website.saved, true);
  assert.equal(section.sectionName, "hero");
  assert.equal(section.order, 1);
  assert.equal(section.content.headline, "A better way to plan");
});

test("invalid section data is rejected before website persistence", async () => {
  let saved = false;
  const website = { sections: [], markModified() {}, async save() { saved = true; } };
  await assert.rejects(() => appendValidatedSection(
    website,
    "hero",
    "split",
    { media: { type: "unsupported" } },
    sectionSchemas.hero,
  ));
  assert.equal(saved, false);
  assert.equal(website.sections.length, 0);
});
