const mongoose = require("mongoose");
const Website = require("../../models/Website");
const { ensureDefaultHeader } = require("../../utils/ensureDefaultHeader");

function createSlug(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function createWebsiteRecord({ name, owner, themeId, typographyId }) {
  const baseSlug = createSlug(name) || "website";
  let slug = baseSlug;
  let suffix = 1;
  while (await Website.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return Website.create({ name, slug, owner, theme: themeId, typography: typographyId });
}

async function appendValidatedSection(website, sectionName, variant, content, sectionSchema) {
  const order = website.sections.length;
  const validator = new mongoose.Document({
    sectionName,
    variant,
    enabled: true,
    order,
    content,
    visibility: {},
  }, sectionSchema);
  await validator.validate();
  website.sections.push(validator.toObject());
  website.markModified("sections");
  await website.save();
  return website.sections[website.sections.length - 1];
}

async function getCompleteWebsite(websiteId, ownerId) {
  const website = await Website.findOne({ _id: websiteId, owner: ownerId })
    .populate("theme")
    .populate("typography");
  if (!website) throw new Error("Generated website could not be retrieved");
  if (ensureDefaultHeader(website)) await website.save();
  website.sections.sort((a, b) => a.order - b.order);
  return website;
}

module.exports = { createWebsiteRecord, appendValidatedSection, getCompleteWebsite };
