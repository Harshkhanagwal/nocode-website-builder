import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCheck, FiInbox, FiRefreshCw, FiRotateCcw, FiTrash2 } from "react-icons/fi";
import {
  getContactSubmissions,
  deleteContactSubmission,
  updateContactSubmissionReadStatus,
} from "../../../api/contactSubmissionApi";
import "./Queries.css";

const formatDate = (date) => new Date(date).toLocaleString();

const getTitle = (submission) =>
  submission.fields?.subject || submission.fields?.name || "Contact form message";

const getPreview = (submission) =>
  submission.fields?.message || submission.fields?.email || "Open to view this message.";

const Queries = () => {
  const [submissions, setSubmissions] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unreadCount = useMemo(
    () => submissions.filter((submission) => submission.isRead !== true).length,
    [submissions]
  );

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getContactSubmissions();
      setSubmissions(result.submissions || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load contact messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const changeReadStatus = async (submission, isRead) => {
    const previousStatus = submission.isRead === true;
    if (previousStatus === isRead) return;

    setError("");
    setSubmissions((current) => current.map((item) =>
      item._id === submission._id ? { ...item, isRead } : item
    ));

    try {
      await updateContactSubmissionReadStatus(submission._id, isRead);
    } catch (requestError) {
      setSubmissions((current) => current.map((item) =>
        item._id === submission._id ? { ...item, isRead: previousStatus } : item
      ));
      setError(requestError.response?.data?.message || "Could not update message status.");
    }
  };

  const openMessage = (submission) => {
    const willOpen = openId !== submission._id;
    setOpenId(willOpen ? submission._id : null);
    if (willOpen && submission.isRead !== true) {
      changeReadStatus(submission, true);
    }
  };

  const removeMessage = async (submission) => {
    setError("");
    try {
      await deleteContactSubmission(submission._id);
      setSubmissions((current) => current.filter((item) => item._id !== submission._id));
      if (openId === submission._id) setOpenId(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this notification.");
    }
  };

  return (
    <div className="dashboard-page queries-page">
      <div className="dashboard-header queries-header">
        <div>
          <div className="queries-title-row">
            <h1 className="dashboard-title">Notifications</h1>
            {unreadCount > 0 && <span className="queries-count">{unreadCount} unread</span>}
          </div>
          <p className="dashboard-subtitle">Contact form messages from your websites.</p>
        </div>
        <button className="queries-refresh" type="button" onClick={loadSubmissions} disabled={loading}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {error && <p className="queries-banner" role="alert">{error}</p>}
      {loading && <p className="queries-state">Loading notifications…</p>}
      {!loading && !error && submissions.length === 0 && (
        <div className="queries-empty">
          <span className="queries-empty-icon"><FiInbox aria-hidden="true" /></span>
          <h2>You’re all caught up</h2>
          <p>New contact messages will appear here.</p>
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <section className="queries-list" aria-label="Contact form notifications">
          {submissions.map((submission) => {
            const isUnread = submission.isRead !== true;
            const isOpen = openId === submission._id;

            return (
              <article className={`query-card ${isUnread ? "is-unread" : ""} ${isOpen ? "is-open" : ""}`} key={submission._id}>
                <div className="query-card-topline">
                  <span className={`query-status ${isUnread ? "is-unread" : ""}`}>
                    <span className="query-status-dot" aria-hidden="true" />
                    {isUnread ? "Unread" : "Read"}
                  </span>
                  <div className="query-card-actions">
                    <time dateTime={submission.createdAt}>{formatDate(submission.createdAt)}</time>
                    <button
                      className="query-delete-button"
                      type="button"
                      aria-label={`Delete notification from ${submission.fields?.name || "sender"}`}
                      title="Delete notification"
                      onClick={() => removeMessage(submission)}
                    >
                      <FiTrash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <button
                  className="query-card-trigger"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => openMessage(submission)}
                >
                  <span className="query-card-copy">
                    <span className="query-card-heading">
                      {isUnread && <span className="query-active-dot" aria-label="Unread" />}
                      <span className="query-card-title">{getTitle(submission)}</span>
                    </span>
                    <span className="query-card-site">{submission.website?.name || "Website"}</span>
                    <span className="query-card-preview">{getPreview(submission)}</span>
                  </span>
                  <span className="query-card-chevron" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="query-details">
                    <dl className="query-fields">
                      {Object.entries(submission.fields || {}).map(([name, value]) => (
                        <div className="query-field" key={name}>
                          <dt>{name.replace(/[_-]/g, " ")}</dt>
                          <dd>{value || "—"}</dd>
                        </div>
                      ))}
                    </dl>
                    <button
                      className={`query-read-toggle ${isUnread ? "is-mark-read" : "is-mark-unread"}`}
                      type="button"
                      onClick={() => changeReadStatus(submission, isUnread)}
                    >
                      {isUnread ? <FiCheck /> : <FiRotateCcw />}
                      {isUnread ? "Mark as read" : "Mark as unread"}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Queries;
