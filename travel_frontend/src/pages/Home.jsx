import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import PackageCard from "../components/PackageCard";
import WhyUs from "../components/WhyUs";
import ExclusivePackages from "../components/ExclusivePackages";
import AboutUs from "../components/AboutUs";
import GallerySection from "../components/GallerySection";

import domesticImg from "../assets/images/domestic.png";
import internationalImg from "../assets/images/international.png";
import budgetImg from "../assets/images/budget.png";

export default function Home() {
  return (
    <>
      <Hero />

      <h2 className="text-center mt-28 text-4xl font-extrabold 
      bg-gradient-to-r from-blue-400 via-blue-600 to-purple-700
      bg-clip-text text-transparent tracking-wide drop-shadow-sm">
        Popular Tour Packages
      </h2>

      <div className="flex flex-wrap justify-center gap-12 mt-12 px-4">
        <PackageCard id="domestic" title="Domestic Package" img={domesticImg} />
        <PackageCard id="international" title="International Package" img={internationalImg} />
        <PackageCard id="budget" title="Budget Package" img={budgetImg} />
      </div>

      <ExclusivePackages />

      <GallerySection />

      {/* ⭐ ABOUT US SECTION (scroll target) ⭐ */}
      <div id="about-section" className="mt-24">
        <AboutUs />
      </div>

      <WhyUs />
    </>
  );
}
