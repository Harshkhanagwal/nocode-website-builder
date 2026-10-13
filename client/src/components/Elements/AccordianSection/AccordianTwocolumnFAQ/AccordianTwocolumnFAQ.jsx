
import React, { useState } from "react";
import "./AccordianTwocolumnFAQ.css";

const AccordianTwocolumnFAQ = ({ data = {} }) => {
  const fallbackData = {
    type: "accordion",
    content: {
      eyebrow: "FAQ",
      headline: "Frequently Asked Questions",
      subheadline: "Find answers to common questions.",
      items: [
        {
          title: "What is your platform?",
          description:
            "Our platform helps you build websites without writing code.",
          defaultOpen: true,
        },
        {
          title: "Do I need coding experience?",
          description:
            "No. You can create and customize websites using a visual editor.",
          defaultOpen: false,
        },
        {
          title: "Can I customize my website?",
          description:
            "Yes. You can customize content, layouts, and other design options.",
          defaultOpen: false,
        },
        {
          title: "Can I change my design later?",
          description:
            "Yes. Update your layouts, colors, typography, and content whenever you need.",
          defaultOpen: false,
        },
        {
          title: "Is the platform mobile-friendly?",
          description:
            "Yes. You can build responsive websites that adapt to different screen sizes.",
          defaultOpen: false,
        },
        {
          title: "Can I publish my website?",
          description:
            "Yes. Once your design is ready, you can publish your website using your supported deployment workflow.",
          defaultOpen: false,
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

  const items = Array.isArray(content.items) ? content.items : [];

  // Merge provided items with safe defaults.
  const safeItems = items.map((item) => ({
    title: "Frequently asked question",
    description: "More information will be available soon.",
    defaultOpen: false,
    ...item,
  }));

  // The first item defaults to open only when no explicit defaultOpen
  // property is provided for any item.
  const hasExplicitDefault = safeItems.some(
    (item) => typeof item.defaultOpen === "boolean"
  );

  const [openItems, setOpenItems] = useState(() => {
    if (!hasExplicitDefault && safeItems.length > 0) {
      return new Set([0]);
    }

    return new Set(
      safeItems
        .map((item, index) =>
          item.defaultOpen === true ? index : -1
        )
        .filter((index) => index !== -1)
    );
  });

  const toggleItem = (index) => {
    setOpenItems((previous) => {
      const next = new Set(previous);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  // Split items evenly while preserving their original order.
  const midpoint = Math.ceil(safeItems.length / 2);
  const columns = [
    safeItems.slice(0, midpoint),
    safeItems.slice(midpoint),
  ];

  return (
    <section className="AccordianTwocolumnFAQ elm-section elm-body">
      <div className="AccordianTwocolumnFAQ__container elm-container elm-container-xl">
        <header className="AccordianTwocolumnFAQ__header">
          {visibility.eyebrow && content.eyebrow && (
            <span className="AccordianTwocolumnFAQ__eyebrow elm-small">
              {content.eyebrow}
            </span>
          )}

          {visibility.headline && content.headline && (
            <h2 className="AccordianTwocolumnFAQ__headline elm-h2">
              {content.headline}
            </h2>
          )}

          {visibility.subheadline && content.subheadline && (
            <p className="AccordianTwocolumnFAQ__subheadline elm-p">
              {content.subheadline}
            </p>
          )}
        </header>

        {visibility.items && safeItems.length > 0 && (
          <div className="AccordianTwocolumnFAQ__grid">
            {columns.map((column, columnIndex) => (
              <div
                className="AccordianTwocolumnFAQ__column"
                key={columnIndex}
              >
                {column.map((item, localIndex) => {
                  const index =
                    columnIndex === 0
                      ? localIndex
                      : midpoint + localIndex;

                  const isOpen = openItems.has(index);
                  const answerId =
                    `AccordianTwocolumnFAQ__answer-${index}`;

                  return (
                    <article
                      className={`AccordianTwocolumnFAQ__item ${
                        isOpen
                          ? "AccordianTwocolumnFAQ__item--open"
                          : ""
                      }`}
                      key={`${item.title}-${index}`}
                    >
                      <button
                        type="button"
                        className="AccordianTwocolumnFAQ__trigger"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => toggleItem(index)}
                      >
                        <span className="AccordianTwocolumnFAQ__question">
                          {item.title}
                        </span>

                        <span
                          className="AccordianTwocolumnFAQ__icon"
                          aria-hidden="true"
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      <div
                        className="AccordianTwocolumnFAQ__answer"
                        id={answerId}
                        hidden={!isOpen}
                      >
                        <div className="AccordianTwocolumnFAQ__answerInner elm-text-muted">
                          {item.description}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AccordianTwocolumnFAQ;
