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
import { useDispatch } from "react-redux";
import { createSection } from "../../../redux/slices/sectionSlice";

const sectionCatalog = [
  {
    id: "hero",
    name: "Hero",
    description: "Make a strong first impression.",
    icon: FiLayout,
    category: "Essentials",
    variants: [
      {
        id: "split",
        name: "Split Hero",
        description: "Text and image side by side.",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "centered",
        name: "Centered Hero",
        description: "Centered content and a clean layout.",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "fullscreen-image",
        name: "Full Screen Image",
        description: "An immersive, image-led hero.",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "cinematic-corner",
        name: "Cinematic Corner",
        description: "An editorial image-led layout.",
        image:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "about",
    name: "About",
    description: "Tell visitors about you or your team.",
    icon: FiUser,
    category: "Essentials",
    variants: [
      {
        id: "editorial",
        name: "Editorial",
        description: "An editorial-style introduction.",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "minimal-typography",
        name: "Minimal Typography",
        description: "A typography-focused introduction.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "timeline",
        name: "Timeline",
        description: "Present your story as a timeline.",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "bento-grid",
        name: "Bento Grid",
        description: "Organize your story into visual cards.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    description: "Help visitors get in touch.",
    icon: FiMail,
    category: "Essentials",
    variants: [
      {
        id: "dark-split-screen",
        name: "Dark Split Screen",
        description: "Contact details beside the enquiry form.",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "terminal-code-editor",
        name: "Terminal Code Editor",
        description: "A developer-inspired contact layout.",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "floating-form-card",
        name: "Floating Form Card",
        description: "A prominent form card layout.",
        image:
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "minimal-typography",
        name: "Minimal Typography",
        description: "A clean, typography-focused contact section.",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "accordion",
    name: "Accordion / FAQ",
    description: "Answer common visitor questions.",
    icon: FiLayers,
    category: "Content",
    variants: [
      {
        id: "borderless-minimal",
        name: "Borderless Minimal",
        description: "Simple, minimal expandable answers.",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "dark-futuristic",
        name: "Dark Futuristic",
        description: "A dark, modern FAQ layout.",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "rounded-cards",
        name: "Rounded Cards",
        description: "Questions displayed in rounded cards.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "two-column-faq",
        name: "Two-Column FAQ",
        description: "Organize questions into two columns.",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "columns",
    name: "Columns",
    description: "Arrange content into structured layouts.",
    icon: FiBriefcase,
    category: "Content",
    variants: [
      {
        id: "bento",
        name: "Bento",
        description: "A flexible grid of content cards.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "classic",
        name: "Classic",
        description: "A traditional column layout.",
        image:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "people",
        name: "People",
        description: "Showcase people and team members.",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "service-cards",
        name: "Service Cards",
        description: "Present services in individual cards.",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

const categories = ["All sections", "Essentials", "Content"];


function AddSectionPopup({
  onClose,
  onAddSection,
  websiteId,
  sectionCount = 0,

}) {
  const [selectedSection, setSelectedSection] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All sections");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

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
      const response = await dispatch(
        createSection({
          websiteId,
          sectionName: selectedSection.id,
          data: {
            variant: variant.id,
            enabled: true,
            order: sectionCount,
            content: {},
          },
        })
      ).unwrap();

      if (!response?.section?._id) {
        throw new Error("The server did not return the created section.");
      }

      await onAddSection(response.section);
      onClose();
    } catch (err) {
      console.error("Failed to add section:", err);

      setError(
        typeof err === "string"
          ? err
          : err?.message || "Unable to add this section. Please try again."
      );
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
                    className={`add-section-category ${activeCategory === category ? "active" : ""
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
