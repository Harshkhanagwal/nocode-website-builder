import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FiEye,
    FiSettings,
    FiPlus,
    FiHome,
    FiUser,
    FiBriefcase,
    FiMail,
    FiSave,
    FiMonitor,
    FiTablet,
    FiSmartphone,
} from "react-icons/fi";

import UserWebPage from "../../components/UserWebPage/UserWebPage";

import "./EditWebsite.css";


/* =========================================================
   STATIC EDITOR SECTIONS
========================================================= */

const sections = [
    {
        id: "hero",
        name: "Hero",
        icon: FiHome,
    },
    {
        id: "about",
        name: "About",
        icon: FiUser,
    },
    {
        id: "projects",
        name: "Projects",
        icon: FiBriefcase,
    },
    {
        id: "contact",
        name: "Contact",
        icon: FiMail,
    },
];


/* =========================================================
   PREVIEW DEVICES
========================================================= */

const devices = [
    {
        id: "desktop",
        name: "Desktop",
        icon: FiMonitor,
    },
    {
        id: "tablet",
        name: "Tablet",
        icon: FiTablet,
    },
    {
        id: "mobile",
        name: "Mobile",
        icon: FiSmartphone,
    },
];


/* =========================================================
   DEVICE DIMENSIONS
========================================================= */

const DEVICE_WIDTHS = {
    desktop: 1440,
    tablet: 768,
    mobile: 390,
};

const DEVICE_HEIGHTS = {
    desktop: 900,
    tablet: 1024,
    mobile: 844,
};


/* =========================================================
   COMPONENT
========================================================= */

const EditWebsite = ({ website, websiteId }) => {
    const [selectedSection, setSelectedSection] =
        useState("hero");

    const [device, setDevice] =
        useState("desktop");

    const [previewScale, setPreviewScale] =
        useState(1);

    const previewCanvasRef =
        useRef(null);


    /* =======================================================
       CALCULATE DESKTOP PREVIEW SCALE
    ======================================================= */

    useEffect(() => {
        const calculateScale = () => {
            if (!previewCanvasRef.current) {
                return;
            }

            /*
              Only desktop needs scaling.
      
              Tablet and mobile use their actual
              viewport widths.
            */

            if (device !== "desktop") {
                setPreviewScale(1);
                return;
            }

            const availableWidth =
                previewCanvasRef.current.clientWidth;

            const websiteWidth =
                DEVICE_WIDTHS.desktop;

            const horizontalPadding =
                48;

            const availableWebsiteWidth =
                availableWidth - horizontalPadding;

            const calculatedScale =
                availableWebsiteWidth / websiteWidth;

            /*
              Don't enlarge the website beyond 100%.
            */

            const scale =
                Math.min(
                    1,
                    calculatedScale
                );

            /*
              Prevent the website from becoming
              unusably small.
            */

            setPreviewScale(
                Math.max(scale, 0.35)
            );
        };


        calculateScale();


        const resizeObserver =
            new ResizeObserver(
                calculateScale
            );


        if (previewCanvasRef.current) {
            resizeObserver.observe(
                previewCanvasRef.current
            );
        }


        window.addEventListener(
            "resize",
            calculateScale
        );


        return () => {
            resizeObserver.disconnect();

            window.removeEventListener(
                "resize",
                calculateScale
            );
        };
    }, [device]);


    /* =======================================================
       CURRENT DEVICE DIMENSIONS
    ======================================================= */

    const deviceWidth =
        DEVICE_WIDTHS[device];

    const deviceHeight =
        DEVICE_HEIGHTS[device];


    /* =======================================================
       PREVIEW DIMENSIONS
    ======================================================= */

    const previewWidth =
        device === "desktop"
            ? deviceWidth * previewScale
            : deviceWidth;

    const previewHeight =
        device === "desktop"
            ? deviceHeight * previewScale
            : deviceHeight;


    return (
        <div className="editor-page">


            {/* =====================================================
          HEADER
      ===================================================== */}

            <header className="editor-header">

                <div className="editor-header-left">

                    <div className="editor-logo">
                        OurPlatform
                    </div>


                    <div className="editor-header-divider" />


                    <div className="editor-website-name">
                        {website?.name ||
                            "Untitled Website"}
                    </div>

                </div>


                <div className="editor-header-actions">

                    <button
                        type="button"
                        className="button secondary"
                    >
                        <FiEye />

                        <span>
                            Preview
                        </span>
                    </button>


                    <button
                        type="button"
                        className="button primary"
                    >
                        <FiSave />

                        <span>
                            Save
                        </span>
                    </button>

                </div>

            </header>


            {/* =====================================================
          EDITOR LAYOUT
      ===================================================== */}

            <main className="editor-layout">


                {/* ===================================================
            LEFT SIDEBAR
        =================================================== */}

                <aside className="editor-sidebar">

                    <div className="editor-sidebar-content">

                        <div className="editor-sidebar-title">
                            Sections
                        </div>


                        <div className="editor-section-list">

                            {sections.map((section) => {
                                const Icon = section.icon;

                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        className={`editor-section-item ${selectedSection ===
                                            section.id
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedSection(
                                                section.id
                                            )
                                        }
                                    >

                                        <Icon />

                                        <span>
                                            {section.name}
                                        </span>

                                    </button>
                                );
                            })}

                        </div>


                        <button
                            type="button"
                            className="editor-add-section"
                        >
                            <FiPlus />

                            <span>
                                Add Section
                            </span>
                        </button>

                    </div>


                    {/* Theme Settings */}

                    <div className="editor-sidebar-footer">

                        <button
                            type="button"
                            className="editor-theme-button"
                        >
                            <FiSettings />

                            <span>
                                Theme Settings
                            </span>

                        </button>

                    </div>

                </aside>


                {/* ===================================================
            CENTER PREVIEW
        =================================================== */}

                <section className="editor-preview">


                    {/* Preview Toolbar */}

                    <div className="editor-preview-toolbar">


                        {/* Left */}

                        <div className="editor-preview-device-info">

                            <span>
                                Preview
                            </span>

                        </div>


                        {/* Device Selector */}

                        <div className="editor-device-switcher">

                            {devices.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`editor-device-button ${device === item.id
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setDevice(item.id)
                                        }
                                        title={item.name}
                                    >

                                        <Icon />

                                        <span>
                                            {item.name}
                                        </span>

                                    </button>
                                );
                            })}

                        </div>


                        {/* Right */}

                        <div className="editor-preview-url">

                            {website?.slug
                                ? `ourplatform.com/${website.slug}`
                                : "Website Preview"}

                        </div>

                    </div>


                    {/* =================================================
              PREVIEW CANVAS
          ================================================= */}

                    {/* =================================================
    PREVIEW CANVAS
================================================= */}

                    <div
                        ref={previewCanvasRef}
                        className="editor-preview-canvas"
                    >
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
                                    src={`/${website?.slug}`}
                                    title={`${website?.name || "Website"} Preview`}
                                    className="editor-website-iframe"
                                    style={{
                                        width: `${deviceWidth}px`,
                                        height: `${deviceHeight}px`,
                                        display: "block",
                                        border: "0",
                                    }}
                                />
                            </div>

                        </div>
                    </div>

                </section>


                {/* ===================================================
            RIGHT INSPECTOR
        =================================================== */}

                <aside className="editor-inspector">


                    {/* Inspector Header */}

                    <div className="editor-inspector-header">

                        <span className="editor-inspector-label">
                            SETTINGS
                        </span>


                        <h3>
                            {selectedSection
                                .charAt(0)
                                .toUpperCase() +
                                selectedSection.slice(1)}
                        </h3>

                    </div>


                    {/* Inspector Content */}

                    <div className="editor-inspector-content">


                        {/* =================================================
                HERO
            ================================================= */}

                        {selectedSection === "hero" && (
                            <>

                                <div className="editor-setting-group">

                                    <label>
                                        Eyebrow
                                    </label>

                                    <input
                                        type="text"
                                        value="Introducing Our Platform"
                                        readOnly
                                    />

                                </div>


                                <div className="editor-setting-group">

                                    <label>
                                        Headline
                                    </label>

                                    <textarea
                                        value="Build Your Next Big Idea"
                                        readOnly
                                    />

                                </div>


                                <div className="editor-setting-group">

                                    <label>
                                        Subheadline
                                    </label>

                                    <textarea
                                        value="Create stunning websites with the power of AI."
                                        readOnly
                                    />

                                </div>


                                <div className="editor-setting-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value="No coding required. Just bring your ideas."
                                        readOnly
                                    />

                                </div>


                                <div className="editor-setting-group">

                                    <label>
                                        Primary Button
                                    </label>

                                    <input
                                        type="text"
                                        value="Get Started"
                                        readOnly
                                    />

                                </div>

                            </>
                        )}


                        {/* =================================================
                ABOUT
            ================================================= */}

                        {selectedSection === "about" && (
                            <>

                                <div className="editor-setting-group">

                                    <label>
                                        Heading
                                    </label>

                                    <input
                                        type="text"
                                        value="About Me"
                                        readOnly
                                    />

                                </div>


                                <div className="editor-setting-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value="I'm a developer focused on building modern digital experiences."
                                        readOnly
                                    />

                                </div>

                            </>
                        )}


                        {/* =================================================
                PROJECTS
            ================================================= */}

                        {selectedSection === "projects" && (
                            <>

                                <div className="editor-setting-group">

                                    <label>
                                        Heading
                                    </label>

                                    <input
                                        type="text"
                                        value="Selected Work"
                                        readOnly
                                    />

                                </div>


                                <div className="editor-setting-group">

                                    <label>
                                        Columns
                                    </label>

                                    <select defaultValue="3">

                                        <option value="2">
                                            2 Columns
                                        </option>

                                        <option value="3">
                                            3 Columns
                                        </option>

                                        <option value="4">
                                            4 Columns
                                        </option>

                                    </select>

                                </div>

                            </>
                        )}


                        {/* =================================================
                CONTACT
            ================================================= */}

                        {selectedSection === "contact" && (
                            <>

                                <div className="editor-setting-group">

                                    <label>
                                        Heading
                                    </label>

                                    <input
                                        type="text"
                                        value="Let's Work Together"
                                        readOnly
                                    />

                                </div>


                                <div className="editor-setting-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value="Have a project in mind? Get in touch."
                                        readOnly
                                    />

                                </div>

                            </>
                        )}

                    </div>

                </aside>

            </main>

        </div>
    );
};

export default EditWebsite;