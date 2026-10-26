const API_URL = "https://api.unsplash.com/search/photos";
const DEFAULT_TIMEOUT_MS = 8000;
const APP_NAME = process.env.UNSPLASH_APP_NAME || "nocode_website_builder";

class UnsplashConfigurationError extends Error {
  constructor() {
    super("UNSPLASH_ACCESS_KEY is not configured");
    this.name = "UnsplashConfigurationError";
  }
}

class UnsplashApiError extends Error {
  constructor(status) {
    super(`Unsplash API request failed (${status})`);
    this.name = "UnsplashApiError";
    this.status = status;
  }
}

function buildImageUrl(rawUrl, { width, height, quality = 85 }) {
  if (!rawUrl) return "";
  const url = new URL(rawUrl);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  if (width) url.searchParams.set("w", String(width));
  if (height) url.searchParams.set("h", String(height));
  url.searchParams.set("q", String(quality));
  return url.toString();
}

function addAttributionParams(value) {
  if (!value) return "";
  const url = new URL(value);
  url.searchParams.set("utm_source", APP_NAME);
  url.searchParams.set("utm_medium", "referral");
  return url.toString();
}

function createImageSearchContext({
  accessKey = process.env.UNSPLASH_ACCESS_KEY,
  fetchImpl = global.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  logger = console,
} = {}) {
  const cache = new Map();
  const usedPhotoIds = new Set();
  let warnedMissingKey = false;

  async function searchPhotos(query, { orientation = "landscape", perPage = 8 } = {}) {
    const cleanQuery = String(query || "").trim().replace(/\s+/g, " ").slice(0, 180);
    if (!cleanQuery) return [];
    if (!accessKey) throw new UnsplashConfigurationError();
    const key = `${cleanQuery.toLowerCase()}|${orientation}|${perPage}`;
    if (!cache.has(key)) {
      cache.set(key, (async () => {
        const url = new URL(API_URL);
        url.searchParams.set("query", cleanQuery);
        url.searchParams.set("orientation", orientation);
        url.searchParams.set("per_page", String(perPage));
        url.searchParams.set("content_filter", "high");
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const response = await fetchImpl(url, {
            method: "GET",
            headers: { Authorization: `Client-ID ${accessKey}`, "Accept-Version": "v1" },
            signal: controller.signal,
          });
          if (response.status === 429) throw new UnsplashApiError(429);
          if (!response.ok) throw new UnsplashApiError(response.status);
          const payload = await response.json();
          return Array.isArray(payload?.results) ? payload.results : [];
        } finally {
          clearTimeout(timeout);
        }
      })());
    }
    return cache.get(key);
  }

  async function findImage(query, options = {}) {
    const photos = await searchPhotos(query, options);
    const photo = photos.find((result) => result?.id && !usedPhotoIds.has(result.id)) || photos.find((result) => result?.id);
    if (!photo) return null;
    usedPhotoIds.add(photo.id);
    if (photo.links?.download_location) {
      try {
        const timeoutController = new AbortController();
        const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
        try {
          const trackUrl = photo.links.download_location;
          const tracked = await fetchImpl(trackUrl, {
            method: "GET",
            headers: { Authorization: `Client-ID ${accessKey}`, "Accept-Version": "v1" },
            signal: timeoutController.signal,
          });
          if (!tracked.ok) logger.warn(`Unsplash download tracking failed (HTTP ${tracked.status})`);
        } finally {
          clearTimeout(timeout);
        }
      } catch (error) {
        logger.warn("Unsplash download tracking failed");
      }
    }
    const photographer = photo.user?.name || "Unsplash photographer";
    return {
      id: photo.id,
      src: buildImageUrl(photo.urls?.raw || photo.urls?.regular || photo.urls?.small, options),
      alt: photo.alt_description || photo.description || `Photo by ${photographer}`,
      width: photo.width || null,
      height: photo.height || null,
      color: photo.color || "",
      attribution: {
        photographer,
        photographerUrl: addAttributionParams(photo.user?.links?.html),
        sourceName: "Unsplash",
        sourceUrl: addAttributionParams(photo.links?.html),
      },
    };
  }

  async function findImageSafely(query, options = {}) {
    try {
      return await findImage(query, options);
    } catch (error) {
      if (error instanceof UnsplashConfigurationError && !warnedMissingKey) {
        logger.warn("Unsplash image search disabled: configure UNSPLASH_ACCESS_KEY");
        warnedMissingKey = true;
      } else if (!(error instanceof UnsplashConfigurationError)) {
        logger.warn(`Unsplash image search failed${error.status ? ` (HTTP ${error.status})` : ""}`);
      }
      return null;
    }
  }

  return { searchPhotos, findImage, findImageSafely, cache, usedPhotoIds };
}

const isUsableImageSource = (src) => {
  if (typeof src !== "string" || !src.trim()) return false;
  if (["/images/hero.png", "/images/about.png"].includes(src.trim())) return false;
  if (/^https?:\/\//i.test(src.trim())) return true;
  return src.trim().startsWith("/") && src.trim().length > 1;
};

function buildQuery(parts) {
  const words = parts.filter((part) => typeof part === "string" && part.trim()).join(" ")
    .replace(/https?:\/\/\S+/gi, " ").replace(/[^\p{L}\p{N}\s,-]/gu, " ").replace(/\s+/g, " ").trim();
  return words.split(" ").slice(0, 16).join(" ");
}

async function resolveSectionImages({ sectionName, variant, content = {}, sectionPrompt, websiteDescription, websiteName, context }) {
  const { sectionSchemas } = require("../sections/sectionSchemas");
  const modelSchema = sectionSchemas[sectionName];
  if (!modelSchema) return content;
  const nestedSchema = modelSchema.path("content")?.schema;
  const find = async (target, srcKey, queryKey, altKey, promptParts, options) => {
    if (!target) return;
    if (isUsableImageSource(target.object[srcKey])) {
      delete target.object[queryKey];
      return;
    }
    const query = buildQuery([target.object[queryKey], ...promptParts]);
    if (query) {
      const image = await context.findImageSafely(query, options);
      if (image?.src) {
        target.object[srcKey] = image.src;
        if (altKey) target.object[altKey] = image.alt;
        target.object.imageAttribution = image.attribution;
      }
    }
    delete target.object[queryKey];
  };

  if (sectionName === "hero" || sectionName === "about") {
    const mediaSchema = nestedSchema?.path("media")?.schema;
    if (!mediaSchema?.path("src")) return content;
    content.media ||= {};
    await find({ object: content.media, schemaPath: "media" }, "src", "imageQuery", "alt", [
      content.headline, content.subheadline, content.description, sectionPrompt, websiteDescription, websiteName,
    ], { orientation: "landscape", width: sectionName === "hero" ? 1800 : 1200, height: sectionName === "hero" ? 1000 : 900 });
    return content;
  }

  if (sectionName === "columns" && variant === "people") {
    const itemSchema = nestedSchema?.path("items")?.schema;
    if (!itemSchema?.path("image")) return content;
    const items = Array.isArray(content.items) ? content.items : [];
    for (const item of items) {
      await find({ object: item, schemaPath: "items.image" }, "image", "imageQuery", "imageAlt", [
        item.title, item.role, item.description, sectionPrompt, websiteDescription, websiteName,
      ], { orientation: "portrait", width: 700, height: 900 });
    }
  }
  return content;
}

module.exports = {
  API_URL,
  DEFAULT_TIMEOUT_MS,
  UnsplashConfigurationError,
  UnsplashApiError,
  buildImageUrl,
  createImageSearchContext,
  isUsableImageSource,
  resolveSectionImages,
};
