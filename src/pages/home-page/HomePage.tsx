import Hero from "../../components/landing/Hero";
import About from "../../components/landing/About";
import FeaturedProducts from "../../components/landing/FeaturedProducts/FeaturedProducts";
import OurPromise from "../../components/landing/PromiseSection";
import ContactIntro from "../../components/landing/contact-us/Contact";
import TestimonialsSection from "../../components/landing/testimonial/TestimonialsSection";
import OurStory from "../../components/landing/StorySection";

// Disabled sections (enable when ready)
// import HowOurLaddoosAreMade from "../../components/landing/HowOurLaddoosAreMade";
// import CustomerVideo from "../../components/landing/CustomerVideoStories/CustomerVideoStories";
// import WhyChooseUs from "../../components/landing/WhyChooseUs";

function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <OurStory />
      <About />
      <OurPromise />
      {/* <HowOurLaddoosAreMade /> */}
      <TestimonialsSection />
      {/* <CustomerVideo /> */}
      <ContactIntro />
      {/* <WhyChooseUs /> */}
    </main>
  );
}

export default HomePage;