import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchColorThemes } from "../../../redux/slices/colorThemeSlice";
import { fetchTypographies } from "../../../redux/slices/typographySlice";
import { saveWebsiteSettings } from "../../../redux/slices/projectSlice";
import "../CreateWebsitePopup/CreateWebsitePopup.css";
import "./ThemeSettingsPopup.css";

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const ThemeSettingsPopup = ({ website, onClose, onSaved }) => {
  const [tab, setTab] = useState("general");
  const [name, setName] = useState(website.name || "");
  const [slug, setSlug] = useState(website.slug || "");
  const [slugEdited, setSlugEdited] = useState(false);
  const [themeId, setThemeId] = useState(website.theme?._id || website.theme || "");
  const [typographyId, setTypographyId] = useState(website.typography?._id || website.typography || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { themes, loading, error: themesError } = useSelector((state) => state.colorThemes);
  const { typographies, loading: typographyLoading, error: typographyError } = useSelector((state) => state.typography);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchColorThemes());
    dispatch(fetchTypographies());
  }, [dispatch]);

  const save = async () => {
    if (name.trim().length < 3 || name.trim().length > 35) { setTab("general"); setError("Website name must be 3–35 characters."); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) { setTab("general"); setError("Use lowercase letters, numbers, and single hyphens for the slug."); return; }
    setSaving(true); setError("");
    try {
      const updatedWebsite = await dispatch(saveWebsiteSettings({ id: website._id, name: name.trim(), slug, theme: themeId, typography: typographyId })).unwrap();
      if (onSaved) onSaved(updatedWebsite);
      else onClose();
    } catch (saveError) { setError(saveError); }
    finally { setSaving(false); }
  };

  return <div className="modal-overlay settings-overlay" onClick={onClose}>
    <section className="create-website-modal settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()}>
      <header className="create-modal-header">
        <div className="create-modal-heading"><span className="create-modal-eyebrow">Website settings</span><h2 className="create-modal-title" id="settings-title">Theme Settings</h2><p className="create-modal-description">Update your website details, colors, and typography.</p></div>
        <button className="settings-close" type="button" onClick={onClose} aria-label="Close settings">×</button>
      </header>
      <nav className="settings-tabs" role="tablist" aria-label="Website settings">
        {[ ["general", "General info"], ["colors", "Color theme"], ["type", "Typography"] ].map(([key, label]) => <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "active" : ""} onClick={() => { setTab(key); setError(""); }}>{label}</button>)}
      </nav>
      <div className="settings-content">
        {tab === "general" && <div className="settings-general">
          <div className="create-field"><label className="create-field-label" htmlFor="settings-name">Website name</label><div className="create-input-wrapper"><input id="settings-name" className="create-website-input" value={name} maxLength={35} onChange={(event) => { setName(event.target.value); if (!slugEdited) setSlug(slugify(event.target.value)); }} /><span className="create-input-counter">{name.length}/35</span></div><p className="create-field-hint">This name appears in your dashboard and website header.</p></div>
          <div className="create-field"><label className="create-field-label" htmlFor="settings-slug">Website slug</label><div className="settings-slug-input"><span>/</span><input id="settings-slug" value={slug} onChange={(event) => { setSlug(slugify(event.target.value)); setSlugEdited(true); }} placeholder="my-website" /></div><p className="create-field-hint">Your website address: /{slug || "your-slug"}. Use lowercase letters and numbers; “-” is the only special character allowed.</p></div>
        </div>}
        {tab === "colors" && <div className="settings-picker"><div className="theme-section-header"><div><h3>Color themes</h3><p>Select a palette for your website.</p></div></div>{loading ? <div className="theme-state">Loading themes…</div> : themesError ? <div className="theme-state theme-state-error">{themesError}</div> : <div className="theme-list">{themes.map((theme, index) => { const id = theme._id || theme.id; const palette = theme.colorPalette || {}; return <label key={id} className={`theme-card ${themeId === id ? "theme-card-selected" : ""}`}><input className="theme-radio" type="radio" name="settings-theme" checked={themeId === id} onChange={() => setThemeId(id)} /><div className="theme-palette">{["primary", "primaryHover", "secondary", "text", "textMuted", "background"].map((color) => <span key={color} style={{ backgroundColor: palette[color] || "#ddd" }} />)}</div><div className="theme-info"><span className="theme-name">{theme.name || `Theme ${index + 1}`}</span><span className={`theme-radio-indicator ${themeId === id ? "selected" : ""}`}>{themeId === id ? "✓" : ""}</span></div></label>; })}</div>}</div>}
        {tab === "type" && <div className="settings-picker"><div className="font-section-header"><h3>Typography</h3><p>Choose fonts that define the personality of your website.</p></div>{typographyLoading ? <div className="typography-state">Loading typography styles…</div> : typographyError ? <div className="typography-state typography-state-error">{typographyError}</div> : <div className="create-popup-typography-list">{typographies.map((item) => <label key={item._id} className={`create-popup-typography-card ${typographyId === item._id ? "create-popup-typography-card-selected" : ""}`}><input type="radio" name="settings-typography" checked={typographyId === item._id} onChange={() => setTypographyId(item._id)} /><div className="create-popup-typography-content"><div className="create-popup-typography-header"><div><h3>{item.name}</h3><p>{item.headingFont.family} + {item.bodyFont.family}</p></div></div><div className="create-popup-typography-preview"><h4 style={{ fontFamily: `"${item.headingFont.family}", sans-serif` }}>Heading Preview</h4><p style={{ fontFamily: `"${item.bodyFont.family}", sans-serif` }}>This is a preview of your website typography.</p></div></div></label>)}</div>}</div>}
      </div>
      <footer className="settings-footer">{error && <p className="settings-error" role="alert">{error}</p>}<button type="button" className="button secondary" onClick={onClose}>Cancel</button><button type="button" className="button primary" onClick={save} disabled={saving || loading || typographyLoading || !themeId || !typographyId}>{saving ? "Saving…" : "Save changes"}</button></footer>
    </section>
  </div>;
};

export default ThemeSettingsPopup;
