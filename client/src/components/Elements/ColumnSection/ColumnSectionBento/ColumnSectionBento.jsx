
import React from "react";
import "./ColumnSectionBento.css";

const ColumnSectionBento = ({ data = {} }) => {
  const fallbackData = {
    type: "columns",
    content: {
      eyebrow: "Our Features",
      headline: "Everything You Need",
      subheadline: "Powerful tools to help you grow.",
      items: [
        {
          icon: "zap",
          title: "Fast Performance",
          description:
            "Deliver a fast and seamless experience to your users.",
        },
        {
          icon: "shield-check",
          title: "Secure Platform",
          description:
            "Keep your data safe with reliable security.",
        },
        {
          icon: "layers",
          title: "Easy Integration",
          description:
            "Connect your favorite tools with minimal effort.",
        },
      ],
    },
    visibility: {
      eyebrow: true,
      headline: true,
      subheadline: true,
      items: true,
    },
  };

  const content = {
    ...fallbackData.content,
    ...(data?.content || {}),
  };

  const visibility = {
    ...fallbackData.visibility,
    ...(data?.visibility || {}),
  };

  const items = Array.isArray(content.items)
    ? content.items
    : fallbackData.content.items;

  // Prevent empty grids and ensure all item fields have safe values.
  const safeItems = items.map((item) => ({
    title: "Feature title",
    description: "Discover tools that help you do more.",
    ...item,
  }));

  return (
    <section className="ColumnSectionBento elm-section elm-body">
      <div className="ColumnSectionBento__container elm-container elm-container-xl">
        <header className="ColumnSectionBento__header">
          {visibility.eyebrow && content.eyebrow && (
            <span className="ColumnSectionBento__eyebrow elm-small">
              {content.eyebrow}
            </span>
          )}

          {visibility.headline && content.headline && (
            <h2 className="ColumnSectionBento__headline elm-h2">
              {content.headline}
            </h2>
          )}

          {visibility.subheadline && content.subheadline && (
            <p className="ColumnSectionBento__subheadline elm-p">
              {content.subheadline}
            </p>
          )}
        </header>

        {visibility.items && safeItems.length > 0 && (
          <div className="ColumnSectionBento__grid">
            {safeItems.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className={`ColumnSectionBento__card ColumnSectionBento__card--${index % 3}`}
              >
                <div className="ColumnSectionBento__cardTop">
                  <span className="ColumnSectionBento__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="ColumnSectionBento__accent" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>

                <div className="ColumnSectionBento__cardContent">
                  <h3 className="ColumnSectionBento__title elm-h4">
                    {item.title || "Feature title"}
                  </h3>

                  <p className="ColumnSectionBento__description elm-p">
                    {item.description ||
                      "Discover tools that help you do more."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ColumnSectionBento;
