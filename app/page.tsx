import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import VenueFeatures from "@/components/sections/VenueFeatures";
import Events from "@/components/sections/Events";
import Accommodation from "@/components/sections/Accommodation";
import Gallery from "@/components/sections/Gallery";
import Packages from "@/components/sections/Packages";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <VenueFeatures />
      <Events />
      <Accommodation />
      <Gallery />
      <Packages />
      <Contact />
    </>
  );
}
