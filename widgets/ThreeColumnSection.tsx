"use client";

import { IThreeColumnSection } from "@/models/widgets/IThreeColumnSection";
import React, { useState } from "react";
import Card from "@/components/homepage/Card";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";

const ThreeColumnSection = ({ cards = [], iconLeft, iconRight }: IThreeColumnSection) => {
  const { current } = useBreakpoint(breakpoints);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  if (cards.length === 0) return null;

  return (
    <section className="bg-[#F6F6F6]">
      {current !== "mobile" && (
        <div className="grid w-full grid-cols-3 gap-2 bg-[#F6F6F6] p-20">
          {cards.map((card, index) => (
            <Card key={index} card={card} index={index} />
          ))}
        </div>
      )}

      {current === "mobile" && (
        <div className="mx-auto max-w-7xl">
          <Card
            card={cards[activeIndex]}
            iconLeft={iconLeft}
            iconRight={iconRight}
            onPrev={handlePrev}
            onNext={handleNext}
            showMobileArrows
            length={cards.length}
            currentIndex={activeIndex}
          />
        </div>
      )}
    </section>
  );
};

export default ThreeColumnSection;
