import React, { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiSettings, FiZap} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

import "./Projects.css";
import CreateWebsitePopup from "../../../components/Dashboard/CreateWebsitePopup/CreateWebsitePopup";
import CreateWithAIPopup from "../../../components/Dashboard/CreateWebsitePopup/CreateWithAIPopup";
import ThemeSettingsPopup from "../../../components/Dashboard/ThemeSettingsPopup/ThemeSettingsPopup";
import { fetchUserWebsites, removeWebsite } from "../../../redux/slices/projectSlice";

const Projects = () => {
  const [createModal, setCreateModal] = useState(false);
  const [aiModal, setAiModal] = useState(false);
  const [settingsWebsite, setSettingsWebsite] = useState(null);
  const [deleteWebsite, setDeleteWebsite] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const dispatch = useDispatch();

  const { projects, loading, error } = useSelector(
    (state) => state.project
  );

  useEffect(() => {
    dispatch(fetchUserWebsites());
  }, [dispatch]);

  const confirmDelete = async () => {
    if (!deleteWebsite || deleteConfirmation.trim() !== deleteWebsite.name) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await dispatch(removeWebsite(deleteWebsite._id)).unwrap();
      setDeleteWebsite(null);
      setDeleteConfirmation("");
    } catch (error) {
      setDeleteError(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Your Projects</h1>

          <p className="dashboard-subtitle">
            Manage and build your websites.
          </p>
        </div>

        {/* <button
          onClick={() => setCreateModal(!createModal)}
          className="dashboard-create-btn"
        >
          <FiPlus />
          <span>Create New Website</span>
        </button> */}
        <div className="dashboard-header-actions">
    <button
      type="button"
      onClick={() => setAiModal(true)}
      className="dashboard-create-btn dashboard-ai-btn"
    >
      <FiZap />
      <span>Create Website with AI</span>
    </button>

    <button
      onClick={() => setCreateModal(!createModal)}
      className="dashboard-create-btn"
    >
      <FiPlus />
      <span>Create New Website</span>
    </button>
</div>
      </div>

      <section className="dashboard-projects">
        <h2 className="dashboard-section-title">
          Recent Projects
        </h2>

        {loading && (
          <p>Loading projects...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && (
          <div className="dashboard-project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project._id}>

                <div className="project-card-top">

                  <div className="project-card-info">

                    <h3 className="project-card-title">
                      {project.name}
                    </h3>

                    <p className="project-card-slug">
                      <Link to={`/${project.slug}`}>
                        {project.slug}
                      </Link>
                    </p>

                  </div>


                  <div className="project-card-actions">

                    <button type="button" className="project-action-btn" title="Theme settings" aria-label={`Theme settings for ${project.name}`} onClick={() => setSettingsWebsite(project)}>
                      <FiSettings />
                    </button>

                    <Link
                      to={`/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-btn"
                      title="View website"
                    >
                      <FiEye />
                    </Link>

                    <Link
                      to={`/${project.slug}/edit`}
                      className="project-action-btn"
                      title="Edit website"
                    >
                      <FiEdit2 />
                    </Link>

                    <button
                      type="button"
                      className="project-action-btn delete"
                      title="Delete website"
                      aria-label={`Delete ${project.name}`}
                      onClick={() => { setDeleteWebsite(project); setDeleteConfirmation(""); setDeleteError(""); }}
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </div>


                <div className="project-card-content">

                  <div className="project-card-meta">

                    <span>
                      {project.theme?.name || "Theme"}
                    </span>

                    <span className="project-meta-dot">
                      •
                    </span>

                    <span>
                      {project.typography?.name || "Typography"}
                    </span>

                  </div>


                  <div className="project-card-footer">

                    <span className="project-card-status">

                      <span className="project-card-status-dot" />

                      Published

                    </span>

                  </div>

                </div>

              </article>
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p>No websites created yet.</p>
        )}
      </section>

      {createModal && (
        <CreateWebsitePopup
          modal={createModal}
          setModal={setCreateModal}
        />
      )}
      {settingsWebsite && <ThemeSettingsPopup website={settingsWebsite} onClose={() => setSettingsWebsite(null)} />}
      {aiModal && <CreateWithAIPopup setAiModal={setAiModal} onClose={() => setAiModal(false)} />}
      {deleteWebsite && (
        <div className="delete-confirm-overlay" onClick={() => !deleting && setDeleteWebsite(null)}>
          <section className="delete-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="delete-dialog-title">Delete website?</h2>
            <p>This will permanently delete <strong>{deleteWebsite.name}</strong> and its website data. Type the website name to confirm.</p>
            <label htmlFor="delete-website-confirmation">Website name</label>
            <input id="delete-website-confirmation" autoFocus value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} placeholder={deleteWebsite.name} onKeyDown={(event) => { if (event.key === "Enter") confirmDelete(); }} />
            {deleteError && <p className="delete-confirm-error" role="alert">{deleteError}</p>}
            <div className="delete-confirm-actions">
              <button type="button" className="button secondary" disabled={deleting} onClick={() => setDeleteWebsite(null)}>Cancel</button>
              <button type="button" className="button danger" disabled={deleting || deleteConfirmation.trim() !== deleteWebsite.name} onClick={confirmDelete}>{deleting ? "Deleting…" : "Delete website"}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Projects;
