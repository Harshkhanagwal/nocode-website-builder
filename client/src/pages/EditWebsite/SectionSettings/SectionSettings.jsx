import HeroSettings from "./HeroSettings";


import './SectionSettings.css'

const SectionSettings = ({ section, onChange }) => {
  if (!section) return <p>Select a section.</p>;

  switch (section.sectionName) {
    case "hero":
      return <HeroSettings section={section} onChange={onChange} />;
    default:
      return <p>Settings for this section are not available yet.</p>;
  }
};

export default SectionSettings;