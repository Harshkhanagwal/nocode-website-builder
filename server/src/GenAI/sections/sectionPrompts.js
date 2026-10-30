const buildSectionPrompt = ({ sectionName, variant, designDirection, websiteName }) => `
You are writing final website content, not sample or placeholder content. Follow the
planner's section brief exactly and use its business, audience, services, location,
tone, and requirements wherever supplied. Do not substitute generic website-builder
copy. Every field required by the supplied JSON schema must be present and populated
with content appropriate to this exact business. Empty arrays are allowed only when
the brief gives no truthful items for that field; never omit a key to invite defaults.

Return JSON only as {"content": {...}}. Do not return sectionName, variant, order, or
IDs. Section type is ${sectionName}; use variant "${variant}". Design direction:
${designDirection}. Website name: ${websiteName}.

For hero and about sections, write their image alt text and a concrete media.imageQuery
for a relevant photo; leave media.src empty for backend Unsplash resolution. For
columns variant "people", write a distinct role and imageQuery for every person item
and leave image empty. For other columns variants, include role/image/imageQuery keys
as empty strings unless the planner brief explicitly calls for people. Never invent
real contact details, testimonials, addresses, or facts. Make copy clear, specific,
grammatical, and ready to publish.
`;

module.exports = { buildSectionPrompt };
