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
  slidesPerView = 1,
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
        "relative overflow-hidden w-full h-full sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg",
        className
      )}
      style={style}
    >
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((image, index) => (
            <div
              key={index}
              className="embla__slide flex-[0_0_100%] min-w-full"
            >
              <img
                src={image.src}
                alt={image.alt}
                className=" w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="Nav prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <button
        className="Nav next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
};

export default ImageSlider;
