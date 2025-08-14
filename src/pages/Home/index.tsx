import Filter from "@/components/filter";
import { Product } from "@/components/product";
import { ImageSlider } from "@/components/shared";
import heroOne from "@/assets/images/hero-1.jpg";
import heroTwo from "@/assets/images/hero-2.jpg";
import React from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Home: React.FC = () => {
  // Auto-scroll to top when navigating to home
  useScrollToTop();

  // Dummy images for the slider
  const images = [
    {
      src: heroOne,
      alt: "E-commerce Banner 1",
    },
    {
      src: heroTwo,
      alt: "E-commerce Banner 2",
    },
  ];

  return (
    <div className="min-h-screen w-full  px-4 pb-20  py-4 md:px-6 md:py-10 lg:px-8 lg:py-6">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="flex flex-col gap-4">
          <ImageSlider images={images} />
          <Product />
        </div>
      </div>

      {/* Desktop Layout - Improved for 1024px */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 xl:gap-6 ">
        {/* Filter Sidebar - Adjusted width for 1024px */}
        <div className="col-span-2 xl:col-span-2 lg:sticky lg:top-[100px] lg:h-[calc(100vh-120px)] lg:overflow-y-auto">
          <Filter />
        </div>

        {/* Main Content - Adjusted for better 1024px layout */}
        <main className="col-span-9 xl:col-span-10 lg:overflow-y-auto lg:flex lg:flex-col lg:gap-4 xl:gap-6">
          <div className="lg:mb-4">
            <ImageSlider images={images} />
          </div>
          <div className="lg:flex-1 ">
            <Product />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
