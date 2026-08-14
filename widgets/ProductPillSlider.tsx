"use client";

import { IProductPillSlider } from "@/models/widgets/IProductPillSlider";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { imageSizes } from "@/lib/image-sizes";

const ProductPillSlider = ({ title, pills, visibleButtonCount }: IProductPillSlider) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { current } = useBreakpoint(breakpoints);
  const isMobile = current === "mobile" || current === "tablet";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [closingIndex, setClosingIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = getCardWidth();
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex);
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const handleMouseEnter = (index: number) => {
    if (isMobile) return;
    setClosingIndex(null);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setClosingIndex(hoveredIndex);
    setHoveredIndex(null);
  };

  const popoverRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleTap = (index: number) => {
    if (!isMobile) return;
    setTappedIndex(tappedIndex === index ? null : index);
  };

  useEffect(() => {
    if (!isMobile || tappedIndex === null) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setTappedIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, tappedIndex]);

  useEffect(() => {
    if (!isMobile || tappedIndex === null || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setTappedIndex(null);
      },
      { threshold: 0 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMobile, tappedIndex]);

  const getCardWidth = () => {
    const firstCard = scrollRef.current?.firstElementChild as HTMLElement | null;
    return firstCard ? firstCard.offsetWidth + 20 : 520; // card width + gap-5 (20px)
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = getCardWidth();
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-10 md:py-20">
      <style>{`
        @keyframes popoverReveal {
          0% {
            clip-path: inset(50% 50% 0% 0%);
          }
          100% {
            clip-path: inset(0% 0% 0% 0%);
          }
        }
        @keyframes popoverExit {
          0% {
            clip-path: inset(0% 0% 0% 0%);
          }
          50% {
            clip-path: inset(50% 0% 0% 0%);
          }
          100% {
            clip-path: inset(50% 100% 0% 0%);
          }
        }
        @keyframes contentSlide {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(55%);

          }
          100% {
            transform: translateY(55%);
          }
        }
        @media (min-width: 2000px) {
          .pps-card {
            width: calc(50% - 10px);
            height: auto;
            aspect-ratio: 1;
            flex-shrink: 0;
          }
        }
      `}</style>
      {title && ( 
        <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      )}
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="pps-scroll flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {pills?.map((pill, index) => (
            <div
              key={index}
              className="pps-card relative h-[calc(100vw-2rem)] w-[calc(100vw-2rem)] shrink-0 overflow-visible md:h-[500px] md:w-[500px]"
            >           
                {pill.image?.url && (
                  <Image
                    src={pill.image.url}
                    alt={pill.image.alt || pill.label}
                    fill
                    sizes={imageSizes({ base: "100vw", md: "500px", "2xl": "50vw" })}
                    className="object-cover"
                  />
                )}

              {(visibleButtonCount == null || index < visibleButtonCount) && (
                <div
                  className="absolute bottom-6 left-6 z-10"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="flex h-14   w-14 items-center justify-center rounded-none bg-[#F7F2EABF] transition-opacity duration-200"
                    style={{
                      opacity: isMobile
                        ? tappedIndex === index
                          ? 0
                          : 1
                        : hoveredIndex === index || closingIndex === index
                          ? 0
                          : 1,
                    }}
                    onClick={() => handleTap(index)}
                    aria-label="View product details"
                  >
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" stroke="currentColor" strokeWidth={2} className="text-black">
                      <line x1="18.5" y1="0" x2="18.5" y2="37" />
                      <line x1="0" y1="18.5" x2="37" y2="18.5" />
                    </svg>
                  </button>

                  {(isMobile ? tappedIndex === index : hoveredIndex === index || closingIndex === index) && (
                    <div
                      ref={isMobile && tappedIndex === index ? popoverRef : undefined}
                      className={`absolute bottom-0 left-0 z-20 flex items-center gap-4 bg-[#F7F2EA]/75 backdrop-blur-[16px] p-3 shadow-lg ${isMobile ? "h-[96px] w-[300px]" : "h-[120px] w-[324px]"}`}
                      style={
                        isMobile
                          ? {}
                          : {
                              transformOrigin: "bottom left",
                              animation: hoveredIndex === index
                                ? "popoverReveal 0.2s ease-out forwards"
                                : "popoverExit 0.8s ease-in-out forwards",
                            }
                      }
                      onAnimationEnd={() => {
                        if (!isMobile && closingIndex === index) setClosingIndex(null);
                      }}
                    >
                      <div
                        className="flex items-center gap-4"
                        style={
                          isMobile
                            ? {}
                            : {
                                ...(hoveredIndex !== index
                                  ? { animation: "contentSlide 0.8s ease-in-out forwards" }
                                  : {}),
                              }
                        }
                      >
                        {(pill.icon?.url || pill.thumbnail?.url) && (
                          <div className="relative h-[64px] w-[120px] shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={pill.icon?.url || pill.thumbnail.url}
                              alt={pill.icon?.alt || pill.thumbnail.alt || pill.name}
                              fill
                              sizes="120px"
                              className={pill.icon?.url ? "object-contain" : "object-cover"}
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[16px] font-bold text-black font-matter-bold">{pill.label}</p>
                          <Link
                            href={pill.targetUrl || "#"}
                            className="mt-1 inline-flex items-center font-matter-regular gap-1 text-[18px] font-normal text-black transition hover:text-black"
                          >
                            {pill.ctaText || "View product"} <span>&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="pps-nav mt-6 flex items-center justify-end gap-4 px-[24px] md:px-[32px]">
        <button
          onClick={() => scroll("left")}
          className="flex h-8 w-8 items-center justify-center transition hover:opacity-70"
          aria-label="Scroll left"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22,4 10,16 22,28" />
          </svg>
        </button>

        <span className="inline-block w-[2ch]" aria-hidden="true" />

        <button
          onClick={() => scroll("right")}
          className="flex h-8 w-8 items-center justify-center transition hover:opacity-70"
          aria-label="Scroll right"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10,4 22,16 10,28" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ProductPillSlider;
