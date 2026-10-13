
import React from "react";
import "./ColumnSectionServiceCards.css";

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

const ColumnSectionServiceCards = ({ data = {} }) => {
  const content = {
    ...fallbackData.content,
    ...(data?.content || {}),
  };

  const visibility = {
    ...fallbackData.visibility,
    ...(data?.visibility || {}),
  };

  const items =
    Array.isArray(content.items) && content.items.length > 0
      ? content.items
      : fallbackData.content.items;

  return (
    <section className="ColumnSectionServiceCards">
      <div className="ColumnSectionServiceCards__container">
        <header className="ColumnSectionServiceCards__header">
          {visibility.eyebrow && (
            <span className="ColumnSectionServiceCards__eyebrow">
              {content.eyebrow}
            </span>
          )}

          {visibility.headline && (
            <h2 className="ColumnSectionServiceCards__headline">
              {content.headline}
            </h2>
          )}

          {visibility.subheadline && (
            <p className="ColumnSectionServiceCards__subheadline">
              {content.subheadline}
            </p>
          )}
        </header>

        {visibility.items && (
          <div className="ColumnSectionServiceCards__grid">
            {items.map((item, index) => {
              const title = item?.title || `Service ${index + 1}`;
              const description =
                item?.description ||
                "Explore a reliable solution designed around your needs.";

              return (
                <article
                  className="ColumnSectionServiceCards__card"
                  key={`${title}-${index}`}
                >
                  <div className="ColumnSectionServiceCards__cardTop">
                    <span className="ColumnSectionServiceCards__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className="ColumnSectionServiceCards__arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>

                  <div className="ColumnSectionServiceCards__cardContent">
                    <h3 className="ColumnSectionServiceCards__cardTitle">
                      {title}
                    </h3>

                    <p className="ColumnSectionServiceCards__cardDescription">
                      {description}
                    </p>
                  </div>

                  <div
                    className="ColumnSectionServiceCards__cardAccent"
                    aria-hidden="true"
                  />
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ColumnSectionServiceCards;
