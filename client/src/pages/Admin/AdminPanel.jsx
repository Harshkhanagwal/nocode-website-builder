import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createColorTheme,
  deleteColorTheme,
  getColorThemes,
  updateColorTheme,
} from "../../api/colorThemeApi";
import {
  createTypography,
  deleteTypography,
  getAdminTypographies,
  updateTypography,
} from "../../api/typographyApi";
import "./AdminPanel.css";

const paletteFields = [
  ["primary", "Primary"], ["primaryHover", "Primary hover"],
  ["secondary", "Secondary"], ["text", "Text"], ["textMuted", "Muted text"],
  ["textLight", "Light text"], ["background", "Background"], ["surface", "Surface"],
  ["border", "Border"], ["borderDark", "Dark border"], ["success", "Success"],
  ["warning", "Warning"], ["danger", "Danger"], ["info", "Info"],
];

const categories = ["sans-serif", "serif", "monospace", "display", "handwriting"];
const defaultPalette = Object.fromEntries(paletteFields.map(([key]) => [key, "#64748b"]));

const defaultTypography = {
  baseSize: 16,
  h1: { size: 48, weight: 700, lineHeight: 1.2 },
  h2: { size: 40, weight: 700, lineHeight: 1.2 },
  h3: { size: 32, weight: 600, lineHeight: 1.25 },
  h4: { size: 26, weight: 600, lineHeight: 1.3 },
  h5: { size: 22, weight: 600, lineHeight: 1.35 },
  h6: { size: 18, weight: 600, lineHeight: 1.4 },
  body: { size: 16, weight: 400, lineHeight: 1.5 },
  small: { size: 14, weight: 400, lineHeight: 1.4 },
};

const emptyTypography = () => ({
  name: "",
  headingFont: { family: "", category: "sans-serif", weights: [400, 500, 600, 700] },
  bodyFont: { family: "", category: "sans-serif", weights: [400, 500, 600, 700] },
  typography: defaultTypography,
  source: "google",
  isActive: true,
});

function AdminPanel() {
  const [tab, setTab] = useState("themes");
  const [themes, setThemes] = useState([]);
  const [typographies, setTypographies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState(null);
  const [typographyJson, setTypographyJson] = useState(JSON.stringify(defaultTypography, null, 2));
  const [saving, setSaving] = useState(false);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [themeResult, typographyResult] = await Promise.all([
        getColorThemes(),
        getAdminTypographies(),
      ]);
      setThemes(themeResult.themes || []);
      setTypographies(typographyResult.typographies || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load design settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getColorThemes(), getAdminTypographies()])
      .then(([themeResult, typographyResult]) => {
        if (!cancelled) {
          setThemes(themeResult.themes || []);
          setTypographies(typographyResult.typographies || []);
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.response?.data?.message || "Could not load design settings.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const openNew = (type) => {
    setError("");
    setNotice("");
    setEditor(type === "theme"
      ? { type, id: null, value: { name: "", colorPalette: { ...defaultPalette } } }
      : { type, id: null, value: emptyTypography() });
    setTypographyJson(JSON.stringify(defaultTypography, null, 2));
  };

  const openEdit = (type, record) => {
    setError("");
    setNotice("");
    setEditor({ type, id: record._id, value: structuredClone(record) });
    setTypographyJson(JSON.stringify(record.typography || defaultTypography, null, 2));
  };

  const updateEditor = (update) => setEditor((current) => ({
    ...current,
    value: { ...current.value, ...update },
  }));

  const submitEditor = async (event) => {
    event.preventDefault();
    if (!editor) return;
    setSaving(true);
    setError("");
    try {
      if (editor.type === "theme") {
        const request = editor.id
          ? updateColorTheme(editor.id, editor.value)
          : createColorTheme(editor.value);
        await request;
      } else {
        let typographyScale;
        try {
          typographyScale = JSON.parse(typographyJson);
        } catch {
          setError("Typography scale must be valid JSON.");
          setSaving(false);
          return;
        }
        const data = { ...editor.value, typography: typographyScale };
        const request = editor.id
          ? updateTypography(editor.id, data)
          : createTypography(data);
        await request;
      }
      setEditor(null);
      setNotice("Changes saved.");
      await loadRecords();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save these changes.");
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (type, record) => {
    if (!window.confirm(`Delete “${record.name}”?`)) return;
    setError("");
    setNotice("");
    try {
      if (type === "theme") await deleteColorTheme(record._id);
      else await deleteTypography(record._id);
      setNotice(`“${record.name}” was deleted.`);
      await loadRecords();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this record.");
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Workspace administration</p>
          <h1>Design system</h1>
          <p>Manage the themes and typography available to website projects.</p>
        </div>
        <Link className="admin-back-link" to="/dashboard">Back to dashboard</Link>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        <button className={tab === "themes" ? "active" : ""} onClick={() => setTab("themes")}>Color themes</button>
        <button className={tab === "typographies" ? "active" : ""} onClick={() => setTab("typographies")}>Typography</button>
        <Link to="/admin/templates">Templates</Link>
      </nav>

      {error && <div className="admin-alert error" role="alert">{error}</div>}
      {notice && <div className="admin-alert success" role="status">{notice}</div>}

      {loading ? <p className="admin-state">Loading design settings…</p> : (
        <section className="admin-records">
          <div className="admin-section-heading">
            <div>
              <h2>{tab === "themes" ? "Color themes" : "Typography presets"}</h2>
              <p>{tab === "themes" ? `${themes.length} themes` : `${typographies.length} presets`}</p>
            </div>
            <button className="admin-primary-button" onClick={() => openNew(tab === "themes" ? "theme" : "typography")}>
              Add {tab === "themes" ? "theme" : "typography"}
            </button>
          </div>

          <div className="admin-card-grid">
            {(tab === "themes" ? themes : typographies).map((record) => (
              <article className="admin-record-card" key={record._id}>
                {tab === "themes" ? (
                  <div className="admin-swatch-row">
                    {paletteFields.slice(0, 7).map(([key]) => (
                      <span key={key} title={key} style={{ background: record.colorPalette?.[key] || "#e2e8f0" }} />
                    ))}
                  </div>
                ) : (
                  <div className="admin-font-preview" style={{ fontFamily: record.headingFont?.family || "inherit" }}>
                    Aa <small>{record.headingFont?.family || "Heading font"}</small>
                  </div>
                )}
                <div className="admin-record-title">
                  <div><h3>{record.name}</h3><p>{tab === "themes"
                    ? `${Object.keys(record.colorPalette || {}).length} color tokens`
                    : `${record.headingFont?.family} + ${record.bodyFont?.family}`}</p></div>
                  {tab === "typographies" && <span className={record.isActive ? "admin-status active" : "admin-status"}>{record.isActive ? "Active" : "Inactive"}</span>}
                </div>
                <div className="admin-record-actions">
                  <button onClick={() => openEdit(tab === "themes" ? "theme" : "typography", record)}>Edit</button>
                  <button className="danger" onClick={() => removeRecord(tab === "themes" ? "theme" : "typography", record)}>Delete</button>
                </div>
              </article>
            ))}
            {(tab === "themes" ? themes : typographies).length === 0 && (
              <div className="admin-empty">No {tab === "themes" ? "color themes" : "typography presets"} yet.</div>
            )}
          </div>
        </section>
      )}

      {editor && (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) setEditor(null);
        }}>
          <form className="admin-editor" onSubmit={submitEditor}>
            <div className="admin-editor-heading">
              <div><p className="admin-eyebrow">{editor.id ? "Edit" : "Create"}</p><h2>{editor.type === "theme" ? "Color theme" : "Typography preset"}</h2></div>
              <button type="button" className="admin-close" onClick={() => setEditor(null)} aria-label="Close">×</button>
            </div>
            <label className="admin-field">Name
              <input required maxLength={50} value={editor.value.name} onChange={(event) => updateEditor({ name: event.target.value })} />
            </label>

            {editor.type === "theme" ? (
              <div className="admin-palette-fields">
                {paletteFields.map(([key, label]) => (
                  <label className="admin-field" key={key}>{label}
                    <span className="admin-color-input">
                      <input type="color" value={/^#[0-9a-f]{6}$/i.test(editor.value.colorPalette?.[key] || "") ? editor.value.colorPalette[key] : "#64748b"}
                        onChange={(event) => updateEditor({ colorPalette: { ...editor.value.colorPalette, [key]: event.target.value } })} />
                      <input required value={editor.value.colorPalette?.[key] || ""} onChange={(event) => updateEditor({ colorPalette: { ...editor.value.colorPalette, [key]: event.target.value } })} />
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <>
                <div className="admin-two-column">
                  {["headingFont", "bodyFont"].map((field) => (
                    <fieldset className="admin-font-fieldset" key={field}>
                      <legend>{field === "headingFont" ? "Heading font" : "Body font"}</legend>
                      <label className="admin-field">Family
                        <input required value={editor.value[field].family} onChange={(event) => updateEditor({
                          [field]: { ...editor.value[field], family: event.target.value },
                        })} />
                      </label>
                      <label className="admin-field">Category
                        <select value={editor.value[field].category} onChange={(event) => updateEditor({
                          [field]: { ...editor.value[field], category: event.target.value },
                        })}>
                          {categories.map((category) => <option key={category}>{category}</option>)}
                        </select>
                      </label>
                      <label className="admin-field">Weights
                        <input value={(editor.value[field].weights || []).join(", ")} onChange={(event) => updateEditor({
                          [field]: { ...editor.value[field], weights: event.target.value.split(",").map((weight) => Number(weight.trim())).filter(Number.isFinite) },
                        })} />
                      </label>
                    </fieldset>
                  ))}
                </div>
                <label className="admin-field">Typography scale (JSON)
                  <textarea rows={12} value={typographyJson} onChange={(event) => setTypographyJson(event.target.value)} />
                  <small>Edit the token values in the scale, keeping valid JSON.</small>
                </label>
                <div className="admin-two-column">
                  <label className="admin-field">Font source
                    <select value={editor.value.source || "google"} onChange={(event) => updateEditor({ source: event.target.value })}>
                      {["google", "system", "custom"].map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>
                  <label className="admin-checkbox"><input type="checkbox" checked={editor.value.isActive !== false}
                    onChange={(event) => updateEditor({ isActive: event.target.checked })} /> Active</label>
                </div>
              </>
            )}
            {error && <div className="admin-alert error" role="alert">{error}</div>}
            <div className="admin-editor-actions">
              <button type="button" onClick={() => setEditor(null)} disabled={saving}>Cancel</button>
              <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default AdminPanel;
