const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createImageSearchContext,
  resolveSectionImages,
} = require("../src/GenAI/services/imageService");
const { sectionSchemas } = require("../src/GenAI/sections/sectionSchemas");
const { appendValidatedSection } = require("../src/GenAI/services/websiteAssembler");

const photo = (id, description = `A photo of ${id}`) => ({
  id,
  width: 2400,
  height: 1600,
  color: "#abc123",
  alt_description: description,
  urls: { raw: `https://images.unsplash.com/${id}?ixid=test` },
  links: {
    html: `https://unsplash.com/photos/${id}`,
    download_location: `https://api.unsplash.com/photos/${id}/download`,
  },
  user: { name: `Photographer ${id}`, links: { html: `https://unsplash.com/@${id}` } },
});

const response = (status, payload = {}) => ({
  status,
  ok: status >= 200 && status < 300,
  async json() { return payload; },
});

test("searches Unsplash, returns resized hotlinked URL and attribution metadata", async () => {
  const requests = [];
  const context = createImageSearchContext({
    accessKey: "test-secret",
    fetchImpl: async (url, options) => {
      requests.push({ url: String(url), options });
      return String(url).includes("/search/photos")
        ? response(200, { results: [photo("one", "modern office interior")] })
        : response(200, {});
    },
    logger: { warn() {} },
  });

  const result = await context.findImage("modern office", { width: 1600, height: 900 });
  assert.match(result.src, /^https:\/\/images\.unsplash\.com\/one\?/);
  assert.match(result.src, /w=1600/);
  assert.match(result.src, /h=900/);
  assert.match(result.src, /fit=crop/);
  assert.equal(result.alt, "modern office interior");
  assert.equal(result.attribution.photographer, "Photographer one");
  assert.match(result.attribution.photographerUrl, /utm_source=/);
  assert.equal(requests.length, 2, "search plus required download event tracking");
  assert.ok(requests.every(({ options }) => options.headers.Authorization === "Client-ID test-secret"));
  assert.equal(JSON.stringify(result).includes("test-secret"), false);
});

test("empty results return null and duplicate queries use the request cache", async () => {
  let searchCount = 0;
  const context = createImageSearchContext({
    accessKey: "test-key",
    fetchImpl: async (url) => {
      if (String(url).includes("/search/photos")) searchCount += 1;
      return response(200, { results: [] });
    },
    logger: { warn() {} },
  });
  assert.equal(await context.findImage("empty query"), null);
  assert.equal(await context.findImage("empty query"), null);
  assert.equal(searchCount, 1);
});

test("missing API key is a clear configuration error", async () => {
  const warnings = [];
  const context = createImageSearchContext({ accessKey: "", fetchImpl: async () => assert.fail("must not call fetch"), logger: { warn: (message) => warnings.push(message) } });
  assert.equal(await context.findImageSafely("studio portrait"), null);
  assert.match(warnings[0], /UNSPLASH_ACCESS_KEY/);
});

test("rate limits and other API errors are handled without leaking credentials", async () => {
  for (const status of [429, 500]) {
    const context = createImageSearchContext({
      accessKey: "private-key",
      fetchImpl: async () => response(status),
      logger: { warn() {} },
    });
    await assert.rejects(context.findImage("architecture"), new RegExp(`request failed \\(${status}\\)`));
    assert.equal(await context.findImageSafely("architecture other"), null);
  }
});

test("timed out searches fall back without rejecting section generation", async () => {
  const context = createImageSearchContext({
    accessKey: "test-key",
    timeoutMs: 5,
    fetchImpl: async (_url, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    }),
    logger: { warn() {} },
  });
  assert.equal(await context.findImageSafely("slow response"), null);
});

test("maps hero, about, and people results into renderer fields and persists the metadata", async () => {
  const searches = [];
  let counter = 0;
  const context = createImageSearchContext({
    accessKey: "test-key",
    fetchImpl: async (url) => {
      if (String(url).includes("/search/photos")) {
        searches.push(new URL(String(url)).searchParams.get("query"));
        counter += 1;
        return response(200, { results: [photo(`image-${counter}`)] });
      }
      return response(200, {});
    },
    logger: { warn() {} },
  });

  const hero = await resolveSectionImages({
    sectionName: "hero", variant: "split", content: { headline: "Dental care", media: { imageQuery: "bright dental clinic" } },
    sectionPrompt: "Welcoming family dental practice", websiteDescription: "Dentist website", websiteName: "Bright Dental", context,
  });
  assert.match(hero.media.src, /^https:\/\/images\.unsplash\.com\/image-/);
  assert.ok(hero.media.imageAttribution.photographerUrl);

  const about = await resolveSectionImages({
    sectionName: "about", variant: "editorial", content: { media: { src: "/images/about.png" } },
    sectionPrompt: "Our clinic story", websiteDescription: "Dentist website", websiteName: "Bright Dental", context,
  });
  assert.match(about.media.src, /^https:\/\/images\.unsplash\.com\/image-/);

  const columns = await resolveSectionImages({
    sectionName: "columns", variant: "people", content: { items: [
      { title: "Ava", role: "Dentist", imageQuery: "dentist portrait" },
      { title: "Noah", role: "Hygienist", imageQuery: "dental hygienist portrait" },
    ] },
    sectionPrompt: "Meet our dental team", websiteDescription: "Dentist website", websiteName: "Bright Dental", context,
  });
  assert.notEqual(columns.items[0].image, columns.items[1].image);
  assert.ok(columns.items[0].imageAttribution.sourceUrl);
  assert.equal(searches.length, 4);

  const website = { sections: [], markModified() {}, async save() {} };
  await appendValidatedSection(website, "columns", "people", columns, sectionSchemas.columns);
  assert.match(website.sections[0].content.items[0].image, /^https:\/\/images\.unsplash\.com/);
  assert.equal(website.sections[0].content.items[0].imageAttribution.sourceName, "Unsplash");
});

test("preserves an existing valid image URL without searching", async () => {
  const context = createImageSearchContext({ accessKey: "key", fetchImpl: async () => assert.fail("must preserve existing source") });
  const content = { media: { src: "https://cdn.example.com/user-image.jpg", alt: "User selected" } };
  const result = await resolveSectionImages({
    sectionName: "hero", variant: "split", content, sectionPrompt: "hero",
    websiteDescription: "site", websiteName: "Site", context,
  });
  assert.equal(result.media.src, content.media.src);
});

test("image search failures do not block section validation and persistence", async () => {
  const warnings = [];
  const context = createImageSearchContext({ accessKey: "key", fetchImpl: async () => response(503), logger: { warn: (message) => warnings.push(message) } });
  const generated = await resolveSectionImages({
    sectionName: "hero", variant: "split", content: { headline: "Welcome", media: { imageQuery: "wellness studio" } },
    sectionPrompt: "Welcoming hero", websiteDescription: "Wellness studio", websiteName: "Calm", context,
  });
  const website = { sections: [], markModified() {}, async save() { this.saved = true; } };
  await appendValidatedSection(website, "hero", "split", generated, sectionSchemas.hero);
  assert.equal(website.saved, true);
  assert.equal(website.sections[0].sectionName, "hero");
  assert.ok(warnings.length > 0);
});
