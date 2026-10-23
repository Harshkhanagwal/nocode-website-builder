import { Link } from "react-router-dom";
import { FiArrowRight, FiZap } from "react-icons/fi";
import "./CallToAction.css";

export function CallToAction() { return <section className="lp-cta-section" id="pricing"><div className="lp-container"><div className="lp-cta"><div className="lp-cta-lines"><span /><span /><span /><span /></div><div className="lp-cta-content"><span className="lp-eyebrow"><i /> YOUR NEXT CHAPTER STARTS HERE</span><h2>Bring your ideas<br />to life <em>with AI.</em></h2><p>You’ve got the idea. We’ve got the tools. Let’s make something you can’t wait to share.</p><Link to="/register" className="lp-button lp-button-primary lp-button-large">Start building free <FiArrowRight /></Link><small>No credit card required <span>·</span> Always free to start</small></div><div className="lp-cta-sparkle"><FiZap /></div></div></div></section>; }

export default CallToAction;
