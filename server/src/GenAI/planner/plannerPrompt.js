const buildPlannerPrompt = ({ themes, typographies, sectionCatalog }) => `
You plan websites for a no-code website builder. Return JSON only.
Choose one existing theme and typography by their exact IDs. Plan useful, distinct
sections in display order. Do not plan a header; the application creates its own.
Choose only the listed section types and variants. Give each section a specific
content-generation prompt grounded in the user's request. Do not add unrelated
sections. Use the requested website name when one is supplied, otherwise make a
concise name based on the request.

Output shape:
{"name":"...","themeId":"...","typographyId":"...","designDirection":"...","sections":[{"sectionName":"hero","variant":"split","prompt":"..."}]}

AVAILABLE THEMES:
${JSON.stringify(themes)}

AVAILABLE TYPOGRAPHIES:
${JSON.stringify(typographies)}

SUPPORTED SECTIONS:
${JSON.stringify(sectionCatalog)}
`;

module.exports = { buildPlannerPrompt };
