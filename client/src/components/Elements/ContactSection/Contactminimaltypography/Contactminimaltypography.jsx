import React, { useState } from "react";
import "./Contactminimaltypography.css";

/* ------------------------------------------------------------------ */
/* Dummy data – used when no props are passed, so nothing throws.      */
/* ------------------------------------------------------------------ */
const DUMMY_DATA = {
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

const PLATFORM_LABELS = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  x: "X",
  facebook: "Facebook",
  youtube: "YouTube",
  github: "GitHub",
  tiktok: "TikTok",
};

const formatPlatform = (platform = "") =>
  PLATFORM_LABELS[platform.toLowerCase()] ||
  platform.charAt(0).toUpperCase() + platform.slice(1);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
const ContactMinimalTypography = ({
  data = DUMMY_DATA,
  onSubmit,
  className = "",
}) => {
  // Merge with dummy data so missing keys never crash the render.
  const content = { ...DUMMY_DATA.content, ...(data?.content || {}) };
  const visibility = { ...DUMMY_DATA.visibility, ...(data?.visibility || {}) };

  const {
    eyebrow,
    headline,
    subheadline,
    contactDetails = [],
    form = {},
    socialLinks = [],
    map = {},
    additionalContent,
  } = content;

  const fields = Array.isArray(form.fields) ? form.fields : [];

  const initialValues = fields.reduce((acc, f) => {
    acc[f.name] = "";
    return acc;
  }, {});

  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorText, setErrorText] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorText("");
    try {
      if (typeof onSubmit === "function") {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setStatus("success");
      setValues(initialValues);
    } catch (err) {
      setStatus("error");
      setErrorText(
        "The message could not be sent. Check your connection and try again."
      );
    }
  };

  const showForm = visibility.form && fields.length > 0;
  const showDetails = visibility.contactDetails && contactDetails.length > 0;
  const showSocial = visibility.socialLinks && socialLinks.length > 0;
  const showMap = visibility.map && map?.src;
  const showAside = showDetails || showSocial;

  return (
    <section
      className={`elm-section elm-root MinimalTypography ${className}`.trim()}
    >
      <div className="elm-container elm-container-xl MinimalTypography__container">
        {/* ---------- Intro ---------- */}
        <header className="MinimalTypography__intro">
          {visibility.eyebrow && eyebrow && (
            <p className="elm-small elm-text-muted MinimalTypography__eyebrow">
              {eyebrow}
            </p>
          )}
          {visibility.headline && headline && (
            <h1 className="elm-h1 MinimalTypography__headline">{headline}</h1>
          )}
          {visibility.subheadline && subheadline && (
            <p className="elm-p elm-text-muted MinimalTypography__subheadline">
              {subheadline}
            </p>
          )}
        </header>

        <div
          className={`MinimalTypography__grid ${
            showForm && showAside ? "" : "MinimalTypography__grid--single"
          }`.trim()}
        >
          {/* ---------- Details ---------- */}
          {showAside && (
            <aside className="MinimalTypography__aside">
              {showDetails && (
                <dl className="MinimalTypography__details">
                  {contactDetails.map((item, i) => (
                    <div
                      className="MinimalTypography__detail"
                      key={`${item.type}-${i}`}
                    >
                      <dt className="elm-small elm-text-muted MinimalTypography__detailLabel">
                        {item.label}
                      </dt>
                      <dd className="MinimalTypography__detailValue">
                        {item.href ? (
                          <a
                            className="elm-a MinimalTypography__link"
                            href={item.href}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="elm-text">{item.value}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {showSocial && (
                <ul className="elm-ul MinimalTypography__social">
                  {socialLinks.map((s, i) => (
                    <li
                      className="elm-li MinimalTypography__socialItem"
                      key={`${s.platform}-${i}`}
                    >
                      <a
                        className="elm-a MinimalTypography__link"
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {formatPlatform(s.platform)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          )}

          {/* ---------- Form ---------- */}
          {showForm && (
            <div className="MinimalTypography__formWrap">
              {form.title && (
                <h2 className="elm-h3 MinimalTypography__formTitle">
                  {form.title}
                </h2>
              )}

              <form
                className="MinimalTypography__form"
                onSubmit={handleSubmit}
                noValidate={false}
              >
                {fields.map((field) => {
                  const id = `MinimalTypography-${field.name}`;
                  const isTextarea = field.type === "textarea";
                  const Tag = isTextarea ? "textarea" : "input";
                  return (
                    <div className="MinimalTypography__field" key={field.name}>
                      <label
                        className="elm-small MinimalTypography__label"
                        htmlFor={id}
                      >
                        {field.label}
                        {!field.required && (
                          <span className="elm-text-light MinimalTypography__optional">
                            {" "}
                            (optional)
                          </span>
                        )}
                      </label>
                      <Tag
                        id={id}
                        name={field.name}
                        className={`MinimalTypography__input ${
                          isTextarea ? "MinimalTypography__textarea" : ""
                        }`.trim()}
                        placeholder={field.placeholder}
                        required={!!field.required}
                        value={values[field.name] ?? ""}
                        onChange={handleChange}
                        {...(isTextarea
                          ? { rows: 4 }
                          : { type: field.type || "text" })}
                      />
                    </div>
                  );
                })}

                <div className="MinimalTypography__actions">
                  <button
                    type="submit"
                    className="elm-btn elm-btn-primary MinimalTypography__submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending"
                      ? "Sending…"
                      : form.submitText || "Send Message"}
                  </button>

                  <p
                    className={`elm-small MinimalTypography__status ${
                      status === "success"
                        ? "MinimalTypography__status--success"
                        : status === "error"
                        ? "MinimalTypography__status--error"
                        : ""
                    }`.trim()}
                    role="status"
                    aria-live="polite"
                  >
                    {status === "success" && form.successMessage}
                    {status === "error" && errorText}
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ---------- Map ---------- */}
        {showMap && (
          <div className="MinimalTypography__map">
            <iframe
              className="MinimalTypography__mapFrame"
              src={map.src}
              title={map.alt || "Map"}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* ---------- Additional ---------- */}
        {visibility.additionalContent && additionalContent && (
          <p className="elm-small elm-text-muted MinimalTypography__additional">
            {additionalContent}
          </p>
        )}
      </div>
    </section>
  );
};

export default ContactMinimalTypography;
