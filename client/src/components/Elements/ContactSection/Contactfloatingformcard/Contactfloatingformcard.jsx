import React, { useState } from "react";
import "./ContactFloatingFormCard.css";

/* ------------------------------------------------------------------ */
/* Dummy data (used when no `data` prop is passed, so nothing throws)  */
/* ------------------------------------------------------------------ */
export const defaultContactFloatingFormCardData = {
  type: "contact",
  content: {
    eyebrow: "Get in Touch",
    headline: "Contact Us",
    subheadline:
      "Have a question or project in mind? We'd love to hear from you.",
    contactDetails: [
      {
        type: "email",
        label: "Email",
        value: "hello@example.com",
        href: "mailto:hello@example.com",
      },
      {
        type: "phone",
        label: "Phone",
        value: "+1 234 567 890",
        href: "tel:+1234567890",
      },
      {
        type: "address",
        label: "Address",
        value: "123 Main Street, New York, NY",
      },
    ],
    form: {
      title: "Send Us a Message",
      submitText: "Send Message",
      successMessage: "Your message has been sent successfully.",
      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          placeholder: "Enter your name",
          required: true,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          placeholder: "Enter your email",
          required: true,
        },
        {
          name: "subject",
          label: "Subject",
          type: "text",
          placeholder: "Enter subject",
          required: false,
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          placeholder: "Write your message",
          required: true,
        },
      ],
    },
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/example" },
      { platform: "linkedin", url: "https://linkedin.com/company/example" },
    ],
    map: { type: "embed", src: "", alt: "Our office location" },
    additionalContent: "We typically respond within 24 hours.",
  },
  visibility: {
    eyebrow: true,
    headline: true,
    subheadline: true,
    contactDetails: true,
    form: true,
    socialLinks: true,
    map: false,
    additionalContent: false,
  },
};

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const svgProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

const ICONS = {
  email: (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg {...svgProps}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  address: (
    <svg {...svgProps}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  instagram: (
    <svg {...svgProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  linkedin: (
    <svg {...svgProps}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v5M8 8v.01M12 16v-5m0 2.5a2.5 2.5 0 0 1 5 0V16" />
    </svg>
  ),
  facebook: (
    <svg {...svgProps}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z" />
    </svg>
  ),
  twitter: (
    <svg {...svgProps}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  ),
  youtube: (
    <svg {...svgProps}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="m10 9.5 5 2.5-5 2.5Z" />
    </svg>
  ),
  link: (
    <svg {...svgProps}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" />
    </svg>
  ),
  check: (
    <svg {...svgProps} width={28} height={28} strokeWidth={2.2}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
};

const getIcon = (key) => ICONS[key] || ICONS.link;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildInitialValues = (fields = []) =>
  fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});

const validate = (fields = [], values) => {
  const errors = {};
  fields.forEach((f) => {
    const v = (values[f.name] || "").trim();
    if (f.required && !v) {
      errors[f.name] = `${f.label || "This field"} is required.`;
    } else if (v && f.type === "email" && !EMAIL_PATTERN.test(v)) {
      errors[f.name] = "Enter a valid email address.";
    }
  });
  return errors;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function ContactFloatingFormCard({
  data = defaultContactFloatingFormCardData,
  onSubmit,
}) {
  const content = data?.content || {};
  const visibility = data?.visibility || {};
  const show = (key) => visibility[key] !== false && Boolean(content[key]);

  const form = content.form || {};
  const fields = Array.isArray(form.fields) ? form.fields : [];
  const details = Array.isArray(content.contactDetails)
    ? content.contactDetails
    : [];
  const socials = Array.isArray(content.socialLinks) ? content.socialLinks : [];
  const map = content.map || {};

  const [values, setValues] = useState(() => buildInitialValues(fields));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(fields, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("sending");
    try {
      if (typeof onSubmit === "function") {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600)); // dummy
      }
      setStatus("success");
      setValues(buildInitialValues(fields));
    } catch (err) {
      setStatus("error");
    }
  };

  const showHeader =
    show("eyebrow") || show("headline") || show("subheadline");

  return (
    <section
      className="elm-section elm-root floating-form-card"
      aria-labelledby="floating-form-card-headline"
    >
      <div className="elm-container elm-container-xl floating-form-card__inner">
        {/* Header (sits on the colour band) */}
        {showHeader && (
          <header className="floating-form-card__header">
            {show("eyebrow") && (
              <p className="floating-form-card__eyebrow">{content.eyebrow}</p>
            )}
            {show("headline") && (
              <h2
                id="floating-form-card-headline"
                className="elm-h2 floating-form-card__headline"
              >
                {content.headline}
              </h2>
            )}
            {show("subheadline") && (
              <p className="elm-p floating-form-card__subheadline">
                {content.subheadline}
              </p>
            )}
          </header>
        )}

        {/* Floating card */}
        {show("form") && (
          <div className="floating-form-card__card">
            {status === "success" ? (
              <div className="floating-form-card__success" role="status">
                <span className="floating-form-card__success-icon">
                  {ICONS.check}
                </span>
                <h3 className="elm-h4 floating-form-card__success-title">
                  {form.successMessage || "Message sent."}
                </h3>
                <button
                  type="button"
                  className="elm-btn elm-btn-secondary floating-form-card__reset"
                  onClick={() => setStatus("idle")}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className="floating-form-card__form"
                onSubmit={handleSubmit}
                noValidate
              >
                {form.title && (
                  <h3 className="elm-h4 floating-form-card__form-title">
                    {form.title}
                  </h3>
                )}

                <div className="floating-form-card__fields">
                  {fields.map((field) => {
                    const id = `floating-form-card-${field.name}`;
                    const error = errors[field.name];
                    const isArea = field.type === "textarea";
                    const Control = isArea ? "textarea" : "input";
                    return (
                      <div
                        key={field.name}
                        className={
                          "floating-form-card__field" +
                          (isArea ? " floating-form-card__field--full" : "") +
                          (error ? " floating-form-card__field--error" : "")
                        }
                      >
                        <label htmlFor={id} className="floating-form-card__label">
                          {field.label}
                          {field.required && (
                            <span
                              className="floating-form-card__required"
                              aria-hidden="true"
                            >
                              {" "}*
                            </span>
                          )}
                        </label>
                        <Control
                          id={id}
                          name={field.name}
                          className="floating-form-card__control"
                          placeholder={field.placeholder}
                          required={field.required}
                          value={values[field.name] || ""}
                          onChange={handleChange}
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? `${id}-error` : undefined}
                          {...(isArea
                            ? { rows: 5 }
                            : { type: field.type || "text" })}
                        />
                        {error && (
                          <span
                            id={`${id}-error`}
                            className="floating-form-card__error"
                          >
                            {error}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {status === "error" && (
                  <p className="floating-form-card__alert" role="alert">
                    Your message couldn't be sent. Check your connection and try
                    again.
                  </p>
                )}

                <button
                  type="submit"
                  className="elm-btn elm-btn-primary floating-form-card__submit"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending…"
                    : form.submitText || "Send Message"}
                </button>

                {show("additionalContent") && (
                  <p className="floating-form-card__note">
                    {content.additionalContent}
                  </p>
                )}
              </form>
            )}
          </div>
        )}

        {/* Details + socials (sit below the band, beside the card) */}
        {(show("contactDetails") || show("socialLinks")) && (
          <aside className="floating-form-card__details">
            {show("contactDetails") && details.length > 0 && (
              <ul className="elm-ul floating-form-card__list">
                {details.map((item, i) => {
                  const body = item.href ? (
                    <a
                      className="elm-a floating-form-card__detail-value"
                      href={item.href}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="floating-form-card__detail-value">
                      {item.value}
                    </span>
                  );
                  return (
                    <li
                      key={`${item.type}-${i}`}
                      className="elm-li floating-form-card__detail"
                    >
                      <span className="floating-form-card__detail-icon">
                        {getIcon(item.type)}
                      </span>
                      <span className="floating-form-card__detail-text">
                        <span className="floating-form-card__detail-label">
                          {item.label}
                        </span>
                        {body}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {show("socialLinks") && socials.length > 0 && (
              <ul className="floating-form-card__socials" aria-label="Social media">
                {socials.map((s, i) => (
                  <li key={`${s.platform}-${i}`}>
                    <a
                      className="floating-form-card__social"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      title={s.platform}
                    >
                      {getIcon(s.platform)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        {/* Map */}
        {show("map") && (
          <div className="floating-form-card__map">
            {map.src ? (
              <iframe
                className="floating-form-card__map-frame"
                src={map.src}
                title={map.alt || "Map"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="floating-form-card__map-empty">
                {map.alt || "Map unavailable"}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}