import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import webkieLogo from "../../assets/NamedLogo.png";
import "./Header.css";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="lp-header"><div className="lp-header-inner">
    <Link className="lp-brand" to="/" aria-label="Webkie home"><img src={webkieLogo} alt="Webkie" /></Link>
    <button className="lp-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <FiX /> : <FiMenu />}</button>
    <nav className={`lp-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
      <a href="#home" onClick={() => setMenuOpen(false)}>Home</a><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#templates" onClick={() => setMenuOpen(false)}>Templates</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a><a href="#resources" onClick={() => setMenuOpen(false)}>Resources</a>
      <div className="lp-mobile-actions"><Link className="lp-signin" to="/login">Sign in</Link><Link className="lp-button lp-button-primary" to="/register">Get started <FiArrowRight /></Link></div>
    </nav>
    <div className="lp-header-actions"><Link className="lp-signin" to="/login">Sign in</Link><Link className="lp-button lp-button-primary lp-header-cta" to="/register">Get started <FiArrowRight /></Link></div>
  </div></header>;
}

export default Header;
