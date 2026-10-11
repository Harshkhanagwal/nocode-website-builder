import sectionRegistry from "./sectionRegistry";

const WebsiteRenderer = ({ website }) => {
    const sections = [...(website?.sections || [])]
        .filter((section) => section.enabled !== false)
        .sort((a, b) => a.order - b.order);

    return (
        <>
            {sections.map((section, index) => {
                const Component = sectionRegistry[section.sectionName];

                if (!Component) return null;

                return (
                    <Component 
                        key={index}
                        data={{
                            sectionName: section.sectionName,
                            variant: section.variant,
                            content: section.content,
                            visibility: section.visibility,
                        }}
                    />
                );
            })}
        </>
    );
};

export default WebsiteRenderer;