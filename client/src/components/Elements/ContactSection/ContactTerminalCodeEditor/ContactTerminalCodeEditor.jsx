import React, { useState } from "react";
import "./ContactTerminalCodeEditor.css";

/* ------------------------------------------------------------------ */
/* Dummy data (used when no `data` prop is passed, so nothing throws)  */
/* ------------------------------------------------------------------ */
export const defaultContactTerminalCodeEditorData = {
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
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toKey = (text, fallback) =>
  String(text || fallback || "item")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "item";

const buildInitialValues = (fields = []) =>
  fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});

const validate = (fields = [], values) => {
  const errors = {};
  fields.forEach((f) => {
    const v = (values[f.name] || "").trim();
    if (f.required && !v) {
      errors[f.name] = `${f.label || f.name} is required`;
    } else if (v && f.type === "email" && !EMAIL_PATTERN.test(v)) {
      errors[f.name] = "enter a valid email address";
    }
  });
  return errors;
};

const STATUS_LABEL = {
  idle: "Ready",
  sending: "Sending",
  success: "Sent",
  error: "Failed",
};

/* Small syntax-token helpers keep the markup below readable */
const Kw = ({ children }) => (
  <span className="terminal-code-editor__kw">{children}</span>
);
const Id = ({ children }) => (
  <span className="terminal-code-editor__id">{children}</span>
);
const Str = ({ children }) => (
  <span className="terminal-code-editor__str">{children}</span>
);
const Punc = ({ children }) => (
  <span className="terminal-code-editor__punc">{children}</span>
);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function ContactTerminalCodeEditor({
  data = defaultContactTerminalCodeEditorData,
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
        await new Promise((resolve) => setTimeout(resolve, 700)); // dummy
      }
      setStatus("success");
      setValues(buildInitialValues(fields));
    } catch (err) {
      setStatus("error");
    }
  };

  const showEditor =
    show("eyebrow") ||
    show("headline") ||
    show("subheadline") ||
    (show("contactDetails") && details.length > 0) ||
    (show("socialLinks") && socials.length > 0) ||
    show("additionalContent");

  const showTerminal = show("form");
  const hasBothPanes = showEditor && showTerminal;

  return (
    <section
      className="elm-section elm-root terminal-code-editor"
      aria-labelledby="terminal-code-editor-headline"
    >
      <div className="elm-container elm-container-xl">
        <div className="terminal-code-editor__window">
          {/* Title bar */}
          <div className="terminal-code-editor__titlebar">
            <span className="terminal-code-editor__dots" aria-hidden="true">
              <i className="terminal-code-editor__dot terminal-code-editor__dot--close" />
              <i className="terminal-code-editor__dot terminal-code-editor__dot--min" />
              <i className="terminal-code-editor__dot terminal-code-editor__dot--max" />
            </span>
            <span className="terminal-code-editor__window-title">
              contact — workspace
            </span>
          </div>

          <div
            className={
              "terminal-code-editor__panes" +
              (hasBothPanes ? " terminal-code-editor__panes--split" : "")
            }
          >
            {/* ------------------- Editor pane ------------------- */}
            {showEditor && (
              <div className="terminal-code-editor__pane terminal-code-editor__pane--editor">
                <div className="terminal-code-editor__tab">
                  <span className="terminal-code-editor__tab-name">
                    contact.js
                  </span>
                </div>

                <div className="terminal-code-editor__code">
                  {show("eyebrow") && (
                    <div className="terminal-code-editor__line">
                      <span className="terminal-code-editor__comment">
                        {"// "}
                        {content.eyebrow}
                      </span>
                    </div>
                  )}

                  {show("headline") && (
                    <div className="terminal-code-editor__line terminal-code-editor__line--headline">
                      <Kw>const</Kw> <Id>headline</Id> <Punc>=</Punc>{" "}
                      <h2
                        id="terminal-code-editor-headline"
                        className="elm-h2 terminal-code-editor__headline"
                      >
                        <Str>"{content.headline}"</Str>
                      </h2>
                      <Punc>;</Punc>
                    </div>
                  )}

                  {show("subheadline") && (
                    <div className="terminal-code-editor__line">
                      <Kw>const</Kw> <Id>subheadline</Id> <Punc>=</Punc>{" "}
                      <p className="elm-p terminal-code-editor__subheadline">
                        <Str>"{content.subheadline}"</Str>
                      </p>
                      <Punc>;</Punc>
                    </div>
                  )}

                  {show("contactDetails") && details.length > 0 && (
                    <>
                      <div className="terminal-code-editor__line terminal-code-editor__line--blank" />
                      <div className="terminal-code-editor__line">
                        <Kw>const</Kw> <Id>contact</Id> <Punc>= {"{"}</Punc>
                      </div>
                      {details.map((item, i) => (
                        <div
                          key={`${item.type}-${i}`}
                          className="terminal-code-editor__line terminal-code-editor__line--indent"
                        >
                          <span className="terminal-code-editor__prop">
                            {toKey(item.label, item.type)}
                          </span>
                          <Punc>:</Punc>{" "}
                          {item.href ? (
                            <a
                              className="elm-a terminal-code-editor__link"
                              href={item.href}
                            >
                              "{item.value}"
                            </a>
                          ) : (
                            <Str>"{item.value}"</Str>
                          )}
                          <Punc>,</Punc>
                        </div>
                      ))}
                      <div className="terminal-code-editor__line">
                        <Punc>{"};"}</Punc>
                      </div>
                    </>
                  )}

                  {show("socialLinks") && socials.length > 0 && (
                    <>
                      <div className="terminal-code-editor__line terminal-code-editor__line--blank" />
                      <div className="terminal-code-editor__line">
                        <Kw>const</Kw> <Id>social</Id> <Punc>= {"{"}</Punc>
                      </div>
                      {socials.map((s, i) => (
                        <div
                          key={`${s.platform}-${i}`}
                          className="terminal-code-editor__line terminal-code-editor__line--indent"
                        >
                          <span className="terminal-code-editor__prop">
                            {toKey(s.platform)}
                          </span>
                          <Punc>:</Punc>{" "}
                          <a
                            className="elm-a terminal-code-editor__link"
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.platform}
                          >
                            "{s.url}"
                          </a>
                          <Punc>,</Punc>
                        </div>
                      ))}
                      <div className="terminal-code-editor__line">
                        <Punc>{"};"}</Punc>
                      </div>
                    </>
                  )}

                  {show("additionalContent") && (
                    <>
                      <div className="terminal-code-editor__line terminal-code-editor__line--blank" />
                      <div className="terminal-code-editor__line">
                        <span className="terminal-code-editor__comment">
                          {"// "}
                          {content.additionalContent}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ------------------- Terminal pane ------------------- */}
            {showTerminal && (
              <div className="terminal-code-editor__pane terminal-code-editor__pane--terminal">
                <div className="terminal-code-editor__tab">
                  <span className="terminal-code-editor__tab-name">
                    terminal
                  </span>
                </div>

                <div className="terminal-code-editor__shell">
                  {status === "success" ? (
                    <div className="terminal-code-editor__output" role="status">
                      <p className="terminal-code-editor__prompt-line">
                        <span className="terminal-code-editor__prompt">$</span>{" "}
                        send-message
                      </p>
                      <p className="terminal-code-editor__ok">
                        ✔ {form.successMessage || "Message sent."}
                      </p>
                      <p className="terminal-code-editor__muted">
                        process exited with code 0
                      </p>
                      <button
                        type="button"
                        className="elm-btn elm-btn-secondary terminal-code-editor__reset"
                        onClick={() => setStatus("idle")}
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form
                      className="terminal-code-editor__form"
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      {form.title && (
                        <h3 className="elm-h4 terminal-code-editor__form-title">
                          <span className="terminal-code-editor__prompt">
                            #
                          </span>{" "}
                          {form.title}
                        </h3>
                      )}

                      {fields.map((field) => {
                        const id = `terminal-code-editor-${field.name}`;
                        const error = errors[field.name];
                        const isArea = field.type === "textarea";
                        const Control = isArea ? "textarea" : "input";
                        return (
                          <div
                            key={field.name}
                            className={
                              "terminal-code-editor__field" +
                              (error
                                ? " terminal-code-editor__field--error"
                                : "")
                            }
                          >
                            <label
                              htmlFor={id}
                              className="terminal-code-editor__label"
                            >
                              <span className="terminal-code-editor__prop">
                                {field.label}
                              </span>
                              {field.required && (
                                <span
                                  className="terminal-code-editor__required"
                                  aria-hidden="true"
                                >
                                  {" "}*
                                </span>
                              )}
                            </label>
                            <div className="terminal-code-editor__input-row">
                              <span
                                className="terminal-code-editor__prompt"
                                aria-hidden="true"
                              >
                                ❯
                              </span>
                              <Control
                                id={id}
                                name={field.name}
                                className="terminal-code-editor__control"
                                placeholder={field.placeholder}
                                required={field.required}
                                value={values[field.name] || ""}
                                onChange={handleChange}
                                aria-invalid={Boolean(error)}
                                aria-describedby={
                                  error ? `${id}-error` : undefined
                                }
                                autoComplete="off"
                                spellCheck={isArea}
                                {...(isArea
                                  ? { rows: 4 }
                                  : { type: field.type || "text" })}
                              />
                            </div>
                            {error && (
                              <span
                                id={`${id}-error`}
                                className="terminal-code-editor__error"
                              >
                                error: {error}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {status === "error" && (
                        <p className="terminal-code-editor__error" role="alert">
                          ✖ Message couldn't be sent. Check your connection and
                          run it again.
                        </p>
                      )}

                      <button
                        type="submit"
                        className="elm-btn elm-btn-primary terminal-code-editor__submit"
                        disabled={status === "sending"}
                      >
                        <span aria-hidden="true">$ </span>
                        {status === "sending"
                          ? "Sending…"
                          : form.submitText || "Send Message"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="terminal-code-editor__statusbar">
            <span className="terminal-code-editor__status-item">
              <i
                className={
                  "terminal-code-editor__status-dot terminal-code-editor__status-dot--" +
                  status
                }
                aria-hidden="true"
              />
              {STATUS_LABEL[status]}
            </span>
            <span className="terminal-code-editor__status-item">UTF-8</span>
            <span className="terminal-code-editor__status-item">JavaScript</span>
          </div>
        </div>

        {/* Map preview */}
        {show("map") && (
          <div className="terminal-code-editor__window terminal-code-editor__window--map">
            <div className="terminal-code-editor__tab">
              <span className="terminal-code-editor__tab-name">
                location.preview
              </span>
            </div>
            {map.src ? (
              <iframe
                className="terminal-code-editor__map-frame"
                src={map.src}
                title={map.alt || "Map"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="terminal-code-editor__map-empty">
                <span className="terminal-code-editor__comment">
                  {"// "}
                  {map.alt || "Map unavailable"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}