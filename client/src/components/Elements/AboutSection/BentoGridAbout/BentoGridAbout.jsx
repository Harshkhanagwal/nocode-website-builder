
import React from "react";
import "./BentoGridAbout.css";

const DEFAULT_BENTO_GRID_DATA = {
  content: {
    eyebrow: "About Us",
    headline: "We Build Digital Experiences",
    subheadline:
      "Helping businesses grow through innovative solutions.",
    description:
      "We are dedicated to creating meaningful digital experiences through technology, creativity, and collaboration.",
    media: {
      type: "image",
      src: "https://plus.unsplash.com/premium_photo-1789652752045-7db8caff8c0c?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      alt: "Our team working together",
    },
    highlights: [
      {
        title: "Our Mission",
        description:
          "To empower businesses with accessible digital solutions.",
      },
      {
        title: "Our Vision",
        description:
          "To make technology simple and impactful for everyone.",
      },
    ],
    actions: [
      {
        text: "Learn More",
        href: "/about",
        type: "primary",
      },
    ],
    additionalContent:
      "Building better digital experiences since 2020.",
  },
  visibility: {
    eyebrow: true,
    headline: true,
    subheadline: true,
    description: true,
    media: true,
    highlights: true,
    actions: true,
    additionalContent: false,
  },
};

const BentoGridAbout = ({ data = DEFAULT_BENTO_GRID_DATA }) => {
  // Safely merge incoming data with defaults
  const content = {
    ...DEFAULT_BENTO_GRID_DATA.content,
    ...(data?.content || {}),
  };

  const visibility = {
    ...DEFAULT_BENTO_GRID_DATA.visibility,
    ...(data?.visibility || {}),
  };

  const media = {
    ...DEFAULT_BENTO_GRID_DATA.content.media,
    ...(content.media || {}),
  };

  const highlights = Array.isArray(content.highlights)
    ? content.highlights
    : DEFAULT_BENTO_GRID_DATA.content.highlights;

  const actions = Array.isArray(content.actions)
    ? content.actions
    : DEFAULT_BENTO_GRID_DATA.content.actions;

  return (
    <section className="elm-section bento-grid-section">
      <div className="elm-container bento-grid-container">
        <div className="bento-grid-layout">
          {/* Introduction */}
          <article className="bento-grid-card bento-grid-intro">
            {visibility.eyebrow && content.eyebrow && (
              <span className="bento-grid-eyebrow">
                <span className="bento-grid-eyebrow-dot" />
                {content.eyebrow}
              </span>
            )}

            {visibility.headline && content.headline && (
              <h2 className="elm-h2 bento-grid-headline">
                {content.headline}
              </h2>
            )}

            {visibility.subheadline && content.subheadline && (
              <h3 className="elm-h4 bento-grid-subheadline">
                {content.subheadline}
              </h3>
            )}

            {visibility.description && content.description && (
              <p className="elm-p bento-grid-description">
                {content.description}
              </p>
            )}

            <div className="bento-grid-intro-footer">
              <span className="bento-grid-status">
                <span className="bento-grid-status-dot" />
                Creative minds. Digital solutions.
              </span>
            </div>
          </article>

          {/* Image */}
          {visibility.media && media.src && (
            <article className="bento-grid-card bento-grid-media">
              <img
                className="elm-img elm-img-cover bento-grid-media-image"
                src={media.src}
                alt={media.alt || "About us"}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />

              <div className="bento-grid-media-overlay">
                <span className="bento-grid-media-label">
                  Behind the experience
                </span>
                <span
                  className="bento-grid-media-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>
            </article>
          )}

          {/* Mission and vision */}
          {visibility.highlights &&
            highlights.map((highlight, index) =>
              highlight ? (
                <article
                  className={`bento-grid-card bento-grid-highlight bento-grid-highlight-${index + 1}`}
                  key={`${highlight.title || "highlight"}-${index}`}
                >
                  <div className="bento-grid-card-top">
                    <span className="bento-grid-card-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="bento-grid-card-symbol"
                      aria-hidden="true"
                    >
                      {index === 0 ? "↗" : "◎"}
                    </span>
                  </div>

                  <div className="bento-grid-highlight-content">
                    <h3 className="elm-h3 bento-grid-highlight-title">
                      {highlight.title || "Our Values"}
                    </h3>
                    <p className="elm-p bento-grid-highlight-description">
                      {highlight.description || ""}
                    </p>
                  </div>
                </article>
              ) : null
            )}

          {/* Actions */}
          {visibility.actions && actions.length > 0 && (
            <article className="bento-grid-card bento-grid-action-card">
              <div className="bento-grid-action-copy">
                <span className="elm-text-muted bento-grid-action-label">
                  Explore our story
                </span>
                <h3 className="elm-h4 bento-grid-action-heading">
                  Good ideas deserve great execution.
                </h3>
              </div>

              <div className="bento-grid-action-links">
                {actions.map((action, index) =>
                  action ? (
                    <a
                      key={`${action.text || "action"}-${index}`}
                      href={action.href || "#"}
                      className={`elm-btn ${
                        action.type === "primary"
                          ? "elm-btn-primary"
                          : "elm-btn-secondary"
                      } bento-grid-button`}
                    >
                      {action.text || "Learn More"}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null
                )}
              </div>
            </article>
          )}

          {/* Optional additional content */}
          {visibility.additionalContent &&
            content.additionalContent && (
              <article className="bento-grid-card bento-grid-additional">
                <span className="bento-grid-additional-symbol">
                  ✳
                </span>
                <p className="elm-p">{content.additionalContent}</p>
              </article>
            )}
        </div>
      </div>
    </section>
  );
};

export default BentoGridAbout;