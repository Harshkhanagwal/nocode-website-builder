
import React from "react";
import "./AboutTimeline.css";

const DEFAULT_ABOUT_TIMELINE_DATA = {
  content: {
    eyebrow: "About Us",
    headline: "We Build Digital Experiences",
    subheadline:
      "Helping businesses grow through innovative solutions.",
    description:
      "We are a team dedicated to creating meaningful digital experiences through technology, creativity, and collaboration.",
    media: {
      type: "image",
      src: "https://plus.unsplash.com/premium_photo-1789652752045-7db8caff8c0c?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      alt: "Our team working together",
    },
    highlights: [
      {
        title: "The Beginning",
        description:
          "We started with a simple goal: make digital experiences more useful, accessible, and meaningful.",
        year: "2020",
      },
      {
        title: "Our Mission",
        description:
          "To empower businesses with accessible digital solutions.",
        year: "2022",
      },
      {
        title: "Our Vision",
        description:
          "To make technology simple and impactful for everyone.",
        year: "2024",
      },
      {
        title: "Looking Ahead",
        description:
          "We continue to explore new technologies and build better digital experiences.",
        year: "2026",
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

const AboutTimeline = ({
  data = DEFAULT_ABOUT_TIMELINE_DATA,
}) => {
  const content = {
    ...DEFAULT_ABOUT_TIMELINE_DATA.content,
    ...(data?.content || {}),
  };

  const visibility = {
    ...DEFAULT_ABOUT_TIMELINE_DATA.visibility,
    ...(data?.visibility || {}),
  };

  const media = {
    ...DEFAULT_ABOUT_TIMELINE_DATA.content.media,
    ...(content.media || {}),
  };

  const highlights = Array.isArray(content.highlights)
    ? content.highlights
    : DEFAULT_ABOUT_TIMELINE_DATA.content.highlights;

  const actions = Array.isArray(content.actions)
    ? content.actions.filter(Boolean)
    : DEFAULT_ABOUT_TIMELINE_DATA.content.actions;

  return (
    <section className="elm-section AboutTimeline-section">
      <div className="elm-container AboutTimeline-container">

        {/* Section introduction */}
        <header className="AboutTimeline-header">
          {visibility.eyebrow && content.eyebrow && (
            <div className="AboutTimeline-eyebrow">
              <span className="AboutTimeline-eyebrow-line" />
              <span>{content.eyebrow}</span>
            </div>
          )}

          <div className="AboutTimeline-heading-layout">
            <div className="AboutTimeline-heading-main">
              {visibility.headline && content.headline && (
                <h2 className="elm-h2 AboutTimeline-headline">
                  {content.headline}
                </h2>
              )}
            </div>

            <div className="AboutTimeline-heading-aside">
              {visibility.subheadline && content.subheadline && (
                <h3 className="elm-h4 AboutTimeline-subheadline">
                  {content.subheadline}
                </h3>
              )}

              {visibility.description && content.description && (
                <p className="elm-p AboutTimeline-description">
                  {content.description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Timeline and media */}
        <div className="AboutTimeline-body">
          <div className="AboutTimeline-main">
            {visibility.highlights && highlights.length > 0 && (
              <div className="AboutTimeline-track">
                {highlights.map((item, index) => {
                  if (!item) return null;

                  return (
                    <article
                      className="AboutTimeline-item"
                      key={`${item.title || "milestone"}-${index}`}
                    >
                      <div className="AboutTimeline-marker-column">
                        <span className="AboutTimeline-marker">
                          <span className="AboutTimeline-marker-inner" />
                        </span>
                      </div>

                      <div className="AboutTimeline-item-content">
                        <div className="AboutTimeline-item-meta">
                          <span className="AboutTimeline-year">
                            {item.year ||
                              `MILESTONE ${String(index + 1).padStart(2, "0")}`}
                          </span>

                          <span className="AboutTimeline-item-number">
                            / {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h3 className="elm-h3 AboutTimeline-item-title">
                          {item.title || `Milestone ${index + 1}`}
                        </h3>

                        <p className="elm-p AboutTimeline-item-description">
                          {item.description || ""}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {visibility.additionalContent &&
              content.additionalContent && (
                <div className="AboutTimeline-note">
                  <span className="AboutTimeline-note-symbol">✳</span>
                  <p className="elm-p">
                    {content.additionalContent}
                  </p>
                </div>
              )}
          </div>

          {/* Image panel */}
          {visibility.media && media.src && (
            <aside className="AboutTimeline-aside">
              <div className="AboutTimeline-image-wrap">
                <img
                  className="elm-img elm-img-cover AboutTimeline-image"
                  src={media.src}
                  alt={media.alt || "About our team"}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />

                <span className="AboutTimeline-image-index">
                  OUR STORY — 01
                </span>
              </div>

              <div className="AboutTimeline-aside-caption">
                <span className="AboutTimeline-caption-dot" />
                <p className="elm-p">
                  Every milestone starts with an idea.
                </p>
              </div>
            </aside>
          )}
        </div>

        {/* Bottom call to action */}
        {visibility.actions && actions.length > 0 && (
          <footer className="AboutTimeline-footer">
            <div className="AboutTimeline-footer-copy">
              <span className="AboutTimeline-footer-eyebrow">
                THE NEXT CHAPTER
              </span>

              <h3 className="elm-h3 AboutTimeline-footer-title">
                There is more to the story.
              </h3>
            </div>

            <div className="AboutTimeline-actions">
              {actions.map((action, index) => (
                <a
                  key={`${action.text || "action"}-${index}`}
                  className={`elm-btn ${
                    action.type === "primary"
                      ? "elm-btn-primary"
                      : "elm-btn-secondary"
                  } AboutTimeline-button`}
                  href={action.href || "#"}
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

export default AboutTimeline;