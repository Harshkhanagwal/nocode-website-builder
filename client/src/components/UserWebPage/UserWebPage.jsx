import React, { useEffect, useState } from 'react'
import SplitHero from '../Elements/HeroSection/SplitHero/SplitHero'
import { getWebsiteById } from '../../api/websiteApi';


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




const UserWebPage = ({websiteId, data}) => {

const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        setLoading(true);

        const data = await getWebsiteById(websiteId);

        setWebsite(data.website);

        console.log(data.website)
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

  return (
    <div>
        <SplitHero data={heroData}/>
    </div>
  )
}

export default UserWebPage