import React from "react";
import "./AboutMinimalTypography.css";

const defaultData = {
  content: {
    eyebrow: "About Us",
    headline: "We Build Digital Experiences",
    subheadline:
      "Helping businesses grow through innovative solutions.",
    description:
      "We are a team dedicated to creating meaningful digital experiences through technology, creativity, and collaboration.",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1791335234192-d1cfc722bddb?q=80&w=2070&auto=format&fit=crop",
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

const AboutMinimalTypography = ({ data }) => {
  // Safely handle missing or incomplete data.
  const content = {
    ...defaultData.content,
    ...(data?.content ?? {}),
    media: {
      ...defaultData.content.media,
      ...(data?.content?.media ?? {}),
    },
    highlights:
      data?.content?.highlights ??
      defaultData.content.highlights,
    actions:
      data?.content?.actions ??
      defaultData.content.actions,
  };

  const visibility = {
    ...defaultData.visibility,
    ...(data?.visibility ?? {}),
  };

  return (
    <section
      className="elm-section about-MinimalTypography"
      aria-labelledby="about-MinimalTypography-heading"
    >
      <div className="elm-container about-MinimalTypography__container">
        {visibility.eyebrow && content.eyebrow && (
          <p className="elm-small about-MinimalTypography__eyebrow">
            {content.eyebrow}
          </p>
        )}

        <div className="about-MinimalTypography__intro">
          <div className="about-MinimalTypography__heading">
            {visibility.headline && content.headline && (
              <h1
                id="about-MinimalTypography-heading"
                className="elm-h1 about-MinimalTypography__title"
              >
                {content.headline}
              </h1>
            )}
          </div>

          <div className="about-MinimalTypography__copy">
            {visibility.subheadline && content.subheadline && (
              <h2 className="elm-h4 about-MinimalTypography__subheadline">
                {content.subheadline}
              </h2>
            )}

            {visibility.description && content.description && (
              <p className="elm-p about-MinimalTypography__description">
                {content.description}
              </p>
            )}

            {visibility.actions &&
              Array.isArray(content.actions) &&
              content.actions.map((action, index) => (
                <a
                  key={`${action.href ?? "#"}-${index}`}
                  href={action.href || "#"}
                  className={`elm-btn about-MinimalTypography__action ${
                    action.type === "secondary"
                      ? "elm-btn-secondary"
                      : "elm-btn-primary"
                  }`}
                >
                  {action.text || "Learn More"}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
          </div>
        </div>

        {visibility.media &&
          content.media?.type === "image" &&
          content.media.src && (
            <div className="about-MinimalTypography__media">
              <img
                className="elm-img-cover about-MinimalTypography__image"
                src={content.media.src}
                alt={content.media.alt || ""}
                loading="lazy"
              />
            </div>
          )}

        {visibility.highlights &&
          Array.isArray(content.highlights) &&
          content.highlights.length > 0 && (
            <div className="about-MinimalTypography__highlights">
              {content.highlights.map((item, index) => (
                <article
                  className="about-MinimalTypography__highlight"
                  key={`${item.title || "highlight"}-${index}`}
                >
                  <span className="about-MinimalTypography__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="elm-h3 about-MinimalTypography__highlight-title">
                    {item.title}
                  </h3>

                  <p className="elm-p about-MinimalTypography__highlight-text">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          )}

        {visibility.additionalContent &&
          content.additionalContent && (
            <p className="elm-text-muted about-MinimalTypography__footer">
              {content.additionalContent}
            </p>
          )}
      </div>
    </section>
  );
};

export default AboutMinimalTypography;