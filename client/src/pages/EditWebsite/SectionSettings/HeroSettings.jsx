import { FiEye, FiEyeOff, FiSave } from "react-icons/fi";

/**
 * Controlled component: NO local draft.
 * `section` comes from EditWebsite's draft (localWebsite), and every edit
 * calls onChange(newSection) so the draft + live preview update immediately.
 */
const HeroSettings = ({ section, onChange, onSave, saving = false }) => {
    if (!section) return null;

    const content = section.content || {};
    const visibility = section.visibility || {};

    // Helper: build a new section object and send it up
    const emit = (patch) => onChange({ ...section, ...patch });

    const updateContent = (key, value) => {
        emit({ content: { ...content, [key]: value } });
    };

    const updateVisibility = (key, value) => {
        emit({ visibility: { ...visibility, [key]: value } });
    };

    const updateMedia = (key, value) => {
        emit({
            content: {
                ...content,
                media: { ...content.media, [key]: value },
            },
        });
    };

    const updateArrayItem = (key, index, field, value) => {
        emit({
            content: {
                ...content,
                [key]: (content[key] || []).map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                ),
            },
        });
    };

    const toggleItem = (key, index) => {
        const item = (content[key] || [])[index];
        if (!item) return;
        updateArrayItem(key, index, "enabled", item.enabled === false);
    };

    const renderVisibility = (key, isVisible = visibility[key] !== false) => (
        <button
            type="button"
            className={`section-settings__visibility ${isVisible ? "is-visible" : ""}`}
            onClick={() => {
                if (key.startsWith("item:")) {
                    const [, arrayKey, index] = key.split(":");
                    toggleItem(arrayKey, Number(index));
                } else {
                    updateVisibility(key, !isVisible);
                }
            }}
            aria-label={isVisible ? `Hide ${key}` : `Show ${key}`}
            title={isVisible ? "Hide on website" : "Show on website"}
        >
            {isVisible ? <FiEye /> : <FiEyeOff />}
        </button>
    );

    const renderField = (label, key, options = {}) => (
        <div className="section-settings__field" key={key}>
            <div className="section-settings__field-header">
                <label
                    className="section-settings__field-label"
                    htmlFor={`hero-${key}`}
                >
                    {label}
                </label>
                {renderVisibility(key)}
            </div>

            {options.multiline ? (
                <textarea
                    id={`hero-${key}`}
                    value={content[key] ?? ""}
                    maxLength={options.maxLength}
                    rows={3}
                    placeholder={options.placeholder || ""}
                    onChange={(e) => updateContent(key, e.target.value)}
                />
            ) : (
                <input
                    id={`hero-${key}`}
                    value={content[key] ?? ""}
                    maxLength={options.maxLength}
                    placeholder={options.placeholder || ""}
                    onChange={(e) => updateContent(key, e.target.value)}
                />
            )}
        </div>
    );

    const renderGroupVisibility = (key) => (
        <div className="section-settings__field-header">
            <span className="section-settings__field-label">Visibility</span>
            {renderVisibility(key)}
        </div>
    );

    return (
        <div className="section-settings">
            <div className="section-settings__intro">
                <span className="section-settings__eyebrow">SECTION SETTINGS</span>
                <h3 className="section-settings__title">Hero Section</h3>
                <p className="section-settings__description">
                    Edit the content and appearance of this hero.
                </p>
            </div>

            {/* Text Content */}
            <section className="section-settings__group">
                <div className="section-settings__group-header">
                    <span>Text Content</span>
                </div>

                <div className="section-settings__group-body">
                    {renderField("Eyebrow", "eyebrow", { maxLength: 100 })}
                    {renderField("Headline", "headline", {
                        maxLength: 200,
                        multiline: true,
                    })}
                    {renderField("Subheadline", "subheadline", {
                        maxLength: 250,
                        multiline: true,
                    })}
                    {renderField("Description", "description", {
                        maxLength: 1000,
                        multiline: true,
                    })}
                </div>
            </section>

            {/* Buttons & Links */}
            <section className="section-settings__group">
                <div className="section-settings__group-header">
                    <span>Buttons & Links</span>
                </div>

                <div className="section-settings__group-body">
                    {renderGroupVisibility("actions")}

                    {(content.actions || []).map((action, index) => (
                        <div className="section-settings__item" key={index}>
                            <div className="section-settings__item-header">
                                <strong>Button {index + 1}</strong>
                                {renderVisibility(
                                    `item:actions:${index}`,
                                    action.enabled !== false
                                )}
                            </div>

                            <div className="section-settings__field">
                                <label className="section-settings__field-label">
                                    Button text
                                </label>
                                <input
                                    value={action.text || ""}
                                    maxLength={50}
                                    onChange={(e) =>
                                        updateArrayItem("actions", index, "text", e.target.value)
                                    }
                                />
                            </div>

                            <div className="section-settings__field">
                                <label className="section-settings__field-label">
                                    Link URL
                                </label>
                                <input
                                    value={action.href || ""}
                                    maxLength={500}
                                    onChange={(e) =>
                                        updateArrayItem("actions", index, "href", e.target.value)
                                    }
                                />
                            </div>

                            <div className="section-settings__field">
                                <label className="section-settings__field-label">
                                    Button type
                                </label>
                                <select
                                    value={action.type || "primary"}
                                    onChange={(e) =>
                                        updateArrayItem("actions", index, "type", e.target.value)
                                    }
                                >
                                    <option value="primary">Primary</option>
                                    <option value="secondary">Secondary</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Hero Media */}
            <section className="section-settings__group">
                <div className="section-settings__group-header">
                    <span>Hero Media</span>
                </div>

                <div className="section-settings__group-body">
                    {renderGroupVisibility("media")}

                    <div className="section-settings__field">
                        <label className="section-settings__field-label">
                            Media type
                        </label>
                        <select
                            value={content.media?.type || "image"}
                            onChange={(e) => updateMedia("type", e.target.value)}
                        >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                    </div>

                    <div className="section-settings__field">
                        <label className="section-settings__field-label">
                            {content.media?.type === "video" ? "Video URL" : "Image URL"}
                        </label>
                        <input
                            value={content.media?.src || ""}
                            maxLength={1000}
                            onChange={(e) => updateMedia("src", e.target.value)}
                        />
                    </div>

                    <div className="section-settings__field">
                        <label className="section-settings__field-label">Alt text</label>
                        <input
                            value={content.media?.alt || ""}
                            maxLength={250}
                            onChange={(e) => updateMedia("alt", e.target.value)}
                        />
                    </div>

                    {(content.media?.type || "image") === "image" && content.media?.src && (
                        <div className="section-settings__media-preview">
                            <img
                                src={content.media.src}
                                alt={content.media.alt || "Hero image preview"}
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                                onLoad={(e) => {
                                    e.currentTarget.style.display = "block";
                                }}
                            />
                            <span className="section-settings__media-preview-label">
                                Image preview
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Saves the whole draft held in EditWebsite */}
            <button
                type="button"
                className="section-settings__add-button"
                disabled={saving}
                onClick={() => onSave?.()}
            >
                <FiSave />
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
};

export default HeroSettings;