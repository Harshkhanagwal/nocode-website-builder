
import React, { useId, useState } from "react";
import "./AccordianRoundedcards.css";

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
      {
        title: "Is it free to get started?",
        description:
          "You can explore the platform and its available features before choosing a plan that suits your needs.",
        defaultOpen: false,
      },
      {
        title: "Can I use my own domain?",
        description:
          "Yes. Connect a custom domain to your website when supported by your selected plan.",
        defaultOpen: false,
      },
      {
        title: "Can I edit my website later?",
        description:
          "Absolutely. You can return to the editor and update your content, layouts, and design whenever needed.",
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

const AccordianRoundedcards = ({ data = defaultData }) => {
  const content = data?.content ?? defaultData.content;

  const visibility = {
    ...defaultData.visibility,
    ...(data?.visibility ?? {}),
  };

  const items = Array.isArray(content.items) ? content.items : [];
  const componentId = useId();

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
      const next = new Set(previous);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  return (
    <section
      className="elm-section AccordianRoundedcards"
      aria-labelledby={`${componentId}-heading`}
    >
      <div className="elm-container AccordianRoundedcards__container">
        <header className="AccordianRoundedcards__header">
          {visibility.eyebrow && content.eyebrow && (
            <p className="elm-small AccordianRoundedcards__eyebrow">
              {content.eyebrow}
            </p>
          )}

          {visibility.headline && content.headline && (
            <h2
              id={`${componentId}-heading`}
              className="elm-h2 AccordianRoundedcards__headline"
            >
              {content.headline}
            </h2>
          )}

          {visibility.subheadline && content.subheadline && (
            <p className="elm-p AccordianRoundedcards__subheadline">
              {content.subheadline}
            </p>
          )}
        </header>

        {visibility.items && (
          <div className="AccordianRoundedcards__panel">
            <div className="AccordianRoundedcards__list">
              {items.map((item, index) => {
                const isOpen = openItems.has(index);
                const questionId = `${componentId}-question-${index}`;
                const answerId = `${componentId}-answer-${index}`;

                return (
                  <article
                    key={`${item.title}-${index}`}
                    className={`AccordianRoundedcards__card ${
                      isOpen
                        ? "AccordianRoundedcards__card--open"
                        : ""
                    }`}
                  >
                    <button
                      id={questionId}
                      type="button"
                      className="AccordianRoundedcards__trigger"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleItem(index)}
                    >
                      <span className="AccordianRoundedcards__question">
                        {item.title}
                      </span>

                      <span
                        className="AccordianRoundedcards__icon"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19M5 12H19"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            className="AccordianRoundedcards__plus"
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={answerId}
                      className="AccordianRoundedcards__answer"
                      role="region"
                      aria-labelledby={questionId}
                      hidden={!isOpen}
                    >
                      <p className="elm-p AccordianRoundedcards__answer-text">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccordianRoundedcards;
