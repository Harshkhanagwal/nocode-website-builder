import { FiArrowRight } from "react-icons/fi";
import "./Testimonials.css";

const quotes = [
  { quote: "I went from a rough idea to a site I’m proud to share in a single afternoon. It felt like having a designer beside me.", initials: "JM", name: "Jordan Miles", role: "Independent Consultant", color: "sage" },
  { quote: "The editor is refreshingly simple. I can make updates myself and spend more time doing the work I actually love.", initials: "AK", name: "Amara Khan", role: "Founder, Common Ground", color: "peach" },
  { quote: "Our launch page looked polished from day one. The AI gave us a great starting point, and customizing it was easy.", initials: "RL", name: "Riley Lee", role: "Product Lead, Northstar", color: "blue" },
];

export function Testimonials() { return <section className="lp-section lp-testimonials" id="resources"><div className="lp-container"><div className="lp-section-heading"><span className="lp-eyebrow"><i /> GOOD THINGS, FROM GOOD PEOPLE</span><h2>Made for people<br /><span>making things happen.</span></h2><p>A few notes from the folks who’ve already found their flow.</p></div><div className="lp-quote-grid">{quotes.map((item) => <article className="lp-quote-card" key={item.name}><div className="lp-quote-stars">★★★★★</div><blockquote>“{item.quote}”</blockquote><div className="lp-quote-person"><span className={`lp-quote-avatar ${item.color}`}>{item.initials}</span><span><strong>{item.name}</strong><small>{item.role}</small></span><FiArrowRight className="lp-quote-arrow" /></div></article>)}</div><p className="lp-placeholder-note">Customer stories shown for illustration and ready to be replaced with verified testimonials.</p></div></section>; }

export default Testimonials;
