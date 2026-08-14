"use client";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { imageSizes } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";


type ImageItem = {
  src: string;
  alt: string;
};

function Dots({
  count,
  current,
  onGo,
  orientation,
  className,
}: {
  count: number;
  current: number;
  onGo: (index: number) => void;
  orientation: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2", orientation === "vertical" ? "flex-col" : "flex-row", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => onGo(index)}
          className={cn(
            "h-2.5 w-2.5 rounded-full border transition",
            current === index
              ? "bg-foreground border-foreground"
              : "border-muted-foreground hover:border-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

export function ProductGallery({ images, productInfo, previewImage, onCarouselApiReady }: { images: ImageItem[]; productInfo: any; previewImage?: ImageItem; onCarouselApiReady?: (api: CarouselApi) => void }) {
  const reversedImages = [...images].reverse();
   
  const displayedImages = previewImage ? [previewImage, ...reversedImages.slice(1)] : reversedImages;
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);

  const { current: currentViewport } = useBreakpoint(breakpoints);
  

  React.useEffect(() => {
    if (api && onCarouselApiReady) {
      onCarouselApiReady(api);
    }
  }, [api, onCarouselApiReady]);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const goTo = (index: number) => api?.scrollTo(index);

  return (
    <div className="relative flex flex-col gap-12 px-6 py-10 lg:gap-0">
      {/* Desktop dots (left side) */}
      <Dots
        count={reversedImages.length}
        current={current}
        onGo={goTo}
        orientation="vertical"
        className="absolute bottom-0 left-12 z-10 hidden lg:flex"
      />

      <div className="flex w-full flex-col gap-2 text-[#000000] lg:hidden">
        <div className="flex flex-col gap-6">
          <span className="font-matter-bold text-lg">{productInfo.productCode}</span>
        </div>

        <div className="font-matter-regular flex gap-6 text-sm lg:hidden">
          {productInfo.productLabels?.map((l: string, i: number) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>

      <div className="h-[188.04px] w-full lg:h-[544px] lg:pl-12">
        <Carousel setApi={setApi} opts={{}} orientation={`${currentViewport === "desktop" ? "vertical" : "horizontal"}`} className="relative h-full">
          <CarouselContent className="relative ml-0 h-full!">
            {displayedImages.map((img, index) => (
            <CarouselItem key={index} className="relative h-full pl-0">
                <div className="relative ml-auto flex h-full items-center justify-center">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={imageSizes({ base: "100vw", lg: "624px" })}
                    className="max-h-[188.04px] place-self-center-safe object-contain! md:left-1/2! md:-translate-x-1/2! lg:top-1/2! lg:left-1/2! lg:max-h-[544px] lg:max-w-[624px] lg:translate-x-[-40%] lg:-translate-y-1/2 lg:object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* <div className="flex flex-col gap-8 lg:pl-12">
        {reversedImages.map((img, index) => (
          <div key={`${img.src}-${index}`} className="relative flex h-full w-full items-center justify-center">
            <div className="relative h-[188.04px] w-full lg:h-[544px] lg:w-[624px]">
              <Image src={img.src} alt={img.alt}   fill className="object-contain" />
            </div>
          </div>
        ))}
      </div> */}

      {/* Mobile dots (center bottom) */}
      <Dots
        count={reversedImages.length}
        current={current}
        onGo={goTo}
        orientation="horizontal"
        className="flex items-center lg:hidden"
      />
    </div>
  );
}
