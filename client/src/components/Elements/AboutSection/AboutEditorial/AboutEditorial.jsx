
import React from "react";
import "./AboutEditorial.css";

const DEFAULT_ABOUT_EDITORIAL_DATA = {
  content: {
    eyebrow: "ABOUT OUR STUDIO",
    headline: "We turn bold ideas into meaningful digital experiences.",
    subheadline:
      "Independent thinking. Thoughtful design. Purposeful technology.",
    description:
      "We are a creative team bringing strategy, design, and technology together to create digital experiences that help businesses move forward.",
    media: {
      type: "image",
      src: "https://plus.unsplash.com/premium_photo-1789652752045-7db8caff8c0c?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      alt: "Creative team collaborating on digital experiences",
    },
    highlights: [
      {
        title: "Our Mission",
        description:
          "To empower businesses with accessible digital solutions and purposeful design.",
      },
      {
        title: "Our Vision",
        description:
          "To make technology simple, meaningful, and impactful for everyone.",
      },
    ],
    actions: [
      {
        text: "Discover Our Story",
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

const AboutEditorial = ({
  data = DEFAULT_ABOUT_EDITORIAL_DATA,
}) => {
  const content = {
    ...DEFAULT_ABOUT_EDITORIAL_DATA.content,
    ...(data?.content || {}),
  };

  const visibility = {
    ...DEFAULT_ABOUT_EDITORIAL_DATA.visibility,
    ...(data?.visibility || {}),
  };

  const media = {
    ...DEFAULT_ABOUT_EDITORIAL_DATA.content.media,
    ...(content.media || {}),
  };

  const highlights = Array.isArray(content.highlights)
    ? content.highlights.filter(Boolean)
    : DEFAULT_ABOUT_EDITORIAL_DATA.content.highlights;

  const actions = Array.isArray(content.actions)
    ? content.actions.filter(Boolean)
    : DEFAULT_ABOUT_EDITORIAL_DATA.content.actions;

  return (
    <section className="elm-section AboutEditorial-section">
      <div className="elm-container AboutEditorial-container">

        {/* Editorial introduction */}
        <header className="AboutEditorial-header">
          {visibility.eyebrow && content.eyebrow && (
            <div className="AboutEditorial-eyebrow">
              <span className="AboutEditorial-eyebrow-mark" />
              <span>{content.eyebrow}</span>
              <span className="AboutEditorial-eyebrow-line" />
              <span className="AboutEditorial-edition">
                INDEPENDENT / CREATIVE
              </span>
            </div>
          )}

          {visibility.headline && content.headline && (
            <h2 className="elm-h2 AboutEditorial-headline">
              {content.headline}
              <span
                className="AboutEditorial-headline-period"
                aria-hidden="true"
              >
                .
              </span>
            </h2>
          )}

          <div className="AboutEditorial-intro-bottom">
            <span className="AboutEditorial-index">
              (01 — WHO WE ARE)
            </span>

            <div className="AboutEditorial-intro-copy">
              {visibility.subheadline && content.subheadline && (
                <h3 className="elm-h4 AboutEditorial-subheadline">
                  {content.subheadline}
                </h3>
              )}

              {visibility.description && content.description && (
                <p className="elm-p AboutEditorial-description">
                  {content.description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Featured editorial image */}
        {visibility.media && media.src && (
          <figure className="AboutEditorial-feature">
            <div className="AboutEditorial-image-frame">
              <img
                className="elm-img elm-img-cover AboutEditorial-image"
                src={media.src}
                alt={media.alt || "About our creative team"}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.opacity = "0";
                }}
              />

              <span className="AboutEditorial-image-number">
                FIG. 01
              </span>

              <span className="AboutEditorial-image-caption">
                IDEAS INTO EXPERIENCE
              </span>
            </div>

            <figcaption className="AboutEditorial-feature-caption">
              <span>STRATEGY / DESIGN / TECHNOLOGY</span>
              <span>SCROLL TO EXPLORE ↓</span>
            </figcaption>
          </figure>
        )}

        {/* Mission and vision */}
        {visibility.highlights && highlights.length > 0 && (
          <div className="AboutEditorial-highlights">
            <div className="AboutEditorial-highlights-heading">
              <span className="AboutEditorial-index">
                (02 — WHAT DRIVES US)
              </span>

              <h3 className="elm-h3 AboutEditorial-highlights-title">
                Built on purpose.
                <br />
                Driven by possibility.
              </h3>
            </div>

            <div className="AboutEditorial-highlights-list">
              {highlights.map((item, index) => (
                <article
                  className="AboutEditorial-highlight"
                  key={`${item.title || "highlight"}-${index}`}
                >
                  <div className="AboutEditorial-highlight-meta">
                    <span className="AboutEditorial-highlight-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="AboutEditorial-highlight-symbol">
                      ↗
                    </span>
                  </div>

                  <h4 className="elm-h4 AboutEditorial-highlight-title">
                    {item.title || `Our Value ${index + 1}`}
                  </h4>

                  <p className="elm-p AboutEditorial-highlight-description">
                    {item.description || ""}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Optional additional content */}
        {visibility.additionalContent &&
          content.additionalContent && (
            <div className="AboutEditorial-additional">
              <span className="AboutEditorial-additional-mark">✳</span>
              <p className="elm-p">
                {content.additionalContent}
              </p>
            </div>
          )}

        {/* Editorial footer and CTA */}
        {visibility.actions && actions.length > 0 && (
          <footer className="AboutEditorial-footer">
            <div className="AboutEditorial-footer-copy">
              <span className="AboutEditorial-index">
                (03 — WHAT'S NEXT)
              </span>

              <h3 className="elm-h3 AboutEditorial-footer-title">
                Let's make something
                <br />
                worth remembering.
              </h3>
            </div>

            <div className="AboutEditorial-actions">
              {actions.map((action, index) => (
                <a
                  key={`${action.text || "action"}-${index}`}
                  href={action.href || "#"}
                  className={`elm-btn ${
                    action.type === "primary"
                      ? "elm-btn-primary"
                      : "elm-btn-secondary"
                  } AboutEditorial-button`}
                >
                  {action.text || "Learn More"}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </footer>
        )}
      </div>
    </section>
  );
};

export default AboutEditorial;