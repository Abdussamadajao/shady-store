import React, { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 768px)": { dragFree: false },
    },
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Main Product Image Slider - Full height */}
      <div className="flex-1 bg-white rounded-2xl  p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="flex-1 overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                <div className="h-full w-full flex items-center justify-center">
                  <img
                    src={image}
                    alt={`${productName} - Image ${index + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation - Fixed at bottom */}
      <div className="flex justify-center gap-3 sm:gap-4 flex-shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all duration-200 border-2 touch-manipulation hover:scale-105 ${
              index === selectedIndex
                ? "border-secondary-100 ring-2 ring-secondary-100 ring-opacity-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
