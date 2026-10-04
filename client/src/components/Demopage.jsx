
import React from "react";

const DemoPage = () => {
  return (
    <div className="elm-root">
      <header className="elm-header">
        <div className="elm-container elm-flex elm-justify-between elm-items-center">
          <h2 className="elm-h2">BrandName</h2>

          <nav className="elm-nav">
            <ul className="elm-ul elm-flex elm-gap-4">
              <li><a href="#" className="elm-a">Home</a></li>
              <li><a href="#" className="elm-a">About</a></li>
              <li><a href="#" className="elm-a">Services</a></li>
              <li><a href="#" className="elm-a">Contact</a></li>
            </ul>
          </nav>

          <button className="elm-btn elm-btn-primary">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="elm-section elm-text-center">
        <div className="elm-container">
          <span className="elm-badge">Welcome to our platform</span>
          <h1 className="elm-h1">
            Build Something Amazing
          </h1>
          <p className="elm-p">
            Create beautiful websites with reusable components
            and powerful design systems.
          </p>

          <div className="elm-flex elm-justify-center elm-gap-3">
            <button className="elm-btn elm-btn-primary">
              Explore More
            </button>
            <button className="elm-btn elm-btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="elm-section elm-bg-light">
        <div className="elm-container">
          <h2 className="elm-h2 elm-text-center">About Us</h2>
          <p className="elm-p elm-text-center">
            We help businesses build modern digital experiences.
          </p>
        </div>
      </section>

      {/* Features - 3 columns */}
      <section className="elm-section">
        <div className="elm-container">
          <h2 className="elm-h2 elm-text-center">
            Our Features
          </h2>

          <div className="elm-grid elm-grid-3">
            {[
              {
                title: "Fast Performance",
                description: "Optimized for speed and efficiency.",
              },
              {
                title: "Responsive Design",
                description: "Looks great on every device.",
              },
              {
                title: "Easy to Customize",
                description: "Flexible styles for your needs.",
              },
            ].map((feature, index) => (
              <div className="elm-card" key={index}>
                <div className="elm-card-body">
                  <h3 className="elm-h3">{feature.title}</h3>
                  <p className="elm-p">{feature.description}</p>
                  <a href="#" className="elm-a">
                    Learn more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="elm-section elm-bg-light">
        <div className="elm-container elm-max-w-md">
          <h2 className="elm-h2 elm-text-center">
            Contact Us
          </h2>

          <form className="elm-form">
            <div className="elm-form-group">
              <label className="elm-label">Full Name</label>
              <input
                type="text"
                className="elm-input"
                placeholder="Enter your name"
              />
            </div>

            <div className="elm-form-group">
              <label className="elm-label">Email Address</label>
              <input
                type="email"
                className="elm-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="elm-form-group">
              <label className="elm-label">Message</label>
              <textarea
                className="elm-textarea"
                placeholder="Write your message"
                rows="4"
              />
            </div>

            <button className="elm-btn elm-btn-primary" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="elm-footer">
        <div className="elm-container elm-text-center">
          <h3 className="elm-h3">BrandName</h3>
          <p className="elm-p">
            © 2026 BrandName. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DemoPage;
