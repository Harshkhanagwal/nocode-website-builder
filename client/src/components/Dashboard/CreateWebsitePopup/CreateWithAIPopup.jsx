import React, { useEffect, useState } from "react";
import { createWebsiteWithAI } from "../../../api/websiteApi";
import "../CreateWebsitePopup/CreateWebsitePopup.css";
import "./CreateWithAIPopup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserWebsites } from "../../../redux/slices/projectSlice";

const NAME_MIN = 3;
const NAME_MAX = 35;
const PROMPT_MIN = 10;
const PROMPT_MAX = 500;

const CreateWithAIPopup = ({ onClose, setAiModal }) => {
  const [websiteName, setWebsiteName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate()

  const isValid =
    websiteName.trim().length >= NAME_MIN &&
    websiteName.trim().length <= NAME_MAX &&
    prompt.trim().length >= PROMPT_MIN &&
    prompt.trim().length <= PROMPT_MAX;

  // Block closing while the website is being generated
  const handleClose = () => {
    if (!loading) onClose();
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, onClose]);

  const dispatch = useDispatch();

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!isValid || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await createWebsiteWithAI({
        websiteName: websiteName.trim(),
        prompt: prompt.trim(),
      });

      // UI only for now: the generated JSON is not saved anywhere yet
      console.log("AI WEBSITE RESPONSE:", response);

      setSuccess(true);
      
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate website"
      );
    } finally {
      setLoading(false);
      setAiModal(false);
      dispatch(fetchUserWebsites());
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <section
        className="create-website-modal ai-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <header className="create-modal-header">
          <div className="create-modal-heading">
            <span className="create-modal-eyebrow">Create with AI</span>

            <h2 className="create-modal-title" id="ai-modal-title">
              Describe your website
            </h2>

            <p className="create-modal-description">
              Tell us about your website and AI will build the sections for
              you.
            </p>
          </div>
        </header>

        {/* CONTENT */}

        <div className="create-modal-content">
          <form className="ai-form" onSubmit={handleGenerate}>
            {/* WEBSITE NAME */}

            <div className="create-field">
              <label className="create-field-label" htmlFor="ai-website-name">
                Website name
              </label>

              <div className="create-input-wrapper">
                <input
                  id="ai-website-name"
                  type="text"
                  className="create-website-input"
                  value={websiteName}
                  maxLength={NAME_MAX}
                  onChange={(event) => setWebsiteName(event.target.value)}
                  placeholder="e.g. Harsh Portfolio"
                  disabled={loading || success}
                  autoFocus
                />

                <span
                  className={`create-input-counter ${
                    websiteName.length === NAME_MAX ? "error" : ""
                  }`}
                >
                  {websiteName.length}/{NAME_MAX}
                </span>
              </div>

              <p className="create-field-hint">
                Choose a short and recognizable name for your website.
              </p>
            </div>

            {/* PROMPT */}

            <div className="create-field">
              <label className="create-field-label" htmlFor="ai-prompt">
                Prompt
              </label>

              <div className="create-input-wrapper">
                <textarea
                  id="ai-prompt"
                  className="create-website-textarea"
                  value={prompt}
                  maxLength={PROMPT_MAX}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="e.g. A portfolio for a full stack developer who builds AI products. Modern and minimal tone."
                  disabled={loading || success}
                />

                <span
                  className={`create-textarea-counter ${
                    prompt.length === PROMPT_MAX ? "error" : ""
                  }`}
                >
                  {prompt.length}/{PROMPT_MAX}
                </span>
              </div>

              <p className="create-field-hint">
                Describe the purpose, audience and style of your website (at
                least {PROMPT_MIN} characters).
              </p>
            </div>

            {error && (
              <p className="ai-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="ai-success" role="status">
                Website generated successfully. The generated JSON is in the
                browser console for now.
              </p>
            )}

            {loading && (
              <div className="ai-loading">
                <div className="theme-loader" />
                <span>Generating your website. This can take up to a minute.</span>
              </div>
            )}

            {/* ACTIONS */}

            <div className="create-modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={handleClose}
                disabled={loading}
              >
                {success ? "Close" : "Cancel"}
              </button>

              {!success && (
                <button
                  type="submit"
                  className="button primary"
                  disabled={!isValid || loading}
                >
                  <span>{loading ? "Generating…" : "Generate Website"}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateWithAIPopup;
