import sectionRegistry from "./sectionRegistry";
import { submitContactForm } from "../api/contactSubmissionApi";
import "./WebsiteRenderer.css";

const WebsiteRenderer = ({ website }) => {
    const sections = [...(website?.sections || [])]
        .filter((section) => section.enabled !== false)
        .sort((a, b) => a.order - b.order);

    const aliasesBySection = new Map(sections.map((section) => [String(section._id), new Set()]));
    const sectionByAlias = new Map();
    const addAlias = (section, value) => {
        const alias = value?.replace(/^#/, "").trim().toLowerCase();
        if (!alias) return;

        aliasesBySection.get(String(section._id))?.add(alias);
        sectionByAlias.set(alias, section);
    };

    // Stable, human-readable anchors make generated navigation work even though
    // database IDs are assigned only after the website is generated.
    const sectionAliases = {
        hero: ["home"],
        about: ["about"],
        accordion: ["faq", "faqs"],
        contact: ["contact"],
    };

    sections.forEach((section) => {
        sectionAliases[section.sectionName]?.forEach((alias) => addAlias(section, alias));
        addAlias(section, section.content?.href);
    });

    // Generated header links often use terms such as "projects" or "services".
    // Match those to section copy when its own href did not already declare an alias.
    const headers = sections.filter((section) => section.sectionName === "header");
    headers.forEach((header) => {
        const links = [
            ...(header.content?.navigation || []),
            ...(header.content?.actions || []),
        ];

        links.forEach((link) => {
            const alias = link.href?.replace(/^#/, "").trim().toLowerCase();
            if (!alias || sectionByAlias.has(alias)) return;

            const searchableAlias = alias.replace(/[-_]/g, " ");
            let target = sections.find((section) => section.sectionName === alias);

            if (!target) {
                target = sections.find((section) => {
                    const copy = JSON.stringify(section.content || {}).toLowerCase().replace(/[-_]/g, " ");
                    return copy.includes(searchableAlias);
                });
            }

            if (!target && /project|work|service|feature|offering/.test(alias)) {
                target = sections.find((section) => section.sectionName === "columns");
            }

            if (target) addAlias(target, alias);
        });
    });

    return (
        <>
            {sections.map((section) => {
                const Component = sectionRegistry[section.sectionName];

                if (!Component) return null;

                return (
                    <div
                        key={section._id}
                        id={`section-${section._id}`}
                        className="website-section-anchor"
                        style={{ width: "100%", scrollMarginTop: "24px" }}
                    >
                        {[...(aliasesBySection.get(String(section._id)) || [])].map((alias) => (
                            <span
                                key={alias}
                                id={alias}
                                className="website-section-anchor__alias"
                                aria-hidden="true"
                            />
                        ))}
                        <Component
                            data={{
                                websiteId: website?._id,
                                sectionId: section._id,
                                sectionName: section.sectionName,
                                variant: section.variant,
                                content: section.content,
                                visibility: section.visibility,
                            }}
                            onSubmit={section.sectionName === "contact"
                                ? (fields) => submitContactForm(website?._id, fields)
                                : undefined}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default WebsiteRenderer;
