
import React, { useState } from "react";
import "./AccordianBorderlessminimal.css";

const defaultData = {
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
    ],
  },
  visibility: {
    eyebrow: true,
    headline: true,
    subheadline: true,
    items: true,
  },
};

const AccordianBorderlessminimal = ({ data = defaultData }) => {
  const content = data?.content ?? defaultData.content;
  const visibility = {
    ...defaultData.visibility,
    ...(data?.visibility ?? {}),
  };

  const items = Array.isArray(content.items) ? content.items : [];

  const [openItems, setOpenItems] = useState(() => {
    const initialOpen = new Set();

    items.forEach((item, index) => {
      if (item?.defaultOpen) {
        initialOpen.add(index);
      }
    });

    return initialOpen;
  });

  const toggleItem = (index) => {
    setOpenItems((previous) => {
      const updated = new Set(previous);

      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }

      return updated;
    });
  };

  return (
    <section
      className="elm-section AccordianBorderlessminimal"
      aria-labelledby="AccordianBorderlessminimal-heading"
    >
      <div className="elm-container AccordianBorderlessminimal__container">
        <div className="AccordianBorderlessminimal__layout">
          <div className="AccordianBorderlessminimal__intro">
            {visibility.eyebrow && content.eyebrow && (
              <p className="elm-small AccordianBorderlessminimal__eyebrow">
                {content.eyebrow}
              </p>
            )}

            {visibility.headline && content.headline && (
              <h2
                id="AccordianBorderlessminimal-heading"
                className="elm-h1 AccordianBorderlessminimal__headline"
              >
                {content.headline}
              </h2>
            )}

            {visibility.subheadline && content.subheadline && (
              <p className="elm-p AccordianBorderlessminimal__subheadline">
                {content.subheadline}
              </p>
            )}
          </div>

          {visibility.items && (
            <div className="AccordianBorderlessminimal__list">
              {items.map((item, index) => {
                const isOpen = openItems.has(index);
                const answerId = `AccordianBorderlessminimal-answer-${index}`;

                return (
                  <article
                    className={`AccordianBorderlessminimal__item ${
                      isOpen
                        ? "AccordianBorderlessminimal__item--open"
                        : ""
                    }`}
                    key={`${item.title}-${index}`}
                  >
                    <button
                      type="button"
                      className="AccordianBorderlessminimal__trigger"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleItem(index)}
                    >
                      <span className="AccordianBorderlessminimal__question">
                        {item.title}
                      </span>

                      <span
                        className="AccordianBorderlessminimal__icon"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 9L12 16L19 9"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={answerId}
                      className="AccordianBorderlessminimal__answer"
                      hidden={!isOpen}
                    >
                      <p className="elm-p AccordianBorderlessminimal__answer-text">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccordianBorderlessminimal;
