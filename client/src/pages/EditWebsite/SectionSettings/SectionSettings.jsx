
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiEye, FiEyeOff, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";

import { deleteSection, updateSection } from "../../../redux/slices/sectionSlice";
import "./SectionSettings.css";

const SECTION_TITLES = {
  hero: "Hero Section",
  about: "About Section",
  accordion: "Accordion Section",
  columns: "Columns Section",
  contact: "Contact Section",
};

const SECTION_DESCRIPTIONS = {
  hero: "Edit your headline, actions, and hero media.",
  about: "Edit your introduction, highlights, and actions.",
  accordion: "Manage your FAQ content and answers.",
  columns: "Edit your feature cards and their content.",
  contact: "Manage contact details, forms, and social links.",
};

const ARRAY_TEMPLATES = {
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
  type: ["primary", "secondary"],
  mediaType: ["image", "video"],
  "media.type": ["image", "video"],
  "map.type": ["embed", "link"],
  "form.fields.type": ["text", "email", "tel", "textarea", "url"],
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

    return (
      <div className="section-settings__nested">
        <div className="section-settings__nested-header">
          <strong>{formatLabel(path.split(".").at(-1))}</strong>
          {!path.includes(".") && onToggleVisibility && (
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
          {!path.includes(".") && onToggleVisibility && (
            <VisibilityButton
              name={path}
              visible={visibility?.[path] !== false}
              onToggle={onToggleVisibility}
            />
          )}
        </div>

        {path === "media" && value.src && <MediaPreview media={value} />}

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
  const options = normalizedPath.endsWith("actions.type")
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
        {!path.includes(".") && onToggleVisibility && (
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
        <input
          value={value ?? ""}
          maxLength={1000}
          onChange={(event) => update(event.target.value)}
        />
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
  const visibility = section.visibility || {};

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
            enabled: section.enabled,
            order: section.order,
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
          <input value={section.variant || "default"} readOnly />
        </label>

        <label className="section-settings__meta-enabled">
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
        </label>
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
        <button
          type="button"
          className="section-settings__remove-section"
          disabled={saving || deleting}
          onClick={removeSection}
        >
          <FiTrash2 />
          {deleting ? "Deleting..." : "Delete Section"}
        </button>
      </div>
    </div>
  );
}
