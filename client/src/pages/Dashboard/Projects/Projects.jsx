import React, { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

import "./Projects.css";
import CreateWebsitePopup from "../../../components/Dashboard/CreateWebsitePopup/CreateWebsitePopup";
import { fetchUserWebsites } from "../../../redux/slices/projectSlice";

const Projects = () => {
  const [createModal, setCreateModal] = useState(false);

  const dispatch = useDispatch();

  const { projects, loading, error } = useSelector(
    (state) => state.project
  );

  useEffect(() => {
    dispatch(fetchUserWebsites());
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Your Projects</h1>

          <p className="dashboard-subtitle">
            Manage and build your websites.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(!createModal)}
          className="dashboard-create-btn"
        >
          <FiPlus />
          <span>Create New Website</span>
        </button>
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
              <article className="project-card">

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
    </div>
  );
};

export default Projects;