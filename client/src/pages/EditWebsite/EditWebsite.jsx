import { useEffect, useRef, useState } from "react";
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

const EditWebsite = ({ website: initialWebsite, websiteId }) => {
    const dispatch = useDispatch();
    const { currentWebsite, loading, error } = useSelector(
        (state) => state.project
    );

    const [selectedSection, setSelectedSection] = useState(null);
    const [device, setDevice] = useState("desktop");
    const [previewScale, setPreviewScale] = useState(1);
    const [showAddSectionPopup, setShowAddSectionPopup] = useState(false);
    const previewCanvasRef = useRef(null);

    useEffect(() => {
        if (websiteId) {
            dispatch(fetchWebsiteById(websiteId));
        }
    }, [dispatch, websiteId]);

    const website =
        String(currentWebsite?._id) === String(websiteId)
            ? currentWebsite
            : initialWebsite;

    const websiteSections = Array.isArray(website?.sections)
        ? website.sections
        : [];

    const activeSection = websiteSections.find(
        (section) => String(section._id) === String(selectedSection)
    );

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

    useEffect(() => {
        const calculateScale = () => {
            if (!previewCanvasRef.current) return;

            if (device !== "desktop") {
                setPreviewScale(1);
                return;
            }

            const availableWidth = previewCanvasRef.current.clientWidth - 48;
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
    }, [device]);

    const deviceWidth = DEVICE_WIDTHS[device];
    const deviceHeight = DEVICE_HEIGHTS[device];
    const previewWidth =
        device === "desktop" ? deviceWidth * previewScale : deviceWidth;
    const previewHeight =
        device === "desktop" ? deviceHeight * previewScale : deviceHeight;

    const handleAddSection = (section) => {
        // Backend section creation will be connected in the next step.
        console.log("Selected section:", section);
    };

    const sectionContent = activeSection?.content ?? {};

    if (loading && !currentWebsite && !initialWebsite) {
        return <p>Loading editor...</p>;
    }

    if (error && !website) {
        return <p>{error}</p>;
    }

    if (!website) {
        return <p>Website not found.</p>;
    }


    const [saving, setSaving] = useState(false);

    const handleSaveSection = async (updatedSection) => {
        try {
            setSaving(true);

            // Call your existing API here using:
            // websiteId and updatedSection

            // Update the displayed website after a successful response.
        } catch (error) {
            console.error("Failed to save section:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="editor-page">
            <header className="editor-header">
                <div className="editor-header-left">
                    <div className="editor-logo">OurPlatform</div>
                    <div className="editor-header-divider" />
                    <div className="editor-website-name">
                        {website.name || "Untitled Website"}
                    </div>
                </div>

                <div className="editor-header-actions">
                    <button type="button" className="button secondary">
                        <FiEye />
                        <span>Preview</span>
                    </button>
                    <button type="button" className="button primary">
                        <FiSave />
                        <span>Save</span>
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
                            {website.slug
                                ? `ourplatform.com/${website.slug}`
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
                                    src={website.slug ? `/${website.slug}` : "about:blank"}
                                    title={`${website.name || "Website"} Preview`}
                                    className="editor-website-iframe"
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
                            section={activeSection}
                            onSave={handleSaveSection}
                            saving={saving}
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