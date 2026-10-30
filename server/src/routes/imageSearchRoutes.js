const express = require("express");

const router = express.Router();

router.get("/unsplash", async (req, res, next) => {
  const query = String(req.query.query || "").trim();
  if (!query) return res.status(400).json({ message: "A search query is required." });
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return res.status(503).json({ message: "Unsplash image search needs an API key. Create a free Unsplash developer app, add its Access Key as UNSPLASH_ACCESS_KEY in server/.env, then restart the server." });
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "24");
    url.searchParams.set("content_filter", "high");
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });
    if (!response.ok) {
      return res.status(response.status === 429 ? 429 : 502).json({ message: "Unsplash could not complete the image search." });
    }
    const payload = await response.json();
    res.json({
      results: (payload.results || []).map((image) => ({
        id: image.id,
        url: image.urls?.regular || image.urls?.full,
        thumb: image.urls?.small || image.urls?.thumb,
        author: image.user?.name || "Unsplash contributor",
        description: image.alt_description || image.description || "",
      })).filter((image) => image.url && image.thumb),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
