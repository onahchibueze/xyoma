import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Art from "@/components/Art";
import Features from "@/components/Features";
import Collection from "@/components/Collection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <About />
   
      <Features />
      <Collection limit={4} showSeeMore={true} />
         <Art />
      <Contact />
      <Footer />
    </div>
  );
}
