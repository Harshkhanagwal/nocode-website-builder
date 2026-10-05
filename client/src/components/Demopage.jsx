import React from "react";

const DemoPage = () => {
  return (
    <div className="elm-body">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="elm-container">
        <div className="elm-flex elm-flex-between elm-p-md">

          <a href="#" className="elm-a">
            <strong className="elm-strong">
              BrandName
            </strong>
          </a>

          <nav className="elm-flex elm-flex-center elm-gap-lg">
            <a href="#features" className="elm-a">
              Features
            </a>

            <a href="#about" className="elm-a">
              About
            </a>

            <a href="#contact" className="elm-a">
              Contact
            </a>

            <button className="elm-btn elm-btn-primary">
              Get Started
            </button>
          </nav>

        </div>
      </header>


      {/* =========================
          HERO
      ========================= */}

      <main>

        <section className="elm-section">
          <div className="elm-container">

            <div className="elm-grid elm-grid-2 elm-gap-2xl">

              <div className="elm-flex-column elm-gap-lg">

                <p className="elm-small">
                  BUILD BETTER WEBSITES
                </p>

                <h1 className="elm-h1">
                  Create beautiful websites with AI.
                </h1>

                <p className="elm-p elm-text-muted">
                  Build, customize, and launch modern websites
                  without writing complicated code.
                </p>

                <div className="elm-flex elm-gap-md">

                  <button className="elm-btn elm-btn-primary">
                    Start Building
                  </button>

                  <button className="elm-btn elm-btn-outline">
                    Learn More
                  </button>

                </div>

              </div>


              <div className="elm-card elm-card-shadow">
                <div className="elm-flex-column elm-gap-md">

                  <p className="elm-small">
                    AI WEBSITE BUILDER
                  </p>

                  <h3 className="elm-h3">
                    Your website, generated instantly.
                  </h3>

                  <p className="elm-p elm-text-muted">
                    Describe what you want and let AI
                    create the structure, content, and design.
                  </p>

                  <div className="elm-flex elm-flex-between">
                    <span className="elm-text-muted">
                      Generation
                    </span>

                    <span className="elm-strong">
                      98%
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section
          id="features"
          className="elm-section"
        >
          <div className="elm-container">

            <div className="elm-text-center">
              <p className="elm-small">
                FEATURES
              </p>

              <h2 className="elm-h2">
                Everything you need
              </h2>

              <p className="elm-p elm-text-muted">
                Simple tools for building modern websites.
              </p>
            </div>


            <div className="elm-grid elm-grid-3 elm-gap-lg">

              <div className="elm-card">
                <h3 className="elm-h3">
                  AI Generation
                </h3>

                <p className="elm-p elm-text-muted">
                  Generate complete website sections
                  using natural language.
                </p>

                <a href="#" className="elm-a">
                  Learn more
                </a>
              </div>


              <div className="elm-card">
                <h3 className="elm-h3">
                  Visual Editing
                </h3>

                <p className="elm-p elm-text-muted">
                  Customize your website without
                  touching the underlying code.
                </p>

                <a href="#" className="elm-a">
                  Learn more
                </a>
              </div>


              <div className="elm-card">
                <h3 className="elm-h3">
                  Responsive
                </h3>

                <p className="elm-p elm-text-muted">
                  Create websites that look great
                  on every screen size.
                </p>

                <a href="#" className="elm-a">
                  Learn more
                </a>
              </div>

            </div>

          </div>
        </section>


        {/* =========================
            ABOUT
        ========================= */}

        <section
          id="about"
          className="elm-section"
        >
          <div className="elm-container">

            <div className="elm-grid elm-grid-2 elm-gap-2xl">

              <div>
                <p className="elm-small">
                  ABOUT US
                </p>

                <h2 className="elm-h2">
                  Designed for creators.
                </h2>
              </div>

              <div>
                <p className="elm-p">
                  Our platform makes it easier to turn
                  ideas into polished websites.
                </p>

                <p className="elm-p elm-text-muted">
                  Start with a simple prompt, customize
                  your sections, and publish when you're ready.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* =========================
            TESTIMONIAL
        ========================= */}

        <section className="elm-section">
          <div className="elm-container elm-container-md">

            <div className="elm-card elm-card-shadow">

              <blockquote className="elm-blockquote">
                "The fastest way I've found to go from
                an idea to a real website."
              </blockquote>

              <p className="elm-strong">
                Alex Morgan
              </p>

              <p className="elm-small">
                Product Designer
              </p>

            </div>

          </div>
        </section>


        {/* =========================
            CTA
        ========================= */}

        <section className="elm-section">
          <div className="elm-container">

            <div className="elm-card">

              <div className="elm-text-center">

                <h2 className="elm-h2">
                  Ready to build?
                </h2>

                <p className="elm-p elm-text-muted">
                  Start creating your next website today.
                </p>

                <div className="elm-flex elm-flex-center elm-gap-md">

                  <button className="elm-btn elm-btn-primary">
                    Get Started
                  </button>

                  <button className="elm-btn elm-btn-secondary">
                    View Examples
                  </button>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* =========================
            CONTACT
        ========================= */}

        <section
          id="contact"
          className="elm-section"
        >
          <div className="elm-container elm-container-md">

            <div className="elm-text-center">

              <p className="elm-small">
                CONTACT
              </p>

              <h2 className="elm-h2">
                Get in touch
              </h2>

              <p className="elm-p elm-text-muted">
                Have a question? Send us a message.
              </p>

            </div>


            <div className="elm-card">

              <div className="elm-flex-column elm-gap-lg">

                <div>
                  <label className="elm-label">
                    Name
                  </label>

                  <input
                    className="elm-input"
                    type="text"
                    placeholder="Your name"
                  />
                </div>


                <div>
                  <label className="elm-label">
                    Email
                  </label>

                  <input
                    className="elm-input"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>


                <div>
                  <label className="elm-label">
                    Message
                  </label>

                  <textarea
                    className="elm-textarea"
                    rows="5"
                    placeholder="Your message"
                  />
                </div>


                <button className="elm-btn elm-btn-primary">
                  Send Message
                </button>

              </div>

            </div>

          </div>
        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="elm-container">

        <div className="elm-hr" />

        <div className="elm-flex elm-flex-between elm-p-md">

          <p className="elm-small">
            © 2026 BrandName. All rights reserved.
          </p>

          <div className="elm-flex elm-gap-md">

            <a href="#" className="elm-a">
              Privacy
            </a>

            <a href="#" className="elm-a">
              Terms
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default DemoPage;