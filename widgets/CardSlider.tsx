"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";
import { ICardSlider } from "@/models/widgets/ICardSlider";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CardSliderItem from "@/components/CardSliderItem";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NORMAL_SPEED = 0.5;
const HOVER_SPEED = 0.2;
const MIN_ITEMS_FOR_LOOP = 12;

const CardSlider = ({ title, subtitle, items }: ICardSlider) => {
  const { current } = useBreakpoint(breakpoints);
  const [api, setApi] = useState<CarouselApi>();
  const rafRef = useRef<number>(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);

  const duplicatedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const result = [...items];
    while (result.length < MIN_ITEMS_FOR_LOOP) {
      result.push(...items);
    }
    return result;
  }, [items]);

  const startSlowScroll = useCallback(() => {
    if (!api) return;
    const tick = () => {
      if (!isHoveredRef.current || isDraggingRef.current || !api) return;
      const engine = api.internalEngine();
      engine.location.add(-HOVER_SPEED);
      engine.target.set(engine.location);
      engine.previousLocation.set(engine.location);
      engine.scrollLooper.loop(engine.scrollBody.velocity());
      engine.slideLooper.loop();
      engine.translate.to(engine.location.get());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [api]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
  }, []);

  useEffect(() => {
    if (!api) return;
    const onAutoScrollStop = () => {
      if (isHoveredRef.current && !isDraggingRef.current) startSlowScroll();
    };

    api.on("autoScroll:stop", onAutoScrollStop);

    return () => {
      api.off("autoScroll:stop", onAutoScrollStop);
    };
  }, [api, startSlowScroll]);

  useEffect(() => {
    if (!api) return;

    const onPointerDown = () => {
      isDraggingRef.current = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      if (isHoveredRef.current) {
        const onSettle = () => {
          api.off("settle", onSettle);
          if (isHoveredRef.current && !isDraggingRef.current) {
            startSlowScroll();
          }
        };
        api.on("settle", onSettle);
      }
    };

    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);

    return () => {
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
    };
  }, [api, startSlowScroll]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="mt-[48px] text-[#000] lg:mt-[80px] lg:mb-[80px]">
      <div className="font-matter-regular mb-[24px] grid grid-cols-1 px-4 lg:mb-[40px] lg:grid-cols-2 lg:px-[80px]">
        <h3 className="mb-[16px] text-2xl">{title}</h3>
        <p className="text-base">{subtitle}</p>
      </div>

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Carousel
          setApi={setApi}
          plugins={[
            AutoScroll({
              playOnInit: current != "mobile",
              speed: NORMAL_SPEED,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            loop: true,
            align: current === "mobile" ? "start" : "center",
          }}
        >
          <CarouselContent>
            {duplicatedItems.map((item, index) => (
              <CarouselItem key={index} className="basis-auto">
                <CardSliderItem
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  number={index}
                  length={duplicatedItems.length}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {current == "mobile" && (
            <div className="my-8 flex justify-between pl-3 md:hidden">
              <CarouselPrevious className="relative inset-0 translate-y-0 gap-0 disabled:opacity-100" variant={null}>
                <ChevronLeft color="#000" className="size-10" strokeWidth={1} />
              </CarouselPrevious>
              <CarouselNext className="relative inset-0 mr-8 translate-y-0 gap-0 disabled:opacity-100" variant={null}>
                <ChevronRight color="#000" className="size-10" strokeWidth={1} />
              </CarouselNext>
            </div>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default CardSlider;
