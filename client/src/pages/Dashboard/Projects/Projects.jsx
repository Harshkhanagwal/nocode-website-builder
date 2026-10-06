import React from "react";
import { FiEye, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import "./Projects.css";
import CreateWebsitePopup from "../../../components/Dashboard/CreateWebsitePopup/CreateWebsitePopup";
import { useState } from "react";

const Projects = () => {
  const [createModal, setCreateModal] = useState(false)
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Your Projects</h1>
          <p className="dashboard-subtitle">
            Manage and build your websites.
          </p>
        </div>

        <button onClick={() => setCreateModal(!createModal)} className="dashboard-create-btn">
          <FiPlus />
          <span>Create New Website</span>
        </button>
      </div>

      <section className="dashboard-projects">
        <h2 className="dashboard-section-title">Recent Projects</h2>

        <div className="dashboard-project-grid">
          <article className="project-card">
            <div className="project-card-header">
              <div className="project-card-info">
                <h3 className="project-card-name">Harsh Portfolio</h3>
                <p className="project-card-slug">harsh-portfolio</p>
              </div>

              <div className="project-card-actions">
                <button
                  type="button"
                  className="project-action-btn"
                  aria-label="View website"
                  title="View website"
                >
                  <FiEye />
                </button>

                <button
                  type="button"
                  className="project-action-btn"
                  aria-label="Edit website"
                  title="Edit website"
                >
                  <FiEdit2 />
                </button>

                <button
                  type="button"
                  className="project-action-btn project-delete-btn"
                  aria-label="Delete website"
                  title="Delete website"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="project-card-meta">
              <span>Minimal Black</span>
              <span className="project-meta-dot">·</span>
              <span>Modern Clean</span>
            </div>
          </article>
      

        </div>

      </section>
      {
        createModal && <CreateWebsitePopup modal={createModal} setModal={setCreateModal}/>

      }
    </div>
  );
};

export default Projects