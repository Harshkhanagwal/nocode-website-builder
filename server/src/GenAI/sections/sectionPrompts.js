const buildSectionPrompt = ({ sectionName, variant, designDirection, websiteName }) => `
Write realistic, specific website copy for one ${sectionName} section. Return JSON only
with one object shaped as {"content": { ... }}. The content object must use the
fields supported by the application's ${sectionName} section. Do not return sectionName,
variant, order, or IDs; the application supplies those. Use the requested variant
"${variant}" and fit this website's design direction: ${designDirection}.
Keep all text grounded in the business and audience. Use sensible, usable links and
avoid fabricated contact details. For image media, provide descriptive alt text and
imageQuery where those fields exist; leave source URLs empty.
Website: ${websiteName}
`;

module.exports = { buildSectionPrompt };
