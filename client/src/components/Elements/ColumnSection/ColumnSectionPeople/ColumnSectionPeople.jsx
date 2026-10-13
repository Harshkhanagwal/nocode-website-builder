
import React from "react";
import "./ColumnSectionPeople.css";

const fallbackData = {
  type: "columns",
  content: {
    eyebrow: "THE TEAM",
    headline: "People Behind the Project",
    subheadline:
      "Meet the creative minds turning ideas into meaningful digital experiences.",
    items: [
      {
        title: "Alex Morgan",
        role: "Creative Director",
        description:
          "Shapes the vision and creative direction behind every project.",
        image: "https://i.pravatar.cc/600?img=12",
      },
      {
        title: "Jordan Lee",
        role: "Lead Developer",
        description:
          "Transforms thoughtful designs into fast, reliable digital products.",
        image: "https://i.pravatar.cc/600?img=11",
      },
      {
        title: "Taylor Smith",
        role: "UI/UX Designer",
        description:
          "Creates intuitive experiences that connect people with technology.",
        image: "https://i.pravatar.cc/600?img=47",
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

const ColumnSectionPeople = ({ data = {} }) => {
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
    <section className="ColumnSectionPeople">
      <div className="ColumnSectionPeople__container">
        <header className="ColumnSectionPeople__header">
          {visibility.eyebrow && (
            <p className="ColumnSectionPeople__eyebrow">
              {content.eyebrow}
            </p>
          )}

          {visibility.headline && (
            <h2 className="ColumnSectionPeople__headline">
              {content.headline}
            </h2>
          )}

          {visibility.subheadline && (
            <p className="ColumnSectionPeople__subheadline">
              {content.subheadline}
            </p>
          )}
        </header>

        {visibility.items && (
          <div className="ColumnSectionPeople__grid">
            {items.map((item, index) => {
              const title = item?.title || `Team Member ${index + 1}`;
              const role = item?.role || "Team Member";
              const description =
                item?.description ||
                "Bringing ideas to life through creativity and collaboration.";

              const image =
                typeof item?.image === "string" && item.image.trim()
                  ? item.image
                  : fallbackData.content.items[
                      index % fallbackData.content.items.length
                    ].image;

              return (
                <article
                  className="ColumnSectionPeople__card"
                  key={`${title}-${index}`}
                >
                  <div className="ColumnSectionPeople__imageWrap">
                    <img
                      className="ColumnSectionPeople__image"
                      src={image}
                      alt={title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          fallbackData.content.items[
                            index % fallbackData.content.items.length
                          ].image;
                      }}
                    />

                    <span className="ColumnSectionPeople__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="ColumnSectionPeople__details">
                    <div className="ColumnSectionPeople__identity">
                      <h3 className="ColumnSectionPeople__name">
                        {title}
                      </h3>

                      <p className="ColumnSectionPeople__role">
                        {role}
                      </p>
                    </div>

                    <p className="ColumnSectionPeople__description">
                      {description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ColumnSectionPeople;
