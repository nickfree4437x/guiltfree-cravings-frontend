import Hero from "../../components/landing/Hero";
import About from "../../components/landing/About";
import FeaturedProducts from "../../components/landing/FeaturedProducts/FeaturedProducts";
import OurPromise from "../../components/landing/PromiseSection";
// import OurVision from "../../components/landing/OurVision";
// import WhyChooseUs from "../../components/landing/WhyChooseUs";
// import OurStory from "../../components/landing/StorySection";

function HomePage() {
  return (
    <>

      <main>
        <Hero />
        <About/>
        <FeaturedProducts/>
        <OurPromise/>
        {/* <OurStory/>
        <OurVision/>
        <WhyChooseUs/> */}
      </main>
    </>
  );
}

export default HomePage;