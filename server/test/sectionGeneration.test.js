const test = require("node:test");
const assert = require("node:assert/strict");
const { getSectionGenerationSchema, normalizeSectionResponse, sectionSchemas } = require("../src/GenAI/sections/sectionSchemas");
const { appendValidatedSection } = require("../src/GenAI/services/websiteAssembler");

const completeHero = {
  content: {
    eyebrow: "FOR INDEPENDENT BOOKSHOPS",
    headline: "Find your next favorite story",
    subheadline: "Handpicked fiction and thoughtful recommendations from local booksellers.",
    description: "Browse new releases, staff picks, and small press discoveries curated for curious readers.",
    actions: [{ text: "Explore the collection", href: "#collection", type: "primary" }],
    media: { type: "image", src: "", alt: "A reader browsing a neighborhood bookstore", imageQuery: "independent bookstore reader bookshelves", poster: "" },
    trustIndicators: [],
    features: [],
    additionalContent: "",
  },
};

test("incomplete section output is rejected instead of receiving generic schema defaults", () => {
  const parsed = getSectionGenerationSchema("hero").safeParse({ content: { headline: "Custom headline" } });
  assert.equal(parsed.success, false);
});

test("complete planner-specific content persists without default hero copy", async () => {
  const generated = getSectionGenerationSchema("hero").parse(completeHero);
  delete generated.content.media.imageQuery;
  const website = { sections: [], markModified() {}, async save() {} };
  await appendValidatedSection(website, "hero", "split", generated.content, sectionSchemas.hero);
  const saved = website.sections[0].content;
  assert.equal(saved.headline, "Find your next favorite story");
  assert.equal(saved.description, completeHero.content.description);
  assert.deepEqual(saved.actions.map((action) => action.text), ["Explore the collection"]);
  assert.deepEqual(saved.features, []);
  assert.equal(saved.media.src, "");
  assert.notEqual(saved.headline, "Build Your Next Big Idea");
});

test("people section contract requires personalized cards and retains their role", async () => {
  const schema = getSectionGenerationSchema("columns");
  const result = schema.parse({ content: {
    eyebrow: "MEET THE TEAM", headline: "The people behind the shop", subheadline: "Readers helping readers.", href: "#team",
    items: [{ title: "Ava Patel", description: "Curates contemporary fiction and translated novels.", role: "Store owner", icon: "", image: "", imageQuery: "bookshop owner portrait" }],
  } });
  delete result.content.items[0].imageQuery;
  const website = { sections: [], markModified() {}, async save() {} };
  await appendValidatedSection(website, "columns", "people", result.content, sectionSchemas.columns);
  assert.equal(website.sections[0].content.items[0].role, "Store owner");
  assert.equal(website.sections[0].content.items[0].title, "Ava Patel");
});

test("contact contract accepts the URL field and map link options exposed by section settings", async () => {
  const generated = getSectionGenerationSchema("contact").parse({ content: {
    eyebrow: "START A PROJECT", headline: "Tell us what you are building", subheadline: "Our product team replies within two business days.",
    href: "#contact", additionalContent: "We work with early stage climate technology teams.", contactDetails: [],
    form: { title: "Project inquiry", submitText: "Send project details", successMessage: "Thanks, we will be in touch.", fields: [
      { name: "website", label: "Company website", type: "url", placeholder: "https://example.com", required: false, options: [] },
    ] },
    socialLinks: [], map: { type: "link", src: "https://maps.example.com/location", alt: "Office location" },
  } });
  const website = { sections: [], markModified() {}, async save() {} };
  await appendValidatedSection(website, "contact", "minimal-typography", generated.content, sectionSchemas.contact);
  assert.equal(website.sections[0].content.form.fields[0].type, "url");
  assert.equal(website.sections[0].content.map.type, "link");
});

test("contact normalization moves root-level form, socialLinks, and map into content", () => {
  const response = {
    content: {
      eyebrow: "LET'S TALK", headline: "Plan your next renovation", subheadline: "Speak with our residential design team.",
      href: "#contact", additionalContent: "Serving homeowners across the North Shore.", contactDetails: [],
    },
    form: { title: "Project inquiry", submitText: "Request a consultation", successMessage: "We will follow up shortly.", fields: [
      { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true, options: [] },
    ] },
    socialLinks: [],
    map: { type: "embed", src: "", alt: "Service area" },
  };
  const normalized = normalizeSectionResponse("contact", response);
  const parsed = getSectionGenerationSchema("contact").parse(normalized);
  assert.equal(parsed.content.form.title, "Project inquiry");
  assert.deepEqual(parsed.content.socialLinks, []);
  assert.equal(parsed.content.map.alt, "Service area");
});
