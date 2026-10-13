
import React from "react";
import "./ColumnSectionClassic.css";

const ColumnSectionClassic = ({ data = {} }) => {
  const fallbackData = {
    type: "columns",
    content: {
      eyebrow: "Our Features",
      headline: "Everything You Need",
      subheadline: "Powerful tools to help you grow.",
      items: [
        {
          title: "Fast Performance",
          description:
            "Deliver a fast and seamless experience to your users.",
        },
        {
          title: "Secure Platform",
          description:
            "Keep your data safe with reliable security.",
        },
        {
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

  return (
    <section className="ColumnSectionClassic elm-section elm-body">
      <div className="ColumnSectionClassic__container elm-container elm-container-xl">
        <header className="ColumnSectionClassic__header">
          {visibility.eyebrow && content.eyebrow && (
            <span className="ColumnSectionClassic__eyebrow elm-small">
              {content.eyebrow}
            </span>
          )}

          {visibility.headline && content.headline && (
            <h2 className="ColumnSectionClassic__headline elm-h2">
              {content.headline}
            </h2>
          )}

          {visibility.subheadline && content.subheadline && (
            <p className="ColumnSectionClassic__subheadline elm-p">
              {content.subheadline}
            </p>
          )}
        </header>

        {visibility.items && items.length > 0 && (
          <div className="ColumnSectionClassic__grid">
            {items.map((item, index) => (
              <article
                className="ColumnSectionClassic__item"
                key={`${item?.title || "feature"}-${index}`}
              >
                <div
                  className="ColumnSectionClassic__number"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="ColumnSectionClassic__title elm-h4">
                  {item?.title || "Feature title"}
                </h3>

                <p className="ColumnSectionClassic__description elm-p">
                  {item?.description ||
                    "Discover the tools and features that help you do more."}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ColumnSectionClassic;
