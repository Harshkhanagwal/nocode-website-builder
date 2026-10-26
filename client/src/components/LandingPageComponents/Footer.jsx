import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import webkieLogo from "../../assets/NamedLogo.png";
import "./Footer.css";

export function Footer() { return <footer className="lp-footer" id="about"><div className="lp-container"><div className="lp-footer-main"><div className="lp-footer-brand"><Link className="lp-brand" to="/" aria-label="Webkie home"><img src={webkieLogo} alt="Webkie" /></Link><p>Your idea, meet your website.<br />Build, customize, and publish with AI.</p><div className="lp-socials"><a href="https://instagram.com" aria-label="Instagram">ig</a><a href="https://linkedin.com" aria-label="LinkedIn">in</a><a href="https://x.com" aria-label="X">𝕏</a></div></div><div className="lp-footer-links"><div><h3>Explore</h3><a href="#about">About</a><a href="#features">Features</a><a href="#templates">Templates</a><a href="#pricing">Pricing</a></div><div><h3>Good to know</h3><a href="#resources">Journal</a><a href="#resources">Stories</a><a href="mailto:hello@webkie.com">Contact</a><a href="#resources">Help center</a></div><div className="lp-footer-note"><span className="lp-eyebrow"><i /> MAKE IT YOURS</span><p>Your next great website<br />starts with an idea.</p><a href="#home">Find your flow <FiArrowRight /></a></div></div></div><div className="lp-footer-bottom"><span>© 2026 Webkie. Made for the makers.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a><span>Made with <b>♥</b> and a little AI</span></div></div></div></footer>; }

export default Footer;
