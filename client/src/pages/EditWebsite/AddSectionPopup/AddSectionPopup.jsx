import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiSearch,
  FiX,
  FiLayout,
  FiUser,
  FiBriefcase,
  FiZap,
  FiMessageSquare,
  FiMail,
  FiLayers,
} from "react-icons/fi";

import "./AddSectionPopup.css";

const sectionCatalog = [
  {
    id: "hero",
    name: "Hero",
    description: "Introduce your website with a strong first impression.",
    icon: FiLayout,
    category: "Essentials",
    variants: [
      {
        id: "split",
        name: "Split Hero",
        description: "Text on one side, image on the other.",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "centered",
        name: "Centered Hero",
        description: "Centered content with a clean layout.",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "fullscreen-image",
        name: "Full Screen Hero",
        description: "A large, immersive background image.",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "cinematic-corner",
        name: "Cinematic Hero",
        description: "An image-led layout with an editorial feel.",
        image:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "about",
    name: "About",
    description: "Tell visitors about you, your brand, or your team.",
    icon: FiUser,
    category: "Essentials",
    variants: [
      {
        id: "split",
        name: "Split About",
        description: "Image alongside your story.",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "centered",
        name: "Centered Bio",
        description: "A focused introduction with centered content.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    description: "Showcase your work and featured projects.",
    icon: FiBriefcase,
    category: "Content",
    variants: [
      {
        id: "grid",
        name: "Project Grid",
        description: "Display projects in a structured grid.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "featured",
        name: "Featured Project",
        description: "Give one project more visual emphasis.",
        image:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "features",
    name: "Features",
    description: "Highlight your services, skills, or key benefits.",
    icon: FiZap,
    category: "Content",
    variants: [
      {
        id: "icon-grid",
        name: "Icon Grid",
        description: "Highlight features in a compact grid.",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "feature-rows",
        name: "Feature Rows",
        description: "Present features in stacked rows.",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Display feedback and client reviews.",
    icon: FiMessageSquare,
    category: "Content",
    variants: [
      {
        id: "cards",
        name: "Testimonial Cards",
        description: "Show reviews in separate cards.",
        image:
          "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "centered",
        name: "Featured Quote",
        description: "Emphasize one testimonial.",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    description: "Give visitors a way to reach you.",
    icon: FiMail,
    category: "Essentials",
    variants: [
      {
        id: "contact-form",
        name: "Contact Form",
        description: "A form for visitor enquiries.",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "contact-details",
        name: "Contact Details",
        description: "Display contact information clearly.",
        image:
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "footer",
    name: "Footer",
    description: "Finish your website with navigation and links.",
    icon: FiLayers,
    category: "Essentials",
    variants: [
      {
        id: "simple",
        name: "Simple Footer",
        description: "A minimal footer with essential links.",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "multi-column",
        name: "Multi-column Footer",
        description: "Organize links into multiple columns.",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

const categories = ["All sections", "Essentials", "Content"];

function AddSectionPopup({ onClose, onAddSection }) {
  const [selectedSection, setSelectedSection] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All sections");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const filteredSections = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sectionCatalog.filter((section) => {
      const matchesCategory =
        activeCategory === "All sections" ||
        section.category === activeCategory;

      const matchesSearch =
        !term ||
        section.name.toLowerCase().includes(term) ||
        section.description.toLowerCase().includes(term) ||
        section.variants.some((variant) =>
          variant.name.toLowerCase().includes(term)
        );

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleAdd = async (variant) => {
    if (!selectedSection || adding) return;

    setAdding(true);
    setError("");

    try {
      await onAddSection({
        sectionName: selectedSection.id,
        sectionLabel: selectedSection.name,
        variant: variant.id,
        variantLabel: variant.name,
        enabled: true,
        content: {},
        visibility: {},
      });

      onClose();
    } catch (err) {
      console.error("Failed to add section:", err);
      setError("Unable to add this section. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="add-section-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !adding) {
          onClose();
        }
      }}
    >
      <div
        className="add-section-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-section-title"
      >
        <header className="add-section-header">
          <div className="add-section-heading">
            {selectedSection && (
              <button
                type="button"
                className="add-section-icon-button"
                onClick={() => {
                  setSelectedSection(null);
                  setError("");
                }}
                disabled={adding}
                aria-label="Back to sections"
              >
                <FiArrowLeft size={19} />
              </button>
            )}

            <div>
              <h2 id="add-section-title">
                {selectedSection
                  ? `Choose a ${selectedSection.name} layout`
                  : "Add a section"}
              </h2>

              <p>
                {selectedSection
                  ? "Choose a layout to add to your website."
                  : "Choose a section to add to your website."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="add-section-icon-button"
            onClick={onClose}
            disabled={adding}
            aria-label="Close popup"
          >
            <FiX size={20} />
          </button>
        </header>

        {!selectedSection ? (
          <>
            <div className="add-section-toolbar">
              <div className="add-section-search">
                <FiSearch size={18} />

                <input
                  type="search"
                  placeholder="Search sections or layouts..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  autoFocus
                />
              </div>

              <div className="add-section-categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`add-section-category ${
                      activeCategory === category ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="add-section-body">
              <div className="add-section-grid">
                {filteredSections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <button
                      type="button"
                      className="add-section-type-card"
                      key={section.id}
                      onClick={() => {
                        setSelectedSection(section);
                        setSearch("");
                        setError("");
                      }}
                    >
                      <span className="add-section-type-icon">
                        <Icon size={21} />
                      </span>

                      <span className="add-section-type-info">
                        <strong>{section.name}</strong>

                        <span>{section.description}</span>

                        <small>
                          {section.variants.length} layouts
                          <FiArrowRight size={13} />
                        </small>
                      </span>
                    </button>
                  );
                })}
              </div>

              {filteredSections.length === 0 && (
                <div className="add-section-empty">
                  <FiLayers size={28} />
                  <strong>No sections found</strong>
                  <span>
                    Try a different search term or category.
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="add-section-body add-section-variants-body">
            <div className="add-section-variant-grid">
              {selectedSection.variants.map((variant) => (
                <button
                  type="button"
                  className="add-section-variant-card"
                  key={`${selectedSection.id}-${variant.id}`}
                  onClick={() => handleAdd(variant)}
                  disabled={adding}
                >
                  <div className="add-section-variant-image-wrap">
                    <img
                      src={variant.image}
                      alt={`${variant.name} layout preview`}
                      className="add-section-variant-image"
                      loading="lazy"
                    />

                    <span className="add-section-variant-action">
                      {adding ? "Adding..." : "Use layout"}
                      <FiArrowRight size={15} />
                    </span>
                  </div>

                  <div className="add-section-variant-info">
                    <strong>{variant.name}</strong>
                    <span>{variant.description}</span>
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <p className="add-section-error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        <footer className="add-section-footer">
          <span>
            {selectedSection
              ? `${selectedSection.variants.length} layouts available`
              : `${filteredSections.length} section types`}
          </span>

          <button
            type="button"
            className="add-section-cancel"
            onClick={onClose}
            disabled={adding}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}

export default AddSectionPopup;
