import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageSliderProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  autoplay?: boolean;
  loop?: boolean;
  slidesPerView?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  autoplay = true,
  loop = true,
  className,
  style,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: "start",
    slidesToScroll: 1,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || !emblaApi) return;

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else if (loop) {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, emblaApi, loop]);

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full rounded-lg sm:rounded-xl shadow-lg bg-gray-100",
        className
      )}
      style={style}
    >
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((image, index) => (
            <div
              key={index}
              className="embla__slide flex-[0_0_100%] min-w-full relative"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Enhanced Responsive */}
      <div className="absolute inset-0 flex items-center justify-between p-1 sm:p-2 md:p-4 pointer-events-none">
        <button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Progress Indicators - Enhanced Responsive */}
      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1 sm:space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-white/80 rounded-full shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
