import React from "react";
import "./CenteredHero.css";

const CenteredHero = ({ data }) => {
  const { content, visibility = {} } = data;

  return (
    <section className="Centered-hero">
      <div className="Centered-hero-background" />

      <div className="Centered-hero-container">

        {/* Eyebrow */}
        {visibility.eyebrow !== false && content.eyebrow && (
          <p className="Centered-hero-eyebrow">
            {content.eyebrow}
          </p>
        )}

        {/* Headline */}
        {visibility.headline !== false && content.headline && (
          <h1 className="Centered-hero-title">
            {content.headline}
          </h1>
        )}

        {/* Subheadline */}
        {visibility.subheadline !== false && content.subheadline && (
          <p className="Centered-hero-subheadline">
            {content.subheadline}
          </p>
        )}

        {/* Description */}
        {visibility.description !== false && content.description && (
          <p className="Centered-hero-description">
            {content.description}
          </p>
        )}

        {/* Actions */}
        {visibility.actions !== false &&
          content.actions?.length > 0 && (
            <div className="Centered-hero-actions">
              {content.actions.map((action, index) => (
                <a
                  key={`${action.text}-${index}`}
                  href={action.href}
                  className={`Centered-hero-button Centered-hero-button-${action.type}`}
                >
                  {action.text}
                </a>
              ))}
            </div>
          )}

        {/* Media */}
        {visibility.media !== false &&
          content.media?.type === "image" &&
          content.media.src && (
            <div className="Centered-hero-media">
              <img
                className="Centered-hero-image"
                src={content.media.src}
                alt={content.media.alt || ""}
              />
            </div>
          )}

        {/* Trust Indicators */}
        {visibility.trustIndicators !== false &&
          content.trustIndicators?.length > 0 && (
            <div className="Centered-hero-trust">
              {content.trustIndicators.map((indicator, index) => (
                <span
                  key={`${indicator.content}-${index}`}
                  className="Centered-hero-trust-item"
                >
                  {indicator.content}
                </span>
              ))}
            </div>
          )}

        {/* Features */}
        {visibility.features !== false &&
          content.features?.length > 0 && (
            <div className="Centered-hero-features">
              {content.features.map((feature, index) => (
                <article
                  key={`${feature.title}-${index}`}
                  className="Centered-hero-feature"
                >
                  {feature.title && (
                    <h3 className="Centered-hero-feature-title">
                      {feature.title}
                    </h3>
                  )}

                  {feature.description && (
                    <p className="Centered-hero-feature-description">
                      {feature.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

        {/* Additional Content */}
        {visibility.additionalContent !== false &&
          content.additionalContent && (
            <p className="Centered-hero-additional-content">
              {content.additionalContent}
            </p>
          )}

      </div>
    </section>
  );
};

export default CenteredHero;