"use client";

import CampaignCard from "@/components/CampaignCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ICampaignCollection } from "@/models/widgets/ICampaignCollection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";


const LERP = 0.06;
const SCROLL_BUFFER = 200;
const CampaignCollection = ({ campaigns }: ICampaignCollection) => {
  const [mobileActive, setMobileActive] = useState(false);

  // Desktop: sticky + lerp horizontal scroll
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(0);
  const currentX = useRef(0);
  const rafId = useRef(0);
  const [wrapperHeight, setWrapperHeight] = useState("100vh");

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const scrollableWidth = Math.max(0, track.scrollWidth - window.innerWidth);
      setWrapperHeight(`${window.innerHeight + scrollableWidth + SCROLL_BUFFER * 2}px`);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [campaigns]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollableWidth = Math.max(0, track.scrollWidth - window.innerWidth);
      const adjustedScroll = -rect.top - SCROLL_BUFFER;
      const progress = Math.max(0, Math.min(1, adjustedScroll / Math.max(scrollableWidth, 1)));
      targetX.current = -(progress * scrollableWidth);
    };

    const animate = () => {
      const delta = targetX.current - currentX.current;
      currentX.current += delta * LERP;
      if (Math.abs(delta) < 0.5) {
        currentX.current = targetX.current;
      }
      track.style.transform = `translate3d(${currentX.current}px, 0, 0)`;
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [campaigns]);

  return (
    <div className="bg-primary-off-white text-[#000]">
      {/* Mobile — manual swipe carousel with arrows */}
      <div className="py-8 md:hidden">
        <Carousel opts={{ loop: false, align: "center" }} className="flex w-full flex-col gap-6">
          <CarouselContent className="ml-0 gap-8">
            {campaigns?.map((campaign, index) => (
              <CarouselItem key={index} className="basis-[100%] pl-0">
                <CampaignCard
                  image={campaign.image}
                  name={campaign.name}
                  cta={campaign.cta}
                  icon={campaign.icon}
                  tall
                  className={"relative left-[50%] w-[300px] -translate-x-1/2"}
                  imgContainerClass={"h-[375px]"}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-between px-6">
            <CarouselPrevious
              className="relative inset-0 w-auto translate-y-0 gap-0"
              variant={null}
              onPointerDown={() => setMobileActive(true)}
            >
              <ChevronLeft color="#000" className="size-10" strokeWidth={1} />
            </CarouselPrevious>
            <CarouselNext
              className="relative inset-0 w-auto translate-y-0 gap-0"
              variant={null}
              onPointerDown={() => setMobileActive(true)}
            >
              <ChevronRight color="#000" className="size-10" strokeWidth={1} />
            </CarouselNext>
          </div>
        </Carousel>
      </div>

      <div className="hidden md:block">
        <style>{`
          .cc-card {
            width: calc(50vw - 40px);
          }
          .cc-card > div {
            width: 100% !important;
          }
        `}</style>
        <div ref={wrapperRef} style={{ height: wrapperHeight }}>
          <div className="sticky top-0 h-screen overflow-hidden bg-primary-off-white">
            <div
              ref={trackRef}
              className="flex h-full w-max gap-20"
              style={{ willChange: "transform" }}
            >
              {campaigns?.map((campaign, index) => (
                <div key={index} className="cc-card shrink-0">
                  <CampaignCard
                    image={campaign.image}
                    name={campaign.name}
                    cta={campaign.cta}
                    icon={campaign.icon}
                    tall={index % 2 === 0}
                    className={"md:h-[100vh]"}
                    imgContainerClass={"!h-[90vh]"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCollection;
