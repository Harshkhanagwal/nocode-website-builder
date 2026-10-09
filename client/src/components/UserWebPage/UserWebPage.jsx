import React, { useEffect, useState } from "react";
import SplitHero from "../Elements/HeroSection/SplitHero/SplitHero";
import { getWebsiteById } from "../../api/websiteApi";

const heroData = {
  type: "hero",

  content: {
    eyebrow: "Introducing Our Platform",

    headline: "Build Your Next Big Idea",

    subheadline: "Create stunning websites with the power of AI.",

    description: "No coding required. Just bring your ideas.",

    actions: [
      {
        text: "Get Started",
        href: "#",
        type: "primary",
      },
      {
        text: "Explore Features",
        href: "#features",
        type: "secondary",
      },
    ],

    media: {
      type: "image",
      src: "/images/bgimg2.jpg",
      alt: "Website builder dashboard",
    },

    trustIndicators: [
      {
        type: "text",
        content: "Trusted by 10,000+ users",
      },
    ],

    features: [
      {
        title: "Easy to Use",
        description: "Build websites without writing code.",
      },
    ],

    additionalContent: "Start building your website today.",
  },

  visibility: {
    eyebrow: true,
    headline: true,
    subheadline: true,
    description: true,
    actions: true,
    media: true,
    trustIndicators: false,
    features: false,
    additionalContent: false,
  },
};

const UserWebPage = ({ websiteId }) => {
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        setLoading(true);

        const data = await getWebsiteById(websiteId);

        setWebsite(data.website);

        console.log("WEBSITE:", data.website);
      } catch (error) {
        console.error("Failed to fetch website:", error);
        setError("Failed to load website");
      } finally {
        setLoading(false);
      }
    };

    if (websiteId) {
      fetchWebsite();
    }
  }, [websiteId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!website) {
    return <p>Website not found.</p>;
  }


  const colors = website?.theme?.colorPalette;
  const typography = website?.typography;

  const themeStyles = {
    // Colors
    "--elm-color-primary": colors?.primary,
    "--elm-color-primary-hover": colors?.primaryHover,
    "--elm-color-secondary": colors?.secondary,

    "--elm-color-text": colors?.text,
    "--elm-color-text-muted": colors?.textMuted,
    "--elm-color-text-light": colors?.textLight,

    "--elm-color-background": colors?.background,
    "--elm-color-surface": colors?.surface,

    "--elm-color-border": colors?.border,
    "--elm-color-border-dark": colors?.borderDark,

    "--elm-color-success": colors?.success,
    "--elm-color-warning": colors?.warning,
    "--elm-color-danger": colors?.danger,
    "--elm-color-info": colors?.info,

    // Fonts
    "--elm-font-heading": `"${typography?.headingFont?.family}", ${typography?.headingFont?.category}`,
    "--elm-font-body": `"${typography?.bodyFont?.family}", ${typography?.bodyFont?.category}`,

    // Base
    "--elm-font-size-base": `${typography?.typography?.baseSize}px`,

    // Font sizes
    "--elm-font-size-h1": `${typography?.typography?.h1?.size}px`,
    "--elm-font-size-h2": `${typography?.typography?.h2?.size}px`,
    "--elm-font-size-h3": `${typography?.typography?.h3?.size}px`,
    "--elm-font-size-h4": `${typography?.typography?.h4?.size}px`,
    "--elm-font-size-h5": `${typography?.typography?.h5?.size}px`,
    "--elm-font-size-h6": `${typography?.typography?.h6?.size}px`,

    // Line heights
    "--elm-line-height": typography?.typography?.body?.lineHeight,

    "--elm-line-height-h1": typography?.typography?.h1?.lineHeight,
    "--elm-line-height-h2": typography?.typography?.h2?.lineHeight,
    "--elm-line-height-h3": typography?.typography?.h3?.lineHeight,
    "--elm-line-height-h4": typography?.typography?.h4?.lineHeight,
    "--elm-line-height-h5": typography?.typography?.h5?.lineHeight,
    "--elm-line-height-h6": typography?.typography?.h6?.lineHeight,

    // Font weights
    "--elm-font-weight-normal": typography?.typography?.body?.weight,
    "--elm-font-weight-medium": 500,
    "--elm-font-weight-semibold": 600,
    "--elm-font-weight-bold": 700,

    "--elm-font-weight-h1": typography?.typography?.h1?.weight,
    "--elm-font-weight-h2": typography?.typography?.h2?.weight,
    "--elm-font-weight-h3": typography?.typography?.h3?.weight,
    "--elm-font-weight-h4": typography?.typography?.h4?.weight,
    "--elm-font-weight-h5": typography?.typography?.h5?.weight,
    "--elm-font-weight-h6": typography?.typography?.h6?.weight,
  };

  return (
    <div
      className="elm-website"
      style={themeStyles}
    >
      <SplitHero data={heroData} />

    </div>
  );
};

export default UserWebPage;