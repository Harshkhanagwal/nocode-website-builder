import React from 'react'
import CenteredHero from '../../components/Elements/HeroSection/CenteredHero/CenteredHero'
import SplitHero from '../../components/Elements/HeroSection/SplitHero/SplitHero';
import FullscreenHero from '../../components/Elements/HeroSection/FullScreenImageHero/FullScreenImageHero';
import MarqueeHero from '../../components/Elements/HeroSection/CinematicCornerHero/CinematicCornerHero';

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


const Home = () => {
  return (
    <>
    {/* <CenteredHero data={heroData}></CenteredHero> */}
    {/* <SplitHero data={heroData}></SplitHero> */}
    {/* <FullscreenHero data={heroData}></FullscreenHero> */}
    <MarqueeHero data={heroData}></MarqueeHero>

      <br />
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit consequuntur debitis odio architecto qui ea, nostrum, magnam magni eligendi voluptatum error similique neque voluptate rem, nemo deleniti temporibus? Eum facilis fuga sed neque corporis, voluptate cupiditate deserunt eaque necessitatibus atque laudantium dolorum. Est vero inventore quas praesentium, nobis optio quo quam alias consectetur autem atque sequi, facilis obcaecati unde repellendus quod laborum officiis animi modi veritatis enim blanditiis molestias nesciunt. Est incidunt fugit ab voluptates culpa delectus mollitia sint? Eius, a earum. Error cum nostrum autem a adipisci dolores voluptatum ex enim similique tenetur reiciendis porro modi vero quas corrupti ad nemo, velit, earum sequi aut alias quos et illum amet. Reiciendis explicabo voluptatem incidunt et illo dolor, culpa inventore eos laboriosam amet dicta recusandae velit nobis aut aspernatur doloremque deleniti cum aliquam ut optio. Sequi magnam, maxime officia tempore quaerat reiciendis laudantium maiores? Nisi perferendis corrupti ducimus, facere minima unde ipsum iusto omnis. Ipsam, commodi. Accusamus velit quaerat ratione officiis blanditiis eum odit? Ipsum cumque facilis quaerat. Cumque, similique commodi odio dolor sunt quaerat, consectetur dolorem ipsum natus illum dolorum doloribus mollitia sed, consequuntur quae omnis quam corporis recusandae numquam expedita officia maiores. Nam in deserunt harum modi ducimus sed. Doloremque aut magnam sit corporis minima illum. In id doloribus ducimus dolor maxime fugit illo dolore atque, at architecto placeat sunt optio perferendis sequi sapiente ullam eligendi aliquam inventore neque, ratione repellat accusantium vitae deleniti. Voluptates unde cumque dolor provident nihil repellat distinctio accusantium impedit, ea error fugit ipsum totam alias a minima, odio praesentium animi modi incidunt! Corporis quidem sed dolorum? Explicabo officia atque odit, voluptatem amet fugit quod perspiciatis architecto ab eius iure! Velit incidunt ad quae architecto eveniet. Adipisci suscipit quisquam dicta cum nam, eaque voluptatem consequuntur autem eum exercitationem? Accusamus sed quae nulla maiores tempora.
    </>
  )
}

export default Home