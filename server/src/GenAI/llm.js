const Groq = require("groq-sdk");
const { z } = require("zod");
const { websiteGenerationSchema } = require("./websiteGenerationSchema");
const exampleWebsite = require("./exampleWebsite.json");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const MAX_RETRIES = 2;

const { $schema, ...websiteJsonSchema } = z.toJSONSchema(websiteGenerationSchema);

const SYSTEM_PROMPT = `You are a website content generator for a no-code website builder.
Using the website name and the user's request, return the complete website as a single JSON object.

Below is an EXAMPLE of the exact structure to return. Copy its structure, key names, sectionName and variant values, and section order exactly. Replace ALL of the example text (names, headlines, descriptions, projects, etc.) with new content tailored to the user's request.

EXAMPLE:
${JSON.stringify(exampleWebsite)}

Rules:
- Return exactly the same 7 sections, in the same order, with the same keys as the example. Never omit a key or an object (header.content.settings and hero.visibility are required).
- Use "" for unused string fields and [] for unused arrays (hero.features and testimonials.items may stay []).
- Allowed values: action type is "primary" or "secondary"; form field type is "text", "email" or "textarea"; media type is "image" or "video".
- Header navigation hrefs must match the section anchors (#home, #about, #projects, #contact).
- For images use placeholder paths like /images/hero.png, /images/about.png, /images/project-1.png.
- For contact details and social links use example values (hello@example.com, https://github.com/example).
- Write realistic, ready-to-publish copy. No "Lorem ipsum".
- Respond with the JSON object only.`;

function summarizeIssues(issues, prefix = []) {
  const lines = [];
  for (const issue of issues) {
    const path = [...prefix, ...issue.path];
    if (issue.code === "invalid_union" && Array.isArray(issue.errors) && issue.errors.length) {
      const closest = issue.errors.reduce((a, b) => (b.length < a.length ? b : a));
      lines.push(...summarizeIssues(closest, path));
    } else {
      lines.push(`${path.join(".") || "(root)"}: ${issue.message}`);
    }
  }
  return lines;
}

// Set to false automatically if the chosen model rejects json_schema
let useJsonSchema = true;

function buildRequest(messages) {
  return {
    model: MODEL,
    temperature: 0.4,
    messages,
    // The website JSON is long. A low limit (or reasoning tokens eating the budget)
    // can leave the output empty/cut off, which Groq reports as json_validate_failed.
    max_completion_tokens: 8192,
    // Reasoning models (gpt-oss) spend tokens "thinking" first; keep that small.
    ...(MODEL.startsWith("openai/gpt-oss") && { reasoning_effort: "low" }),
    response_format: useJsonSchema
      ? { type: "json_schema", json_schema: { name: "website", schema: websiteJsonSchema } }
      : { type: "json_object" }, // fallback: plain JSON mode, structure comes from the example
  };
}

/**
 * Generates the website JSON.
 *
 * @param {Object} params
 * @param {string} params.prompt       - what the user wants (business, tone, audience ...)
 * @param {string} params.websiteName  - name of the website
 * @returns {Promise<Object>} JSON that matches websiteGenerationSchema
 */
async function generateWebsite({ prompt, websiteName }) {
  if (!prompt?.trim() || !websiteName?.trim()) {
    throw new Error("Both prompt and websiteName are required.");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Website name: ${websiteName}\n\nUser request: ${prompt}` },
  ];

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let content;

    try {
      const completion = await groq.chat.completions.create(buildRequest(messages));
      content = completion.choices[0].message.content;

      let parsed = JSON.parse(content);

      // Some models return just the sections array - wrap it into the expected object
      if (Array.isArray(parsed)) {
        parsed = { name: websiteName, sections: parsed };
      }

      // Final safety check with zod (throws if the shape is wrong)
      const website = websiteGenerationSchema.parse(parsed);

      // Make sure order is always 0, 1, 2 ... in the sequence returned
      website.sections = website.sections.map((section, index) => ({
        ...section,
        order: index,
      }));

      return website;
    } catch (err) {
      let reason = err.message;

      if (Array.isArray(err.issues)) {
        // Validation failed: tell the model exactly what to fix on the next attempt
        reason = summarizeIssues(err.issues).join("; ");
        messages.push({
          role: "user",
          content: `Your previous JSON was invalid: ${reason}. Return the complete corrected JSON object.`,
        });
        // Helps debugging: see what the model actually returned
        console.error("Raw model output (first 1500 chars):", content?.slice(0, 1500));
      }

      lastError = new Error(reason);
      console.error(`LLM attempt ${attempt + 1} failed:`, reason);

      // json_schema not supported / failed on this model -> switch to json_object and retry
      if (
        useJsonSchema &&
        /does not support response format|json_validate_failed/i.test(err.message)
      ) {
        useJsonSchema = false;
      }
    }
  }

  throw new Error(`Failed to generate website JSON: ${lastError?.message}`);
}

// Express controller (used in routes/llmRoutes.js)
const llm = async (req, res) => {
    const { prompt, websiteName } = req.body || {};

    if (!prompt || !websiteName) {
        return res.status(400).json({
            success: false,
            message: "prompt and websiteName are required"
        });
    }

    try {
        const website = await generateWebsite({ prompt, websiteName });

        return res.status(200).json({
            success: true,
            message: `Website generated successfully for ${websiteName}`,
            data: website
        });
    } catch (err) {
        console.error("Website generation failed:", err.message);

        return res.status(500).json({
            success: false,
            message: "Failed to generate website",
            error: err.message
        });
    }
};

module.exports = { llm };