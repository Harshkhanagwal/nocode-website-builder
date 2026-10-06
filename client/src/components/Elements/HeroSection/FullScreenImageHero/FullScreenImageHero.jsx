import React from "react";
import "./FullScreenImageHero.css";

const FullscreenHero = ({ data }) => {
  const { content, visibility = {} } = data;

  return (
    <section className="Fullscreen-hero">
      {/* Background Image */}
      {visibility.media !== false &&
        content.media?.type === "image" &&
        content.media.src && (
          <img
            className="Fullscreen-hero-image"
            src={content.media.src}
            alt={content.media.alt || ""}
          />
        )}

      {/* Image Overlay */}
      <div className="Fullscreen-hero-overlay" />

      {/* Content */}
      <div className="Fullscreen-hero-content">

        {visibility.eyebrow !== false && content.eyebrow && (
          <p className="Fullscreen-hero-eyebrow">
            {content.eyebrow}
          </p>
        )}

        {visibility.headline !== false && content.headline && (
          <h1 className="Fullscreen-hero-title">
            {content.headline}
          </h1>
        )}

        {visibility.subheadline !== false && content.subheadline && (
          <p className="Fullscreen-hero-subheadline">
            {content.subheadline}
          </p>
        )}

        {visibility.description !== false && content.description && (
          <p className="Fullscreen-hero-description">
            {content.description}
          </p>
        )}

        {visibility.actions !== false &&
          content.actions?.length > 0 && (
            <div className="Fullscreen-hero-actions">
              {content.actions.map((action, index) => (
                <a
                  key={`${action.text}-${index}`}
                  href={action.href}
                  className={`Fullscreen-hero-button Fullscreen-hero-button-${action.type}`}
                >
                  {action.text}
                </a>
              ))}
            </div>
          )}

        {/* Trust Indicators */}
        {visibility.trustIndicators !== false &&
          content.trustIndicators?.length > 0 && (
            <div className="Fullscreen-hero-trust">
              {content.trustIndicators.map((indicator, index) => (
                <span
                  key={`${indicator.content}-${index}`}
                  className="Fullscreen-hero-trust-item"
                >
                  {indicator.content}
                </span>
              ))}
            </div>
          )}

        {/* Features */}
        {visibility.features !== false &&
          content.features?.length > 0 && (
            <div className="Fullscreen-hero-features">
              {content.features.map((feature, index) => (
                <div
                  key={`${feature.title}-${index}`}
                  className="Fullscreen-hero-feature"
                >
                  {feature.title && (
                    <h3 className="Fullscreen-hero-feature-title">
                      {feature.title}
                    </h3>
                  )}

                  {feature.description && (
                    <p className="Fullscreen-hero-feature-description">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Additional Content */}
        {visibility.additionalContent !== false &&
          content.additionalContent && (
            <p className="Fullscreen-hero-additional-content">
              {content.additionalContent}
            </p>
          )}
      </div>
    </section>
  );
};

export default FullscreenHero;