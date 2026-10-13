import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FiEye,
    FiSettings,
    FiPlus,
    FiSave,
    FiMonitor,
    FiTablet,
    FiSmartphone,
    FiLayers,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsiteById } from "../../redux/slices/projectSlice";
import AddSectionPopup from "./AddSectionPopup/AddSectionPopup";
import SectionSettings from "./SectionSettings/SectionSettings";
import "./EditWebsite.css";

const devices = [
    { id: "desktop", name: "Desktop", icon: FiMonitor },
    { id: "tablet", name: "Tablet", icon: FiTablet },
    { id: "mobile", name: "Mobile", icon: FiSmartphone },
];

const DEVICE_WIDTHS = { desktop: 1440, tablet: 768, mobile: 390 };
const DEVICE_HEIGHTS = { desktop: 900, tablet: 1024, mobile: 844 };

/**
 * TODO: replace with your real API call (or a Redux thunk).
 * It should send the full draft (or just the changed sections) to your backend.
 */
const saveWebsiteToServer = async (websiteId, website) => {
    // Example:
    // const res = await fetch(`/api/websites/${websiteId}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(website),
    // });
    // if (!res.ok) throw new Error("Save failed");
    // return res.json();
    console.log("Saving website", websiteId, website);
};

const EditWebsite = ({ website: initialWebsite, websiteId }) => {
    const dispatch = useDispatch();

    const { currentWebsite, loading, error } = useSelector(
        (state) => state.project
    );

    /* ------------------------------------------------------------------ */
    /* ALL hooks live here, before any early return                        */
    /* ------------------------------------------------------------------ */
    const [localWebsite, setLocalWebsite] = useState(null); // editable draft copy
    const [selectedSection, setSelectedSection] = useState(null);
    const [device, setDevice] = useState("desktop");
    const [previewScale, setPreviewScale] = useState(1);
    const [showAddSectionPopup, setShowAddSectionPopup] = useState(false);
    const [saving, setSaving] = useState(false);
    const [previewReady, setPreviewReady] = useState(false);

    const previewCanvasRef = useRef(null);
    const iframeRef = useRef(null);

    /* 1. Fetch full data from Redux ------------------------------------ */
    useEffect(() => {
        if (websiteId) {
            dispatch(fetchWebsiteById(websiteId));
        }
    }, [dispatch, websiteId]);

    const reduxWebsite =
        String(currentWebsite?._id) === String(websiteId)
            ? currentWebsite
            : initialWebsite;

    /* 2. Copy Redux data into the local draft -------------------------- */
    useEffect(() => {
        if (reduxWebsite) {
            setLocalWebsite(structuredClone(reduxWebsite)); // deep copy
        }
    }, [reduxWebsite]);

    /* 3. Everything below reads from the draft ------------------------- */
    const websiteSections = useMemo(
        () =>
            Array.isArray(localWebsite?.sections) ? localWebsite.sections : [],
        [localWebsite]
    );

    const activeSection = websiteSections.find(
        (section) => String(section._id) === String(selectedSection)
    );

    // Keep a valid selection
    useEffect(() => {
        if (!websiteSections.length) {
            setSelectedSection(null);
            return;
        }

        const selectionExists = websiteSections.some(
            (section) => String(section._id) === String(selectedSection)
        );

        if (!selectionExists) {
            setSelectedSection(websiteSections[0]._id);
        }
    }, [websiteSections, selectedSection]);

    /* 4. SectionSettings calls this on every change -------------------- */
    const handleSectionChange = useCallback((updatedSection) => {
        setLocalWebsite((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                sections: prev.sections.map((section) =>
                    String(section._id) === String(updatedSection._id)
                        ? updatedSection
                        : section
                ),
            };
        });
    }, []);

    /* 5. Send the draft to the preview iframe -------------------------- */
    const postDraftToPreview = useCallback(() => {
        if (!localWebsite) return;
        iframeRef.current?.contentWindow?.postMessage(
            { type: "PREVIEW_UPDATE", website: localWebsite },
            window.location.origin
        );
    }, [localWebsite]);

    // Preview page tells us when its listener is mounted (handshake)
    useEffect(() => {
        const onMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== iframeRef.current?.contentWindow) return;
            if (event.data?.type === "PREVIEW_READY") {
                setPreviewReady(true);
            }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    // Push the draft whenever it changes (or when the preview becomes ready)
    useEffect(() => {
        if (previewReady) postDraftToPreview();
    }, [previewReady, postDraftToPreview]);

    // If the iframe URL changes, it reloads and must handshake again
    const previewSrc = localWebsite?.slug ? `/${localWebsite.slug}` : "about:blank";
    useEffect(() => {
        setPreviewReady(false);
    }, [previewSrc]);

    /* 6. Save ---------------------------------------------------------- */
    const handleSave = async () => {
        if (!localWebsite) return;
        try {
            setSaving(true);
            await saveWebsiteToServer(websiteId, localWebsite);
            // Refresh Redux with saved data; the copy effect then resets the draft
            await dispatch(fetchWebsiteById(websiteId));
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setSaving(false);
        }
    };

    const isDirty = useMemo(
        () =>
            !!localWebsite &&
            !!reduxWebsite &&
            JSON.stringify(localWebsite) !== JSON.stringify(reduxWebsite),
        [localWebsite, reduxWebsite]
    );

    const handleAddSection = (section) => {
        // TODO: build the new section object and add it to the draft, e.g.
        // setLocalWebsite((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
        console.log("Selected section:", section);
    };

    const hasWebsite = !!localWebsite;

    /* Preview scaling -------------------------------------------------- */
    useEffect(() => {
        if (!hasWebsite) return; // canvas isn't rendered yet

        const calculateScale = () => {
            const canvas = previewCanvasRef.current;
            if (!canvas) return;

            if (device !== "desktop") {
                setPreviewScale(1);
                return;
            }

            const availableWidth = canvas.clientWidth - 48;
            const scale = Math.min(1, availableWidth / DEVICE_WIDTHS.desktop);
            setPreviewScale(Math.max(scale, 0.35));
        };

        calculateScale();

        const observer = new ResizeObserver(calculateScale);
        if (previewCanvasRef.current) {
            observer.observe(previewCanvasRef.current);
        }

        window.addEventListener("resize", calculateScale);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", calculateScale);
        };
    }, [device, hasWebsite]);

    const deviceWidth = DEVICE_WIDTHS[device];
    const deviceHeight = DEVICE_HEIGHTS[device];
    const previewWidth =
        device === "desktop" ? deviceWidth * previewScale : deviceWidth;
    const previewHeight =
        device === "desktop" ? deviceHeight * previewScale : deviceHeight;

    useEffect(() => {
        console.log("DRAFT", localWebsite?.sections?.[0]?.content);
    }, [localWebsite]);


    /* ------------------------------------------------------------------ */
    /* Early returns (after all hooks)                                     */
    /* ------------------------------------------------------------------ */
    if (loading && !localWebsite) {
        return <p>Loading editor...</p>;
    }

    if (error && !localWebsite) {
        return <p>{error}</p>;
    }

    if (!localWebsite) {
        return <p>Website not found.</p>;
    }


    return (
        <div className="editor-page">
            <header className="editor-header">
                <div className="editor-header-left">
                    <div className="editor-logo">OurPlatform</div>
                    <div className="editor-header-divider" />
                    <div className="editor-website-name">
                        {localWebsite.name || "Untitled Website"}
                    </div>
                </div>

                <div className="editor-header-actions">
                    <button type="button" className="button secondary">
                        <FiEye />
                        <span>Preview</span>
                    </button>
                    <button
                        type="button"
                        className="button primary"
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                    >
                        <FiSave />
                        <span>{saving ? "Saving..." : "Save"}</span>
                    </button>
                </div>
            </header>

            <main className="editor-layout">
                <aside className="editor-sidebar">
                    <div className="editor-sidebar-content">
                        <div className="editor-sidebar-title">Sections</div>

                        <div className="editor-sections-list">
                            {websiteSections.length > 0 ? (
                                websiteSections.map((section, index) => (
                                    <button
                                        key={section._id || index}
                                        type="button"
                                        className={`editor-section-item ${String(selectedSection) === String(section._id)
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() => setSelectedSection(section._id)}
                                    >
                                        <FiLayers size={20} />
                                        <span>
                                            {section.sectionName} — {section.variant}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <p>No sections found.</p>
                            )}
                        </div>

                        <button
                            type="button"
                            className="add-section-button"
                            onClick={() => setShowAddSectionPopup(true)}
                        >
                            <FiPlus size={16} />
                            <span>Add Section</span>
                        </button>
                    </div>

                    <div className="editor-sidebar-footer">
                        <button type="button" className="editor-theme-button">
                            <FiSettings />
                            <span>Theme Settings</span>
                        </button>
                    </div>
                </aside>

                <section className="editor-preview">
                    <div className="editor-preview-toolbar">
                        <div className="editor-preview-device-info">
                            <span>Preview</span>
                        </div>

                        <div className="editor-device-switcher">
                            {devices.map(({ id, name, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className={`editor-device-button ${device === id ? "active" : ""
                                        }`}
                                    onClick={() => setDevice(id)}
                                    title={name}
                                >
                                    <Icon />
                                    <span>{name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="editor-preview-url">
                            {localWebsite.slug
                                ? `ourplatform.com/${localWebsite.slug}`
                                : "Website Preview"}
                        </div>
                    </div>

                    <div ref={previewCanvasRef} className="editor-preview-canvas">
                        <div
                            className={`editor-preview-wrapper editor-preview-wrapper-${device}`}
                            style={{
                                width: `${previewWidth}px`,
                                height: `${previewHeight}px`,
                            }}
                        >
                            <div
                                className={`editor-device-frame editor-device-${device}`}
                                style={{
                                    transform:
                                        device === "desktop"
                                            ? `scale(${previewScale})`
                                            : "none",
                                }}
                            >
                                <iframe
                                    ref={iframeRef}
                                    src={previewSrc}
                                    title={`${localWebsite.name || "Website"} Preview`}
                                    className="editor-website-iframe"
                                    onLoad={postDraftToPreview}
                                    style={{
                                        width: `${deviceWidth}px`,
                                        height: `${deviceHeight}px`,
                                        display: "block",
                                        border: 0,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="editor-inspector-content">
                    {activeSection ? (
                        <SectionSettings
                            key={activeSection._id}
                            section={activeSection}
                            onChange={handleSectionChange}
                            onSave={handleSave}
                            saving={saving}
                            websiteId={websiteId}
                        />
                    ) : (
                        <p>Select a section from the sidebar to view its settings.</p>
                    )}
                </div>
            </main>

            {showAddSectionPopup && (
                <AddSectionPopup
                    onClose={() => setShowAddSectionPopup(false)}
                    onAddSection={handleAddSection}
                />
            )}
        </div>
    );
};

export default EditWebsite;