const Groq = require("groq-sdk");

const MAX_RETRIES = 2;

const isRetryable = (error) => {
  const status = error?.status || error?.statusCode;
  return !status || status === 408 || status === 429 || status >= 500;
};

async function completeJson({ system, user, schema, label }) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      if (!process.env.GROQ_API_KEY) throw new Error("Groq API is not configured");
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature: 0.4,
        max_completion_tokens: 4096,
        ...(String(process.env.GROQ_MODEL || "openai/gpt-oss-20b").startsWith("openai/gpt-oss") && { reasoning_effort: "low" }),
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${system}\nReturn one valid JSON object matching this schema: ${JSON.stringify(schema.toJSONSchema())}` },
          { role: "user", content: user },
        ],
      });
      const content = completion.choices?.[0]?.message?.content;
      if (!content) throw new Error("The model returned an empty response");
      return schema.parse(JSON.parse(content));
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_RETRIES || !isRetryable(error)) break;
    }
  }

  const error = new Error(`Could not generate ${label}`);
  error.cause = lastError;
  error.code = "GENERATION_FAILED";
  throw error;
}

module.exports = { completeJson };
