import './Splitherosection.css'

function SplitHero() {
  return (
    <section className="split-hero">
      <div className="split-hero-container">
        <div className="split-hero-content">
          <span className="split-hero-eyebrow">
            ✦ Design your future
          </span>

          <h1 className="split-hero-title">
            Build something
            <span> extraordinary.</span>
          </h1>

          <p className="split-hero-description">
            Create beautiful digital experiences with
            modern tools designed to bring your ideas
            to life.
          </p>

          <div className="split-hero-actions">
            <button className="btn btn-primary">
              Get Started
            </button>

            <button className="btn btn-secondary">
              Explore More
            </button>
          </div>

          <div className="split-hero-note">
            <span className="split-hero-note-dot"></span>
            No credit card required
          </div>
        </div>

        <div className="split-hero-visual">
          <div className="split-hero-image-wrapper">
            <img
              className="split-hero-image"
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000"
              alt="Modern minimal workspace"
            />
          </div>

          <div className="split-hero-floating-card">
            <span className="split-hero-card-label">
              Your next idea
            </span>
            <strong className="split-hero-card-title">
              Starts here.
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SplitHero;
