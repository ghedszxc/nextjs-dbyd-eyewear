import { useEffect, useRef } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

interface UseCarouselScrollOptions {
  enabled?: boolean;
  wheelSensitivity?: number; // pixels to scroll before advancing slide
}

export function useCarouselScroll(
  containerRef: React.RefObject<HTMLElement>,
  api: CarouselApi | null,
  options: UseCarouselScrollOptions = {}
) {
  const { enabled = true, wheelSensitivity = 50 } = options;
  const wheelDeltaRef = useRef(0);

  useEffect(() => {
    if (!enabled || !containerRef.current || !api) return;

    const handleWheel = (event: WheelEvent) => {
      // Only handle vertical scrolling
      if (event.deltaY === 0) return;

      // Accumulate wheel delta
      wheelDeltaRef.current += Math.abs(event.deltaY);

      // Check if carousel has more slides in scroll direction
      const scrollingDown = event.deltaY > 0;
      const hasNextSlide = api.canScrollNext();

      // If scrolling down and carousel has slides, prevent default and advance carousel
      if (scrollingDown && hasNextSlide && wheelDeltaRef.current >= wheelSensitivity) {
        event.preventDefault();
        api.scrollNext();
        wheelDeltaRef.current = 0;
        return;
      }

      // If scrolling up and carousel can scroll back, prevent default
      if (!scrollingDown && api.canScrollPrev() && wheelDeltaRef.current >= wheelSensitivity) {
        event.preventDefault();
        api.scrollPrev();
        wheelDeltaRef.current = 0;
        return;
      }

      // If carousel is at the end and user scrolls, reset delta to allow page scroll
      if (scrollingDown && !hasNextSlide) {
        wheelDeltaRef.current = 0;
      }
    };

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [api, enabled, wheelSensitivity]);
}
