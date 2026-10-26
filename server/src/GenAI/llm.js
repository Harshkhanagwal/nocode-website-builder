const Groq = require("groq-sdk");
const { z } = require("zod");
const { websiteGenerationSchema } = require("./websiteGenerationSchema");
const exampleWebsite = require("./exampleWebsite.json");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const MAX_RETRIES = 2;

const { $schema, ...websiteJsonSchema } = z.toJSONSchema(websiteGenerationSchema);


const sectionCatalog = {
  header: {
    variants: ["minimal-right"],
    purpose: "Navigation and branding",
  },
  hero: {
    variants: ["centered", "split"],
    purpose: "The main introduction and primary call to action",
  },
  about: {
    variants: [
      "editorial",
      "minimal-typography",
      "timeline",
      "bento-grid",
    ],
    purpose: "About, story, background, or approach",
  },
  columns: {
    variants: ["bento", "classic", "people", "service-cards"],
    purpose: "Services, features, skills, or team",
  },
  accordion: {
    variants: [
      "borderless-minimal",
      "dark-futuristic",
      "rounded-cards",
      "two-column-faq",
    ],
    purpose: "Frequently asked questions or expandable information",
  },
  contact: {
    variants: [
      "dark-split-screen",
      "terminal-code-editor",
      "floating-form-card",
      "minimal-typography",
    ],
    purpose: "Contact details and an optional contact form",
  },
};

const SYSTEM_PROMPT = `
You are an AI website designer and content generator for a no-code
website builder.

Generate a website tailored to the user's request. Do not copy a
fixed example website or use a fixed section count.

AVAILABLE COMPONENTS:
${JSON.stringify(sectionCatalog, null, 2)}

DESIGN RULES:
1. Choose sections based on the user's business, purpose, audience,
   and requested features.
2. Always include one header and one hero.
3. Select an appropriate supported variant for every section.
4. Add only relevant sections. Do not add sections just to fill space.
5. Do not repeat the same content or section purpose.
6. Write specific, realistic copy instead of generic placeholder text.
7. Return a stable, unique id for each section.
8. Use the section ids as targets for internal navigation.
9. Every internal href must point to a section that exists.
10. Never use "#" as a final link destination.
11. Do not invent React component names, section types, or variants.
12. For images, return an image search query and descriptive alt text.
    Do not invent image URLs or use local placeholder paths.
13. Choose a visual direction that fits the user's request.
14. Return JSON only, matching the supplied output schema.

SCHEMA REQUIREMENTS:
- Every required field in the schema must be present.
- Never omit keys, even when their values are empty.
- Use "" for unused string fields.
- Use [] for unused array fields.
- Use false for unused boolean fields.
- For an about section, always include href and highlights.
- For every section, follow its exact content schema.
- Before returning JSON, verify that all required fields are present.
`;


module.exports = { SYSTEM_PROMPT, sectionCatalog };



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