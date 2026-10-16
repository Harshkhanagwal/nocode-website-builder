import React from "react";
import HeroSection from "../components/Elements/HeroSection/heroSection";
import HeaderSection from "../components/Elements/Headers/HeaderSection";
import AboutEditorial from "../components/Elements/AboutSection/AboutEditorial/AboutEditorial";
import AboutMinimalTypography from "../components/Elements/AboutSection/AboutMinimalTypography/AboutMinimalTypography";
import AboutTimeline from "../components/Elements/AboutSection/AboutTimeline/AboutTimeline";
import BentoGridAbout from "../components/Elements/AboutSection/BentoGridAbout/BentoGridAbout";
import ContactDarkSplitScreen from "../components/Elements/ContactSection/ContactDarkSplitScreen/ContactDarkSplitScreen";
import ContactTerminalCodeEditor from "../components/Elements/ContactSection/ContactTerminalCodeEditor/ContactTerminalCodeEditor";
import ContactFloatingFormCard from "../components/Elements/ContactSection/Contactfloatingformcard/Contactfloatingformcard";
import ContactMinimalTypography from "../components/Elements/ContactSection/Contactminimaltypography/Contactminimaltypography";
import AccordianBorderlessminimal from "../components/Elements/AccordianSection/AccordianBorderlessminimal/AccordianBorderlessminimal";
import AccordianDarkfuturistic from "../components/Elements/AccordianSection/AccordianDarkfuturistic/AccordianDarkfuturistic";
import AccordianRoundedcards from "../components/Elements/AccordianSection/AccordianRoundedcards/AccordianRoundedcards";
import AccordianTwocolumnFAQ from "../components/Elements/AccordianSection/AccordianTwocolumnFAQ/AccordianTwocolumnFAQ";
import ColumnSectionBento from "../components/Elements/ColumnSection/ColumnSectionBento/ColumnSectionBento";
import ColumnSectionClassic from "../components/Elements/ColumnSection/ColumnSectionClassic/ColumnSectionClassic";
import ColumnSectionPeople from "../components/Elements/ColumnSection/ColumnSectionPeople/ColumnSectionPeople";
import ColumnSectionServiceCards from "../components/Elements/ColumnSection/ColumnSectionServiceCards/ColumnSectionServiceCards";

const variantRenderer = (variants, fallback) => ({ data = {} }) => {
  const Component = variants[data.variant] || fallback;
  return React.createElement(Component, { data });
};

const sectionRegistry = {
  header: HeaderSection,
  hero: HeroSection,
  about: variantRenderer({
    editorial: AboutEditorial,
    "minimal-typography": AboutMinimalTypography,
    timeline: AboutTimeline,
    "bento-grid": BentoGridAbout,
  }, AboutEditorial),
  contact: variantRenderer({
    "dark-split-screen": ContactDarkSplitScreen,
    "terminal-code-editor": ContactTerminalCodeEditor,
    "floating-form-card": ContactFloatingFormCard,
    "minimal-typography": ContactMinimalTypography,
  }, ContactDarkSplitScreen),
  accordion: variantRenderer({
    "borderless-minimal": AccordianBorderlessminimal,
    "dark-futuristic": AccordianDarkfuturistic,
    "rounded-cards": AccordianRoundedcards,
    "two-column-faq": AccordianTwocolumnFAQ,
  }, AccordianBorderlessminimal),
  columns: variantRenderer({
    bento: ColumnSectionBento,
    classic: ColumnSectionClassic,
    people: ColumnSectionPeople,
    "service-cards": ColumnSectionServiceCards,
  }, ColumnSectionClassic),
};

export default sectionRegistry;
