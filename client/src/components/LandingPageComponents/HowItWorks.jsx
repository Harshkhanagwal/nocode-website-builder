import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./HowItWorks.css";

export function HowItWorks() { const steps = [{ title: "Describe your website", text: "Tell us what you’re making, who it’s for, and the feeling you want it to have." }, { title: "Generate and customize", text: "Get a complete first draft, then shape the colors, copy, and details until it feels right." }, { title: "Publish and grow", text: "Share your site with the world. You can keep refining it whenever inspiration strikes." }]; return <section className="lp-section lp-how" id="how-it-works"><div className="lp-container"><div className="lp-how-intro"><span className="lp-eyebrow"><i /> YOUR IDEA, IN THREE STEPS</span><h2>Simple as<br /><span>having an idea.</span></h2><p>No tutorials to binge. No blank canvas panic. Just a good idea and a place to start.</p><Link to="/register" className="lp-text-link">Give it a try <FiArrowRight /></Link></div><div className="lp-steps">{steps.map((step, index) => <article className="lp-step" key={step.title}><div className="lp-step-marker"><span>0{index + 1}</span>{index < 2 && <span className="lp-step-line" />}</div><div><h3>{step.title}</h3><p>{step.text}</p></div>{index < 2 && <FiArrowRight className="lp-step-arrow" />}</article>)}</div></div></section>; }

export default HowItWorks;
