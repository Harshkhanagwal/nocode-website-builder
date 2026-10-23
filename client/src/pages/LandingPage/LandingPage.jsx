import Header from "../../components/LandingPageComponents/Header";
import Hero from "../../components/LandingPageComponents/Hero";
import Features from "../../components/LandingPageComponents/Features";
import Templates from "../../components/LandingPageComponents/Templates";
import HowItWorks from "../../components/LandingPageComponents/HowItWorks";
import Testimonials from "../../components/LandingPageComponents/Testimonials";
import CallToAction from "../../components/LandingPageComponents/CallToAction";
import Footer from "../../components/LandingPageComponents/Footer";
import "./LandingPage.css";

export default function LandingPage() {
  return <main className="landing-page"><Header /><Hero /><Features /><Templates /><HowItWorks /><Testimonials /><CallToAction /><Footer /></main>;
}
