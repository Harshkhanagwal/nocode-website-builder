import { Link } from "react-router-dom";
import { FiArrowDownRight, FiArrowRight, FiCheck, FiCode, FiGlobe, FiLayers, FiLayout, FiPlay, FiPlus, FiSettings, FiShield, FiZap } from "react-icons/fi";
import "./Hero.css";

export function Hero() {
  return <section className="lp-hero" id="home"><div className="lp-hero-glow" /><div className="lp-hero-inner lp-container">
    <div className="lp-hero-copy"><div className="lp-pill"><span className="lp-pill-dot" /><FiZap /> Your ideas, meet AI</div>
      <h1>From idea to<br /><span>website in minutes.</span></h1>
      <p className="lp-hero-description">Meet Webkie, your AI-powered website builder. Describe what you imagine, then shape a polished, responsive website that feels unmistakably yours.</p>
      <div className="lp-hero-actions"><Link className="lp-button lp-button-primary lp-button-large" to="/register">Start building free <FiArrowRight /></Link><a className="lp-button lp-button-ghost lp-button-large" href="#how-it-works"><span className="lp-play"><FiPlay /></span> See how it works</a></div>
      <div className="lp-hero-trust"><div className="lp-avatar-stack"><span>J</span><span>A</span><span>M</span><span>+</span></div><div><div className="lp-stars">★★★★★</div><small>Made for makers everywhere</small></div><span className="lp-trust-divider" /><div className="lp-trust-stat"><strong>10k+</strong><small>sites created</small></div></div>
      <div className="lp-hero-benefits"><span><FiCheck /> No code needed</span><span><FiCheck /> Free to get started</span><span><FiCheck /> Yours to customize</span><span><FiCheck /> Publish in a click</span></div>
    </div>
    <div className="lp-editor-wrap" aria-label="Preview of the Webkie website editor"><div className="lp-editor-window"><div className="lp-editor-topbar"><div className="lp-window-dots"><i /><i /><i /></div><div className="lp-editor-url"><FiShield /> mynewsite.webkie.site</div><div className="lp-editor-status"><span /> Saved</div></div>
      <div className="lp-editor-body"><aside className="lp-editor-sidebar"><div className="lp-mini-brand"><span className="lp-brand-mark">W</span><span>Webkie</span></div><div className="lp-side-label">YOUR SITE</div><div className="lp-side-item active"><FiLayout /> Pages <FiPlus /></div><div className="lp-side-item"><FiSettings /> Design</div><div className="lp-side-item"><FiCode /> Settings</div><div className="lp-side-bottom"><span className="lp-side-avatar">W</span><span>Webkie account</span></div></aside>
        <div className="lp-editor-canvas"><div className="lp-canvas-toolbar"><span><FiGlobe /> Home page</span><span className="lp-device-icons">▣　▯</span><button>Publish <FiArrowRight /></button></div><div className="lp-site-preview"><div className="lp-preview-nav"><span>FIELDWORK<span className="lp-preview-dot">.</span></span><div>About　 Services　 Journal</div><span className="lp-preview-contact">Let’s talk ↗</span></div><div className="lp-preview-content"><div className="lp-preview-eyebrow"><span /> INDEPENDENT CREATIVE STUDIO</div><div className="lp-preview-heading">We make space<br />for <em>better ideas.</em></div><p>Strategy, identity, and digital experiences<br />for people shaping what comes next.</p><button>Explore our work <FiArrowRight /></button><div className="lp-preview-art"><div className="lp-art-shape shape-one" /><div className="lp-art-shape shape-two" /><span>F<br />W</span></div></div><div className="lp-preview-bottom"><span>SCROLL TO EXPLORE</span><span>EST. 2024 · EVERYWHERE</span></div></div></div></div></div>
      <div className="lp-ai-toast"><span className="lp-ai-icon"><FiZap /></span><div><strong>Your site is taking shape</strong><small>Putting the finishing touches on...</small><span className="lp-progress"><i /></span></div><FiCheck className="lp-ai-check" /></div>
      <div className="lp-float-tag"><FiZap /> Generated in <strong>42 sec</strong></div>
    </div>
  </div><a className="lp-scroll-cue" href="#features"><span>SCROLL TO EXPLORE</span><FiArrowDownRight /></a></section>;
}

export default Hero;
