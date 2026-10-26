import { FiArrowRight, FiLayout, FiMousePointer, FiZap } from "react-icons/fi";
import "./Features.css";

const features = [
  { icon: FiZap, title: "AI Website Generation", text: "Describe your idea in plain language and watch a polished website take shape in seconds." },
  { icon: FiLayout, title: "Beautiful Templates", text: "Start with thoughtfully designed layouts for businesses, portfolios, and products." },
  { icon: FiMousePointer, title: "Fully Customizable", text: "Make every detail yours with an intuitive editor that stays out of your way." },
  { icon: FiZap, title: "Launch Ready", text: "Publish a responsive, fast-loading site and share it with the world in one click." },
];

export function Features() { return <section className="lp-section lp-features" id="features"><div className="lp-container"><div className="lp-section-heading"><span className="lp-eyebrow"><i /> EVERYTHING YOU NEED</span><h2>A little magic.<br /><span>A lot more making.</span></h2><p>All the tools to go from “what if?” to “it’s live”—without getting in your own way.</p></div><div className="lp-feature-grid">{features.map(({ icon: Icon, title, text }, index) => <article className="lp-feature-card" key={title}><div className="lp-feature-top"><span className="lp-feature-icon"><Icon /></span><span className="lp-card-index">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p><a href="#how-it-works" aria-label={`Learn about ${title}`}><FiArrowRight /></a></article>)}</div></div></section>; }

export default Features;
