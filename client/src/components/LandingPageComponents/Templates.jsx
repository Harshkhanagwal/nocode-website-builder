import { Link } from "react-router-dom";
import { FiArrowRight, FiZap } from "react-icons/fi";
import "./Templates.css";

const templates = [
  { name: "Modern Business", type: "STUDIO · CONSULTING", style: "business", title: "Thoughtful work.\nMeaningful impact.", button: "Explore services" },
  { name: "Creative Portfolio", type: "DESIGN · PORTFOLIO", style: "portfolio", title: "Ideas made\nvisible.", button: "View selected work" },
  { name: "SaaS Product", type: "SOFTWARE · STARTUP", style: "saas", title: "Work flows\nbetter here.", button: "Start for free" },
];

export function Templates() { return <section className="lp-section lp-templates" id="templates"><div className="lp-container"><div className="lp-template-heading"><div><span className="lp-eyebrow"><i /> A GOOD PLACE TO START</span><h2>Made to make<br /><span>your thing.</span></h2><p>Beautiful starting points, ready for your ideas. Pick one, make it yours, and see where it takes you.</p><Link className="lp-button lp-button-outline" to="/dashboard/templates">Browse templates <FiArrowRight /></Link></div><div className="lp-template-note"><FiZap /><span>Every detail is yours<br />to make your own.</span></div></div><div className="lp-template-grid">{templates.map((template, index) => <article className={`lp-template-card ${index === 1 ? "is-featured" : ""}`} key={template.name}><div className={`lp-template-preview ${template.style}`}><div className="lp-template-browser"><i /><i /><i /><span>your-new-site.com</span></div><div className="lp-template-site"><div className="lp-template-site-nav"><b>{template.type.split(" · ")[0]}<i>.</i></b><span>About　 Work　 Contact</span></div><small>{template.type}</small><h3>{template.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h3><button>{template.button} ↗</button><div className="lp-template-art" /></div></div><div className="lp-template-caption"><div><small>0{index + 1} / TEMPLATE</small><h3>{template.name}</h3></div><a href="/dashboard/templates" aria-label={`Browse ${template.name}`}><FiArrowRight /></a></div></article>)}</div></div></section>; }

export default Templates;
