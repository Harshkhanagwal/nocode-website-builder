import sectionRegistry from "./sectionRegistry";
import { submitContactForm } from "../api/contactSubmissionApi";

const WebsiteRenderer = ({ website }) => {
    const sections = [...(website?.sections || [])]
        .filter((section) => section.enabled !== false)
        .sort((a, b) => a.order - b.order);

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
