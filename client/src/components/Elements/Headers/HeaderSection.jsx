import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./HeaderSection.css";

const HeaderSection = ({ data = {} }) => {
  const {
    variant = "minimal-centered",
    content = {},
    sectionId,
  } = data;
  const logo = content.logo || {};
  const navigation = Array.isArray(content.navigation) ? content.navigation : [];
  const actions = Array.isArray(content.actions) ? content.actions : [];
  const settings = content.settings || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = `elm-header-navigation-${sectionId || "default"}`;
  const showNavigation = settings.showNavigation !== false && navigation.length > 0;
  const showActions = settings.showActions !== false && actions.length > 0;

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const headerClass = [
    "elm-header",
    `elm-header--${variant}`,
    !showActions ? "elm-header--no-actions" : "",
    settings.sticky ? "elm-header--sticky" : "",
    menuOpen ? "elm-header--menu-open" : "",
  ].filter(Boolean).join(" ");

  return (
    <header className={headerClass}>
      <div className="elm-header__inner">
        {logo.visibility !== false && (
          <a className="elm-header__logo" href={logo.href || "/"} aria-label={logo.text || "Home"}>
            {logo.type === "image" && logo.image ? (
              <img className="elm-header__logo-image" src={logo.image} alt={logo.text || "Website logo"} />
            ) : (
              <span>{logo.text || "Website"}</span>
            )}
          </a>
        )}

        {settings.mobileMenu !== false && showNavigation && (
          <button
            type="button"
            className="elm-header__menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        )}

        {showNavigation && (
          <nav
            id={menuId}
            className="elm-header__navigation"
            aria-label="Primary navigation"
            data-open={settings.mobileMenu === false || menuOpen}
          >
            {navigation.map((item, index) => (
              <a
                className="elm-header__link"
                href={item.href || "#"}
                key={`${item.href}-${index}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {showActions && (
          <div className="elm-header__actions">
            {actions.map((action, index) => (
              <a
                className={`elm-header__action elm-header__action--${action.type === "secondary" ? "secondary" : "primary"}`}
                href={action.href || "#"}
                key={`${action.href}-${index}`}
                onClick={() => setMenuOpen(false)}
              >
                {action.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderSection;
