import sectionRegistry from "./sectionRegistry";

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
                                sectionName: section.sectionName,
                                variant: section.variant,
                                content: section.content,
                                visibility: section.visibility,
                            }}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default WebsiteRenderer;
