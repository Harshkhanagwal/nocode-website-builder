
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiChevronDown, FiChevronUp, FiEye, FiEyeOff, FiPlus, FiSave, FiSearch, FiTrash2, FiX } from "react-icons/fi";

import { deleteSection, updateSection } from "../../../redux/slices/sectionSlice";
import "./SectionSettings.css";

const SECTION_TITLES = {
  header: "Header Section",
  hero: "Hero Section",
  about: "About Section",
  accordion: "Accordion Section",
  columns: "Columns Section",
  contact: "Contact Section",
};

const SECTION_DESCRIPTIONS = {
  header: "Edit your logo, navigation, and header actions.",
  hero: "Edit your headline, actions, and hero media.",
  about: "Edit your introduction, highlights, and actions.",
  accordion: "Manage your FAQ content and answers.",
  columns: "Edit your feature cards and their content.",
  contact: "Manage contact details, forms, and social links.",
};

const ARRAY_TEMPLATES = {
  "header.navigation": { label: "New Link", href: "#" },
  "header.actions": { text: "Get Started", href: "#", type: "primary" },
  "hero.actions": {
    text: "Get Started",
    href: "#",
    type: "primary",
  },
  "about.highlights": {
    title: "Our Mission",
    description: "Describe your mission.",
  },
  "about.actions": {
    text: "Learn More",
    href: "/about",
    type: "primary",
  },
  "accordion.items": {
    title: "New Question",
    description: "Add an answer.",
    defaultOpen: false,
  },
  "columns.items": {
    icon: "layers",
    title: "Feature Title",
    description: "Describe this feature.",
  },
  "contact.contactDetails": {
    type: "email",
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  "contact.socialLinks": {
    platform: "instagram",
    url: "https://instagram.com/",
  },
  "contact.form.fields": {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
  },
};

const SELECT_OPTIONS = {
  "logo.type": ["text", "image"],
  type: ["primary", "secondary"],
  mediaType: ["image", "video"],
  "media.type": ["image", "video"],
  "map.type": ["embed", "link"],
  "form.fields.type": ["text", "email", "tel", "textarea", "url"],
};

const HEADER_VARIANTS = [
  "minimal-centered",
  "minimal-right",
  "centered-brand",
  "floating-solid",
  "floating-glass",
];

const SECTION_VARIANTS = {
  header: HEADER_VARIANTS,
  hero: ["split", "centered", "fullscreen-image", "cinematic-corner"],
  about: ["editorial", "minimal-typography", "timeline", "bento-grid"],
  contact: ["dark-split-screen", "terminal-code-editor", "floating-form-card", "minimal-typography"],
  accordion: ["borderless-minimal", "dark-futuristic", "rounded-cards", "two-column-faq"],
  columns: ["bento", "classic", "people", "service-cards"],
};

const LABEL_OVERRIDES = {
  eyebrow: "Eyebrow",
  headline: "Headline",
  subheadline: "Subheadline",
  description: "Description",
  href: "Link URL",
  src: "Source URL",
  alt: "Alt Text",
  icon: "Icon Name",
  defaultOpen: "Open by Default",
  additionalContent: "Additional Content",
  contactDetails: "Contact Details",
  socialLinks: "Social Links",
  successMessage: "Success Message",
  submitText: "Submit Button Text",
};

const formatLabel = (key) =>
  LABEL_OVERRIDES[key] ||
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());

const formatVariantLabel = (variant) =>
  variant
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getAtPath = (object, path) =>
  path.split(".").reduce((value, key) => value?.[key], object);

const setAtPath = (object, path, value) => {
  const keys = path.split(".");
  const result = structuredClone(object);
  let current = result;

  for (let index = 0; index < keys.length - 1; index += 1) {
    current[keys[index]] ??= {};
    current = current[keys[index]];
  }

  current[keys[keys.length - 1]] = value;
  return result;
};

const clone = (value) => structuredClone(value);

function ValueEditor({
  value,
  path,
  rootName,
  onChange,
  visibility,
  onToggleVisibility,
  sections,
  onRemove,
  canRemove = false,
}) {
  const update = (nextValue) => onChange(path, nextValue);

  if (Array.isArray(value)) {
    const templatePath = `${rootName}.${path}`;
    const template =
      ARRAY_TEMPLATES[templatePath] ||
      ARRAY_TEMPLATES[path] ||
      {};
    const maxItems = rootName === "header" && path === "navigation"
      ? 8
      : rootName === "header" && path === "actions"
        ? 2
        : Infinity;
    const canReorder = rootName === "header" && path === "navigation";

    return (
      <div className="section-settings__nested">
        <div className="section-settings__nested-header">
          <strong>{formatLabel(path.split(".").at(-1))}</strong>
          {!path.includes(".") && onToggleVisibility && (rootName !== "header" || visibility?.[path] !== undefined) && (
            <VisibilityButton
              name={path}
              visible={visibility?.[path] !== false}
              onToggle={onToggleVisibility}
            />
          )}

          <button
            type="button"
            className="section-settings__icon-button"
            onClick={() => update([...value, clone(template)])}
            disabled={value.length >= maxItems}
            aria-label={`Add ${formatLabel(path)}`}
          >
            <FiPlus /> Add
          </button>
        </div>

        {value.length === 0 && (
          <p className="section-settings__empty">
            No items added yet.
          </p>
        )}

        {value.map((item, index) => {
          const itemPath = `${path}.${index}`;

          return (
            <div className="section-settings__item" key={itemPath}>
              <div className="section-settings__item-header">
                <strong>
                  {formatLabel(path.split(".").at(-1))} {index + 1}
                </strong>

                {canReorder && (
                  <span className="section-settings__reorder">
                    <button
                      type="button"
                      className="section-settings__icon-button"
                      disabled={index === 0}
                      aria-label={`Move link ${index + 1} up`}
                      onClick={() => {
                        const next = [...value];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        update(next);
                      }}
                    ><FiChevronUp /></button>
                    <button
                      type="button"
                      className="section-settings__icon-button"
                      disabled={index === value.length - 1}
                      aria-label={`Move link ${index + 1} down`}
                      onClick={() => {
                        const next = [...value];
                        [next[index], next[index + 1]] = [next[index + 1], next[index]];
                        update(next);
                      }}
                    ><FiChevronDown /></button>
                  </span>
                )}

                <button
                  type="button"
                  className="section-settings__icon-button section-settings__delete"
                  onClick={() =>
                    update(value.filter((_, itemIndex) => itemIndex !== index))
                  }
                  aria-label={`Delete item ${index + 1}`}
                >
                  <FiTrash2 />
                </button>
              </div>

              <ValueEditor
                value={item}
                path={itemPath}
                rootName={rootName}
                onChange={onChange}
                visibility={visibility}
                onToggleVisibility={onToggleVisibility}
                sections={sections}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);

    if (/\.\d+$/.test(path)) {
      return entries.map(([key, childValue]) => (
        <ValueEditor
          key={`${path}.${key}`}
          value={childValue}
          path={`${path}.${key}`}
          rootName={rootName}
          onChange={onChange}
          visibility={visibility}
          onToggleVisibility={onToggleVisibility}
          sections={sections}
        />
      ));
    }

    return (
      <div className="section-settings__object">
        <div className="section-settings__nested-header">
          <strong>{formatLabel(path.split(".").at(-1))}</strong>
          {!path.includes(".") && onToggleVisibility && (rootName !== "header" || visibility?.[path] !== undefined) && (
            <VisibilityButton
              name={path}
              visible={visibility?.[path] !== false}
              onToggle={onToggleVisibility}
            />
          )}
        </div>

        {path === "media" && value.src && <MediaPreview media={value} />}
        {path === "logo" && value.type === "image" && value.image && (
          <MediaPreview media={{ type: "image", src: value.image, alt: value.text }} />
        )}

        {entries.map(([key, childValue]) => (
            <ValueEditor
              key={`${path}.${key}`}
              value={childValue}
              path={`${path}.${key}`}
              rootName={rootName}
              onChange={onChange}
              visibility={visibility}
              onToggleVisibility={onToggleVisibility}
              sections={sections}
            />
        ))}
      </div>
    );
  }

  const label = formatLabel(path.split(".").at(-1));
  const normalizedPath = path.replace(/\.\d+(?=\.|$)/g, "");
  const options = normalizedPath === "logo.type"
    ? SELECT_OPTIONS["logo.type"]
    : normalizedPath.endsWith("actions.type")
      ? SELECT_OPTIONS.type
      : SELECT_OPTIONS[normalizedPath];

  if (typeof value === "boolean") {
    return (
      <label className="section-settings__toggle">
        <span>{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => update(event.target.checked)}
        />
      </label>
    );
  }

  return (
    <div className="section-settings__field">
      <div className="section-settings__field-header">
        <label className="section-settings__field-label">{label}</label>
        {!path.includes(".") && onToggleVisibility && (rootName !== "header" || visibility?.[path] !== undefined) && (
          <VisibilityButton
            name={path}
            visible={visibility?.[path] !== false}
            onToggle={onToggleVisibility}
          />
        )}
      </div>

      {options ? (
        <select
          value={value ?? ""}
          onChange={(event) => update(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {formatLabel(option)}
            </option>
          ))}
        </select>
      ) : (
        <>
          <input
            value={value ?? ""}
            maxLength={1000}
            onChange={(event) => update(event.target.value)}
          />
          {["src", "image"].includes(path.split(".").at(-1)) && (
            <ImageSearchPicker onSelect={update} />
          )}
        </>
      )}

      {path.endsWith(".href") && sections?.length > 0 && (
        <label className="section-settings__link-target">
          Link to section
          <select
            value={sections.some((item) => `#section-${item._id}` === value) ? value : ""}
            onChange={(event) => {
              if (event.target.value) update(event.target.value);
            }}
          >
            <option value="">Choose a section target</option>
            {sections.map((item) => (
              <option key={item._id} value={`#section-${item._id}`}>
                {formatLabel(item.sectionName)} — {item.variant}
              </option>
            ))}
          </select>
        </label>
      )}

      {canRemove && onRemove && (
        <button type="button" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

function ImageSearchPicker({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${apiBaseUrl}/images/unsplash?query=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Image search failed.");
      setImages(data.results || []);
    } catch (searchError) {
      setError(searchError.message || "Image search failed.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className="section-settings__icon-button" onClick={() => setOpen(true)}>
        <FiSearch /> Search Unsplash
      </button>
      {open && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="image-search-title" style={{ maxWidth: "min(1100px, 96vw)", height: "min(820px, 88vh)", display: "flex", flexDirection: "column" }}>
            <header className="modal-header">
              <div>
                <h2 className="modal-title" id="image-search-title">Search Unsplash</h2>
                <p className="section-settings__description">Find an image and select it to fill the source URL.</p>
              </div>
              <button type="button" className="section-settings__icon-button" aria-label="Close image search" onClick={() => setOpen(false)}><FiX /></button>
            </header>
            <div className="modal-content" style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0, flex: 1 }}>
              <form onSubmit={search} style={{ display: "flex", gap: 8 }}>
                <input className="modal-input" aria-label="Search images" placeholder="Try: modern architecture, mountain lake..." value={query} onChange={(event) => setQuery(event.target.value)} />
                <button className="section-settings__save" type="submit" disabled={loading || !query.trim()}>{loading ? "Searching…" : "Search"}</button>
              </form>
              {error && <p className="section-settings__error">{error}</p>}
              <div style={{ overflowY: "auto", minHeight: 0, flex: 1 }}>
                {images.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
                    {images.map((image) => (
                      <button key={image.id} type="button" onClick={() => { onSelect(image.url); setOpen(false); }} aria-label={`Select photo by ${image.author}`} style={{ padding: 0, border: "1px solid var(--color-border)", borderRadius: 10, overflow: "hidden", textAlign: "left", background: "var(--color-surface)", cursor: "pointer" }}>
                        <img src={image.thumb} alt={image.description || "Unsplash result"} style={{ display: "block", width: "100%", height: 170, objectFit: "cover" }} />
                        <span style={{ display: "block", padding: "8px 10px", color: "var(--color-text-secondary)", fontSize: 11 }}>Photo by {image.author} on Unsplash</span>
                      </button>
                    ))}
                  </div>
                ) : !loading && !error ? <p className="section-settings__empty">Search for an image to see results here.</p> : null}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function VisibilityButton({ name, visible, onToggle }) {
  return (
    <button
      type="button"
      className={`section-settings__visibility ${visible ? "is-visible" : ""}`}
      onClick={() => onToggle(name)}
      aria-label={`${visible ? "Hide" : "Show"} ${formatLabel(name)}`}
      title={visible ? "Hide on website" : "Show on website"}
    >
      {visible ? <FiEye /> : <FiEyeOff />}
    </button>
  );
}

function MediaPreview({ media }) {
  const [failedSrc, setFailedSrc] = useState("");

  return (
    <div className="section-settings__media-preview">
      {media.type === "video" ? (
        <video src={media.src} controls preload="metadata" />
      ) : failedSrc === media.src ? (
        <div className="section-settings__media-fallback">
          Preview unavailable. Check the image URL.
        </div>
      ) : (
        <img
          src={media.src}
          alt={media.alt || "Media preview"}
          onError={() => setFailedSrc(media.src)}
        />
      )}
    </div>
  );
}

export default function SectionSettings({
  section,
  sections = [],
  websiteId,
  onChange,
  onSave,
  onDeleteSection,
}) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!section) return null;

  const sectionName = section.sectionName;
  const content = section.content || {};
  const variantOptions = SECTION_VARIANTS[sectionName] || [];
  const currentVariant = section.variant || variantOptions[0] || "default";
  const availableVariants = variantOptions.includes(currentVariant)
    ? variantOptions
    : [currentVariant, ...variantOptions];
  const visibility = sectionName === "header"
    ? {
      ...(section.visibility || {}),
      logo: content.logo?.visibility !== false,
      navigation: content.settings?.showNavigation !== false,
      actions: content.settings?.showActions !== false,
    }
    : section.visibility || {};

  const updateContent = (path, value) => {
    const updatedContent = setAtPath(content, path, value);

    onChange({
      ...section,
      content: updatedContent,
    });

    setSaveSuccess(false);
    setSaveError("");
  };

  const toggleVisibility = (key) => {
    if (sectionName === "header" && key === "logo") {
      onChange({
        ...section,
        content: {
          ...content,
          logo: { ...(content.logo || {}), visibility: content.logo?.visibility === false },
        },
      });
      setSaveSuccess(false);
      setSaveError("");
      return;
    }
    if (sectionName === "header" && (key === "navigation" || key === "actions")) {
      const setting = key === "navigation" ? "showNavigation" : "showActions";
      onChange({
        ...section,
        content: {
          ...content,
          settings: {
            ...(content.settings || {}),
            [setting]: content.settings?.[setting] === false,
          },
        },
      });
      setSaveSuccess(false);
      setSaveError("");
      return;
    }
    onChange({
      ...section,
      visibility: { ...visibility, [key]: visibility[key] === false },
    });
    setSaveSuccess(false);
    setSaveError("");
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      setSaveError("");
      setSaveSuccess(false);

      const result = await dispatch(
        updateSection({
          websiteId,
          sectionName,
          sectionId: section._id,
          data: {
            variant: section.variant,
            enabled: sectionName === "header" ? true : section.enabled,
            order: sectionName === "header" ? 0 : section.order,
            content: section.content,
            visibility: section.visibility || {},
          },
        })
      ).unwrap();

      setSaveSuccess(true);
      onSave?.(result);
    } catch (error) {
      setSaveError(
        typeof error === "string"
          ? error
          : "Failed to save section changes."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeSection = async () => {
    const confirmed = window.confirm(
      `Delete this ${formatLabel(sectionName)} section? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      setSaveError("");
      await dispatch(
        deleteSection({
          websiteId,
          sectionName,
          sectionId: section._id,
        })
      ).unwrap();
      onDeleteSection?.(section._id);
    } catch (error) {
      setSaveError(
        typeof error === "string" ? error : "Failed to delete this section."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="section-settings">
      <header className="section-settings__intro">
        <span className="section-settings__eyebrow">
          SECTION SETTINGS
        </span>

        <h3 className="section-settings__title">
          {SECTION_TITLES[sectionName] || formatLabel(sectionName)}
        </h3>

        <p className="section-settings__description">
          {SECTION_DESCRIPTIONS[sectionName] ||
            "Edit this section's content."}
        </p>
      </header>

      <div className="section-settings__meta">
        <label className="section-settings__meta-variant">
          <span>Layout variant</span>
          {availableVariants.length > 0 ? (
            <select
              value={currentVariant}
              onChange={(event) => onChange({
                ...section,
                variant: event.target.value,
                ...(sectionName === "header" ? { enabled: true, order: 0 } : {}),
              })}
            >
              {availableVariants.map((variant) => (
                <option key={variant} value={variant}>{formatVariantLabel(variant)}</option>
              ))}
            </select>
          ) : (
            <input value={section.variant || "default"} readOnly />
          )}
        </label>

        {sectionName !== "header" && <label className="section-settings__meta-enabled">
          <span>Enabled</span>
          <input
            type="checkbox"
            checked={section.enabled !== false}
            onChange={(event) =>
              onChange({
                ...section,
                enabled: event.target.checked,
              })
            }
          />
        </label>}
      </div>

      <section className="section-settings__group">
        <div className="section-settings__group-header">
          Content
        </div>

        <div className="section-settings__group-body">
          {Object.entries(content).map(([key, value]) => (
            <ValueEditor
              key={key}
              value={value}
              path={key}
              rootName={sectionName}
              onChange={updateContent}
              visibility={visibility}
              onToggleVisibility={toggleVisibility}
              sections={sections}
            />
          ))}
        </div>
      </section>

      {saveError && (
        <p className="section-settings__error">{saveError}</p>
      )}

      {saveSuccess && (
        <p className="section-settings__success">
          Section saved successfully.
        </p>
      )}

      <div className="section-settings__actions">
        <button
          type="button"
          className="section-settings__save"
          disabled={saving || deleting}
          onClick={saveChanges}
        >
          <FiSave />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {sectionName !== "header" && <button
          type="button"
          className="section-settings__remove-section"
          disabled={saving || deleting}
          onClick={removeSection}
        >
          <FiTrash2 />
          {deleting ? "Deleting..." : "Delete Section"}
        </button>}
      </div>
    </div>
  );
}
