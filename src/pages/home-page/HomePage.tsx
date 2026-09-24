import Hero from "../../components/landing/Hero";
import About from "../../components/landing/About";
import FeaturedProducts from "../../components/landing/FeaturedProducts/FeaturedProducts";
import OurPromise from "../../components/landing/PromiseSection";
import HowOurLaddoosAreMade from "../../components/landing/HowOurLaddoosAreMade";
import ContactIntro from "../../components/landing/contact-us/Contact";
// import WhyChooseUs from "../../components/landing/WhyChooseUs";
//import OurStory from "../../components/landing/StorySection";

function HomePage() {
  return (
    <>

      <main>
        <Hero />
        <About/>
        <FeaturedProducts/>
        <OurPromise/>
        <HowOurLaddoosAreMade/>
        <ContactIntro/>
        {/* <OurStory/> */}
        {/* <WhyChooseUs/> */}
      </main>
    </>
  );
}

export default HomePage;