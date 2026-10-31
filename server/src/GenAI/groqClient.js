const Groq = require("groq-sdk");

const MAX_RETRIES = 2;

const isRetryable = (error) => {
  const status = error?.status || error?.statusCode;
  return !status || status === 408 || status === 429 || status >= 500;
};

async function completeJson({ system, user, schema, label, normalize, temperature = 0.4 }) {
  let lastError;
  const messages = [
    { role: "system", content: `${system}\nReturn one valid JSON object matching this schema: ${JSON.stringify(schema.toJSONSchema())}` },
    { role: "user", content: user },
  ];
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      if (!process.env.GROQ_API_KEY) throw new Error("Groq API is not configured");
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature,
        max_completion_tokens: 4096,
        ...(String(process.env.GROQ_MODEL || "openai/gpt-oss-20b").startsWith("openai/gpt-oss") && { reasoning_effort: "low" }),
        response_format: { type: "json_object" },
        messages,
      });
      const content = completion.choices?.[0]?.message?.content;
      if (!content) throw new Error("The model returned an empty response");
      const parsed = JSON.parse(content);
      return schema.parse(normalize ? normalize(parsed) : parsed);
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_RETRIES || !isRetryable(error)) break;
      if (Array.isArray(error.issues)) {
        const corrections = error.issues.slice(0, 20).map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`).join("; ");
        messages.push({ role: "user", content: `Your last JSON did not meet the required section contract: ${corrections}. Return the complete corrected JSON. Keep the content specific to the original planner brief.` });
      } else if (error instanceof SyntaxError) {
        messages.push({ role: "user", content: "Your last response was not valid JSON. Return one complete valid JSON object matching the schema and the original planner brief." });
      }
    }
  }

  const error = new Error(`Could not generate ${label}`);
  error.cause = lastError;
  error.code = "GENERATION_FAILED";
  if (Array.isArray(lastError?.issues)) {
    error.validationDetails = lastError.issues.slice(0, 12).map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  throw error;
}

module.exports = { completeJson };
