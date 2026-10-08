import React from "react";
import "./SplitHero.css";

const SplitHero = ({ data }) => {
  const { content, visibility = {} } = data;

  return (
    <section className="Split-hero">
      <div className="Split-hero-content">

        {visibility.eyebrow !== false && content.eyebrow && (
          <p className="Split-hero-eyebrow">
            {content.eyebrow}
          </p>
        )}

        {visibility.headline !== false && content.headline && (
          <h1 className="Split-hero-title">
            {content.headline}
          </h1>
        )}

        {visibility.subheadline !== false && content.subheadline && (
          <p className="Split-hero-subheadline">
            {content.subheadline}
          </p>
        )}

        {visibility.description !== false && content.description && (
          <p className="Split-hero-description">
            {content.description}
          </p>
        )}

        {visibility.actions !== false &&
          content.actions?.length > 0 && (
            <div className="Split-hero-actions">
              {content.actions.map((action, index) => (
                <a
                  key={`${action.text}-${index}`}
                  href={action.href}
                  className={`Split-hero-button Split-hero-button-${action.type}`}
                >
                  {action.text}
                </a>
              ))}
            </div>
          )}

        {visibility.trustIndicators !== false &&
          content.trustIndicators?.length > 0 && (
            <div className="Split-hero-trust">
              {content.trustIndicators.map((indicator, index) => (
                <span
                  key={`${indicator.content}-${index}`}
                  className="Split-hero-trust-item"
                >
                  {indicator.content}
                </span>
              ))}
            </div>
          )}

        {visibility.features !== false &&
          content.features?.length > 0 && (
            <div className="Split-hero-features">
              {content.features.map((feature, index) => (
                <article
                  key={`${feature.title}-${index}`}
                  className="Split-hero-feature"
                >
                  {feature.title && (
                    <h3 className="Split-hero-feature-title">
                      {feature.title}
                    </h3>
                  )}

                  {feature.description && (
                    <p className="Split-hero-feature-description">
                      {feature.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

        {visibility.additionalContent !== false &&
          content.additionalContent && (
            <p className="Split-hero-additional-content">
              {content.additionalContent}
            </p>
          )}
      </div>

      {visibility.media !== false &&
        content.media?.type === "image" &&
        content.media.src && (
          <div className="Split-hero-media">
            <img
              className="Split-hero-image"
              src={content.media.src}
              alt={content.media.alt || ""}
            />
          </div>
        )}
    </section>
  );
};

export default SplitHero;