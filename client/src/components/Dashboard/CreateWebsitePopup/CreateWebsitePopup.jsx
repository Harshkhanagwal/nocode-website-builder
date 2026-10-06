import React, { useEffect, useState } from "react";
import "./CreateWebsitePopup.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchColorThemes } from "../../../redux/slices/colorThemeSlice";
import { fetchTypographies } from "../../../redux/slices/typographySlice";
import { createNewWebsite } from "../../../redux/slices/projectSlice";

const CreateWebsitePopup = ({ modal, setModal }) => {

    const [formCounter, setFormCounter] = useState(1);
    const [websiteName, setWebsiteName] = useState("");
    const [selectedTheme, setSelectedTheme] = useState("");
    const [selectedTypography, setSelectedTypography] = useState("");


    const dispatch = useDispatch();

    const {
        themes,
        loading,
        error,
    } = useSelector((state) => state.colorThemes);

    const {
        typographies,
        loading: typographyLoading,
        error: typographyError,
    } = useSelector((state) => state.typography);

    useEffect(() => {
        dispatch(fetchColorThemes());
        dispatch(fetchTypographies());
    }, [dispatch]);

    const isWebsiteNameValid =
        websiteName.trim().length >= 3 &&
        websiteName.trim().length <= 35;

    const handleNext = () => {
        if (formCounter === 1 && !isWebsiteNameValid) {
            return;
        }

        if (formCounter === 2 && !selectedTheme) {
            return;
        }

        setFormCounter((prev) => prev + 1);
    };

    const handlePrevious = () => {
        setFormCounter((prev) => prev - 1);
    };


    const handleCreateWebsite = async () => {
        const websiteData = {
            name: websiteName,
            theme: selectedTheme,
            typography: selectedTypography,
        };

        console.log("WEBSITE DATA:", websiteData);

        try {
            await dispatch(createNewWebsite(websiteData)).unwrap();

            alert("Website created successfully!");
            setSelectedTheme("")
            setSelectedTypography("")
            setWebsiteName("")
            
            setModal(!modal)
        } catch (error) {
            alert(error || "Failed to create website");
            setModal(!modal)

        }
    };

    return (
        <div className="modal-overlay" onClick={() => setModal(!modal)}>
            <section className="create-website-modal" onClick={(e) => e.stopPropagation()}>

                {/* ================================
            HEADER
        ================================= */}

                <header className="create-modal-header">

                    <div className="create-modal-heading">

                        <span className="create-modal-eyebrow">
                            Create Website
                        </span>

                        <h2 className="create-modal-title">
                            {formCounter === 1 &&
                                "Let's start with the basics"}

                            {formCounter === 2 &&
                                "Choose your color theme"}

                            {formCounter === 3 &&
                                "Choose your typography"}
                        </h2>

                        <p className="create-modal-description">
                            {formCounter === 1 &&
                                "Give your new website a name to get started."}

                            {formCounter === 2 &&
                                "Choose a color palette that matches your website."}

                            {formCounter === 3 &&
                                "Choose fonts that define the personality of your website."}
                        </p>

                    </div>

                    <div className="create-modal-step-count">
                        {formCounter} / 3
                    </div>

                </header>


                {/* ================================
            PROGRESS
        ================================= */}

                <div className="create-modal-progress">

                    {/* STEP 1 */}

                    <div
                        className={`create-progress-step ${formCounter >= 1 ? "active" : ""
                            }`}
                    >
                        <span>1</span>
                        <label>Details</label>
                    </div>


                    <div
                        className={`create-progress-line ${formCounter >= 2 ? "active" : ""
                            }`}
                    />


                    {/* STEP 2 */}

                    <div
                        className={`create-progress-step ${formCounter >= 2 ? "active" : ""
                            }`}
                    >
                        <span>2</span>
                        <label>Theme</label>
                    </div>


                    <div
                        className={`create-progress-line ${formCounter >= 3 ? "active" : ""
                            }`}
                    />


                    {/* STEP 3 */}

                    <div
                        className={`create-progress-step ${formCounter >= 3 ? "active" : ""
                            }`}
                    >
                        <span>3</span>
                        <label>Typography</label>
                    </div>

                </div>


                {/* ================================
            CONTENT
        ================================= */}

                <div className="create-modal-content">

                    <form
                        onSubmit={(e) => e.preventDefault()}
                    >

                        {/* ==================================
                STEP 1 - WEBSITE DETAILS
            =================================== */}

                        {formCounter === 1 && (
                            <div className="create-step create-step-details">

                                <div className="create-field">

                                    <label className="create-field-label">
                                        Website name
                                    </label>

                                    <div className="create-input-wrapper">

                                        <input
                                            type="text"
                                            className="create-website-input"
                                            value={websiteName}
                                            maxLength={35}
                                            onChange={(e) =>
                                                setWebsiteName(e.target.value)
                                            }
                                            placeholder="e.g. Harsh Portfolio"
                                            autoFocus
                                        />

                                        <span
                                            className={`create-input-counter ${websiteName.length === 35
                                                ? "error"
                                                : ""
                                                }`}
                                        >
                                            {websiteName.length}/35
                                        </span>

                                    </div>

                                    <p className="create-field-hint">
                                        Choose a short and recognizable name
                                        for your website.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="button primary create-modal-next-full"
                                    disabled={!isWebsiteNameValid}
                                    onClick={handleNext}
                                >
                                    <span>Continue</span>
                                    <span>→</span>
                                </button>

                            </div>
                        )}


                        {/* ==================================
                STEP 2 - COLOR THEME
            =================================== */}

                        {formCounter === 2 && (
                            <div className="create-step create-step-theme">

                                <div className="theme-section-header">

                                    <div>

                                        <h3>
                                            Color themes
                                        </h3>

                                        <p>
                                            Select a palette for your website.
                                        </p>

                                    </div>


                                    {themes.length > 0 && (
                                        <span className="theme-count">
                                            {themes.length} themes
                                        </span>
                                    )}

                                </div>


                                {/* LOADING */}

                                {loading && (
                                    <div className="theme-state">

                                        <div className="theme-loader" />

                                        <span>
                                            Loading themes...
                                        </span>

                                    </div>
                                )}


                                {/* ERROR */}

                                {!loading && error && (
                                    <div className="theme-state theme-state-error">
                                        {error}
                                    </div>
                                )}


                                {/* THEMES */}

                                {!loading &&
                                    !error &&
                                    themes.length > 0 && (

                                        <div className="theme-list">

                                            {themes.map((theme, index) => {

                                                const palette =
                                                    theme.colorPalette;

                                                const themeId =
                                                    theme._id ||
                                                    theme.id ||
                                                    index;

                                                const isSelected =
                                                    selectedTheme === themeId;

                                                return (

                                                    <label
                                                        key={themeId}
                                                        className={`theme-card ${isSelected
                                                            ? "theme-card-selected"
                                                            : ""
                                                            }`}
                                                    >

                                                        <input
                                                            type="radio"
                                                            name="colorTheme"
                                                            value={themeId}
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                setSelectedTheme(themeId)
                                                            }
                                                            className="theme-radio"
                                                        />


                                                        {/* COLOR PALETTE */}

                                                        <div className="theme-palette">

                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        palette.primary,
                                                                }}
                                                            />

                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        palette.primaryHover,
                                                                }}
                                                            />

                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        palette.secondary,
                                                                }}
                                                            />

                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        palette.text,
                                                                }}
                                                            />

                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        palette.textMuted,
                                                                }}
                                                            />

                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        palette.background,
                                                                }}
                                                            />

                                                        </div>


                                                        {/* THEME INFO */}

                                                        <div className="theme-info">

                                                            <span className="theme-name">
                                                                {theme.name ||
                                                                    `Theme ${index + 1}`}
                                                            </span>

                                                            <span
                                                                className={`theme-radio-indicator ${isSelected
                                                                    ? "selected"
                                                                    : ""
                                                                    }`}
                                                            >
                                                                {isSelected && "✓"}
                                                            </span>

                                                        </div>

                                                    </label>

                                                );
                                            })}

                                        </div>

                                    )}


                                {/* EMPTY */}

                                {!loading &&
                                    !error &&
                                    themes.length === 0 && (

                                        <div className="theme-state">
                                            No themes available.
                                        </div>

                                    )}


                                {/* ACTIONS */}

                                <div className="create-modal-actions">

                                    <button
                                        type="button"
                                        className="button secondary"
                                        onClick={handlePrevious}
                                    >
                                        ← Previous
                                    </button>

                                    <button
                                        type="button"
                                        className="button primary"
                                        disabled={!selectedTheme}
                                        onClick={handleNext}
                                    >
                                        <span>Continue</span>
                                        <span>→</span>
                                    </button>

                                </div>
                            </div>
                        )}


                        {/* ==================================
                STEP 3 - TYPOGRAPHY
            =================================== */}

                        {formCounter === 3 && (
                            <div className="create-step create-step-font">

                                <div className="font-section-header">

                                    <h3>
                                        Typography
                                    </h3>

                                    <p>
                                        Choose fonts that define the
                                        personality of your website.
                                    </p>

                                </div>


                                <div className="create-popup-typography-list">
                                    {typographies.map((item) => (
                                        <label
                                            key={item._id}
                                            className={`create-popup-typography-card ${selectedTypography === item._id
                                                ? "create-popup-typography-card-selected"
                                                : ""
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="typography"
                                                value={item._id}
                                                checked={selectedTypography === item._id}
                                                onChange={() => setSelectedTypography(item._id)}
                                            />

                                            <div className="create-popup-typography-content">
                                                <div className="create-popup-typography-header">
                                                    <div>
                                                        <h3>{item.name}</h3>

                                                        <p>
                                                            {item.headingFont.family} + {item.bodyFont.family}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="create-popup-typography-preview">
                                                    <h4
                                                        style={{
                                                            fontFamily: `"${item.headingFont.family}", sans-serif`,
                                                        }}
                                                    >
                                                        Heading Preview
                                                    </h4>

                                                    <p
                                                        style={{
                                                            fontFamily: `"${item.bodyFont.family}", sans-serif`,
                                                        }}
                                                    >
                                                        This is a preview of your website typography.
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>


                                {/* ACTIONS */}

                                <div className="create-modal-actions">

                                    <button
                                        type="button"
                                        className="button secondary"
                                        onClick={handlePrevious}
                                    >
                                        ← Previous
                                    </button>

                                    <button
                                        type="button"
                                        className="button primary"
                                        disabled={!selectedTheme}
                                        onClick={handleCreateWebsite}
                                    >
                                        <span>Continue</span>
                                        <span>→</span>
                                    </button>

                                </div>

                            </div>
                        )}

                    </form>

                </div>

            </section>
        </div>
    );
};

export default CreateWebsitePopup;