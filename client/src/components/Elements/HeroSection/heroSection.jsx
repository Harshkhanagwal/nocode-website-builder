import SplitHero from "./SplitHero/SplitHero";
import CenteredHero from "./CenteredHero/CenteredHero";
import CinematicCornerHero from "./CinematicCornerHero/CinematicCornerHero";
import FullScreenImageHero from "./FullScreenImageHero/FullScreenImageHero";

const heroVariants = {
  split: SplitHero,
  centered: CenteredHero,
  "cinematic-corner": CinematicCornerHero,
  "fullscreen-image": FullScreenImageHero,
};

const HeroSection = ({ data = {} }) => {
  const {
    variant = "split",
    content = {},
    visibility = {},
  } = data;

  const HeroComponent = heroVariants[variant] || SplitHero;

  return (
    <HeroComponent
      data={{
        ...data,
        variant,
        content,
        visibility,
      }}
    />
  );
};

export default HeroSection;
