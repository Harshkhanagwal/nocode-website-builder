import React from "react";
import "./CinematicCornerHero.css";

const CinematicCornerHero = ({ data }) => {
  const { content, visibility = {} } = data;

  return (
    <section className="Cinematic-Corner-Hero">

      {/* Background Image */}
      {visibility.media !== false &&
        content.media?.type === "image" &&
        content.media.src && (
          <img
            className="Cinematic-Corner-Hero-image"
            src={content.media.src}
            alt={content.media.alt || ""}
          />
        )}

      {/* Cinematic Overlay */}
      <div className="Cinematic-Corner-Hero-overlay" />

      {/* Decorative Frame */}
      <div className="Cinematic-Corner-Hero-frame" />

      {/* Top Content */}
      <div className="Cinematic-Corner-Hero-top">
        {visibility.eyebrow !== false && content.eyebrow && (
          <p className="Cinematic-Corner-Hero-eyebrow">
            {content.eyebrow}
          </p>
        )}
      </div>

      {/* Bottom Content */}
      <div className="Cinematic-Corner-Hero-bottom">

        {/* Left Corner */}
        <div className="Cinematic-Corner-Hero-left">

          {visibility.headline !== false && content.headline && (
            <h1 className="Cinematic-Corner-Hero-title">
              {content.headline}
            </h1>
          )}

          {visibility.subheadline !== false &&
            content.subheadline && (
              <p className="Cinematic-Corner-Hero-subheadline">
                {content.subheadline}
              </p>
            )}

        </div>

        {/* Right Corner */}
        <div className="Cinematic-Corner-Hero-right">

          {visibility.description !== false &&
            content.description && (
              <p className="Cinematic-Corner-Hero-description">
                {content.description}
              </p>
            )}

          {visibility.actions !== false &&
            content.actions?.length > 0 && (
              <div className="Cinematic-Corner-Hero-actions">
                {content.actions.map((action, index) => (
                  <a
                    key={`${action.text}-${index}`}
                    href={action.href}
                    className={`Cinematic-Corner-Hero-button Cinematic-Corner-Hero-button-${action.type}`}
                  >
                    {action.text}
                  </a>
                ))}
              </div>
            )}

        </div>
      </div>

      {/* Trust Indicators */}
      {visibility.trustIndicators !== false &&
        content.trustIndicators?.length > 0 && (
          <div className="Cinematic-Corner-Hero-trust">
            {content.trustIndicators.map((indicator, index) => (
              <span
                key={`${indicator.content}-${index}`}
                className="Cinematic-Corner-Hero-trust-item"
              >
                {indicator.content}
              </span>
            ))}
          </div>
        )}

      {/* Features */}
      {visibility.features !== false &&
        content.features?.length > 0 && (
          <div className="Cinematic-Corner-Hero-features">
            {content.features.map((feature, index) => (
              <article
                key={`${feature.title}-${index}`}
                className="Cinematic-Corner-Hero-feature"
              >
                {feature.title && (
                  <h3 className="Cinematic-Corner-Hero-feature-title">
                    {feature.title}
                  </h3>
                )}

                {feature.description && (
                  <p className="Cinematic-Corner-Hero-feature-description">
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
          <p className="Cinematic-Corner-Hero-additional">
            {content.additionalContent}
          </p>
        )}

    </section>
  );
};

export default CinematicCornerHero;