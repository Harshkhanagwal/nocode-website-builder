
import React, { useId, useState } from "react";
import "./AccordianDarkfuturistic.css";

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

const AccordianDarkfuturistic = ({ data = defaultData }) => {
  const content = data?.content ?? defaultData.content;
  const visibility = {
    ...defaultData.visibility,
    ...(data?.visibility ?? {}),
  };

  const items = Array.isArray(content.items) ? content.items : [];
  const uniqueId = useId();

  const [openItems, setOpenItems] = useState(() => {
    return new Set(
      items.reduce((indexes, item, index) => {
        if (item?.defaultOpen) indexes.push(index);
        return indexes;
      }, [])
    );
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
      className="elm-section AccordianDarkfuturistic"
      aria-labelledby={`${uniqueId}-heading`}
    >
      <div className="elm-container AccordianDarkfuturistic__container">
        <div className="AccordianDarkfuturistic__topline">
          <span className="AccordianDarkfuturistic__status-dot" />
          <span>KNOWLEDGE BASE</span>
          <span className="AccordianDarkfuturistic__topline-index">
            / 001
          </span>
        </div>

        <div className="AccordianDarkfuturistic__layout">
          <div className="AccordianDarkfuturistic__intro">
            {visibility.eyebrow && content.eyebrow && (
              <div className="AccordianDarkfuturistic__eyebrow">
                <span className="AccordianDarkfuturistic__eyebrow-line" />
                <span>{content.eyebrow}</span>
              </div>
            )}

            {visibility.headline && content.headline && (
              <h2
                id={`${uniqueId}-heading`}
                className="elm-h1 AccordianDarkfuturistic__headline"
              >
                {content.headline}
                <span className="AccordianDarkfuturistic__headline-mark">
                  .
                </span>
              </h2>
            )}

            {visibility.subheadline && content.subheadline && (
              <p className="elm-p AccordianDarkfuturistic__subheadline">
                {content.subheadline}
              </p>
            )}

            <div className="AccordianDarkfuturistic__footnote">
              <span className="AccordianDarkfuturistic__footnote-icon">
                ↳
              </span>
              <span>Everything you need to know</span>
            </div>
          </div>

          {visibility.items && (
            <div className="AccordianDarkfuturistic__list">
              {items.map((item, index) => {
                const isOpen = openItems.has(index);
                const answerId = `${uniqueId}-answer-${index}`;
                const questionId = `${uniqueId}-question-${index}`;

                return (
                  <article
                    key={`${item.title}-${index}`}
                    className={`AccordianDarkfuturistic__item ${
                      isOpen
                        ? "AccordianDarkfuturistic__item--open"
                        : ""
                    }`}
                  >
                    <button
                      id={questionId}
                      type="button"
                      className="AccordianDarkfuturistic__trigger"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleItem(index)}
                    >
                      <span className="AccordianDarkfuturistic__item-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="AccordianDarkfuturistic__question">
                        {item.title}
                      </span>

                      <span
                        className="AccordianDarkfuturistic__toggle"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 9L12 15L18 9"
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
                      className="AccordianDarkfuturistic__answer"
                      role="region"
                      aria-labelledby={questionId}
                      hidden={!isOpen}
                    >
                      <div className="AccordianDarkfuturistic__answer-inner">
                        <span className="AccordianDarkfuturistic__answer-marker">
                          RESPONSE
                        </span>

                        <p className="elm-p AccordianDarkfuturistic__answer-text">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="AccordianDarkfuturistic__bottomline">
          <span>FAQ / INTERFACE</span>
          <span className="AccordianDarkfuturistic__bottomline-decoration">
            <span />
            <span />
            <span />
          </span>
          <span>END OF SECTION</span>
        </div>
      </div>
    </section>
  );
};

export default AccordianDarkfuturistic;
