import { IThreeColumnSection } from "@/models/widgets/IThreeColumnSection";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import RichText from "@/components/RichText";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imageSizes } from "@/lib/image-sizes";

const Card = ({
  card,
  iconLeft,
  iconRight,
  onPrev,
  onNext,
  showMobileArrows,
  length,
  currentIndex,
  index = 0,
}: {
  card: IThreeColumnSection["cards"][number];
  iconLeft?: { url: string; alt?: string };
  iconRight?: { url: string; alt?: string };
  onPrev?: () => void;
  onNext?: () => void;
  showMobileArrows?: boolean;
  length?: number;
  currentIndex?: number;
  index?: number;
}) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
  <div className="flex h-full w-full flex-col items-start">
    {/* Image Content */}
    {card.image && (
      <div
        ref={imgRef}
        className="relative mb-8 h-[400px] w-full overflow-hidden md:h-auto"
      >
        <div
          className="relative h-full w-full"
          style={showMobileArrows ? {} : {
            transform: isVisible ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.8s ease-out",
            transitionDelay: index > 0 ? `${index * 0.3}s` : "0s",
          }}
        >
          <Image
            src={card.image.url}
            alt={card.image.alt}
            width={0}
            height={0}
            sizes={imageSizes({ base: "100vw", md: "33vw" })}
            className="h-[400px] w-full object-cover md:h-auto"
          />
        </div>
      </div>
    )}

      {/* Text Content */}
      <div className="flex flex-col px-6 md:px-6">
        <div className="mb-2 text-[#000000] lg:font-normal">
          <h3 className="font-matter-bold mb-6 text-sm">{length && `${card.number}/${length}`}</h3>
          <h3 className="font-matter-regular mb-3 text-2xl">{card.title}</h3>
        </div>

      {card.body && (
        <div className="h-[90px] overflow-hidden lg:h-auto">
          <RichText
            doc={{
              type: card.body.doc.type,
              content: card.body.doc.content,
            }}
            className={{
              p: "font-matter-regular mb-4 text-sm lg:mb-0 text-[#000000]",
            }}
          />
        </div>
      )}

        {/* Mobile arrows */}
        {showMobileArrows && (
          <div className="mt-6 mb-8 flex justify-between gap-5 lg:hidden">
            {iconLeft?.url && onPrev && (
              <Button
                className="h-4 w-4 bg-transparent p-0 hover:bg-transparent"
                size="icon-sm"
                onClick={onPrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft color={currentIndex === 0 ? "#ccc" : "#000"} className="size-14" strokeWidth={1} />
              </Button>
            )}
            {iconRight?.url && onNext && (
              <Button
                className="h-4 w-4 bg-transparent p-0 hover:bg-transparent"
                size="icon-sm"
                onClick={onNext}
                disabled={currentIndex === length! - 1}
              >
                <ChevronRight
                  color={currentIndex === length! - 1 ? "#ccc" : "#000"}
                  className="size-14"
                  strokeWidth={1}
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
