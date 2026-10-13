import HeroSettings from "./HeroSettings";

import "./SectionSettings.css";

const SectionSettings = ({ websiteId, section, onChange, onSave, saving }) => {
  if (!section) return <p>Select a section.</p>;

  console.log(websiteId)
  switch (section.sectionName) {
    case "hero":
      return (
        <HeroSettings
          section={section}
          onChange={onChange}
          onSave={onSave}
          saving={saving}
          websiteId={websiteId}
        />
      );
    default:
      return <p>Settings for this section are not available yet.</p>;
  }
};

export default SectionSettings;