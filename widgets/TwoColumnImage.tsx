"use client";

import React, { useEffect, useRef, useState } from "react";
import { ITwoColumnImage } from "@/models/widgets/ITwoColumnImage";
import Image from "next/image";
import RichText from "@/components/RichText";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { imageSizes } from "@/lib/image-sizes";

const Banner = ({ banner, responsiveImage = false }: { banner: ITwoColumnImage["left"]; responsiveImage?: boolean }) => {
  const { current } = useBreakpoint(breakpoints);
  const isMobile = current === "mobile" || current === "tablet";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [closingIndex, setClosingIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!isMobile || tappedIndex === null || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setTappedIndex(null);
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile, tappedIndex]);

  if (!banner?.desktop?.url && !banner?.mobile?.url) return null;
  const thumbnail = banner.mobile?.url || banner.desktop?.url || "";
  const thumbnailAlt = banner.mobile?.alt || banner.desktop?.alt || "";

  return (
    <div ref={containerRef} className={cn("relative w-full h-[300px]", responsiveImage ? "overflow-hidden lg:h-auto" : "lg:h-[652px]")}>
      {/* Mobile image — visible below md breakpoint */}
      {(banner.mobile?.url || banner.desktop?.url) && (
        <Image src={banner.mobile?.url || banner.desktop.url} alt={banner.mobile?.alt || banner.desktop.alt} fill sizes="100vw" className="block object-cover md:hidden" />
      )}

      {/* Desktop image — visible from md breakpoint up */}
      {banner.desktop?.url && (
        responsiveImage ? (
          <Image
            src={banner.desktop.url}
            alt={banner.desktop.alt}
            width={0}
            height={0}
            sizes={imageSizes({ base: "100vw", md: "50vw" })}
            className="hidden h-auto w-full md:block md:h-full md:object-cover"
             
          />
        ) : (
          <Image
            src={banner.desktop.url}
            alt={banner.desktop.alt}
            fill
            sizes={imageSizes({ base: "100vw", md: "50vw" })}
            className="hidden object-cover md:block"
          />
        )
      )}

      {/* + Button and Popover */}
      {banner?.cta?.href && (
        <div
          className="absolute bottom-6 left-6 z-10"
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex h-14 w-14 items-center justify-center rounded-none transition-opacity duration-200"
            style={{
              backgroundColor: banner?.darkBg || '#F7F2EABF',
              opacity: isMobile ? (tappedIndex !== null ? 0 : 1) : hoveredIndex === 0 || closingIndex === 0 ? 0 : 1,
            }}
            onClick={() => handleTap(0)}
            aria-label="View product details"
          >
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none" stroke="currentColor" strokeWidth={2} className={banner?.darkBg ? "text-white" : "text-black"}>
              <line x1="18.5" y1="0" x2="18.5" y2="37" />
              <line x1="0" y1="18.5" x2="37" y2="18.5" />
            </svg>
          </button>

          {(isMobile ? tappedIndex !== null : hoveredIndex === 0 || closingIndex === 0) && (
            <div
              ref={isMobile && tappedIndex !== null ? popoverRef : undefined}
              className={`absolute bottom-0 left-0 z-20 flex items-center gap-4 ${banner?.darkBg ? "bg-[#3A3A2C]/75" : "bg-[#F7F2EA]/75"} backdrop-blur-[16px] p-3 shadow-lg ${isMobile ? "h-[96px] w-[300px]" : "h-[120px] w-[324px]"}`}
              style={
                isMobile
                  ? {}
                  : {
                      transformOrigin: "bottom left",
                      animation: hoveredIndex === 0
                        ? "popoverReveal 0.2s ease-out forwards"
                        : "popoverExit 0.8s ease-in-out forwards",
                    }
              }
              onAnimationEnd={() => {
                if (!isMobile && closingIndex === 0) setClosingIndex(null);
              }}
            >
              <div
                className="flex items-center gap-4"
                style={
                  isMobile
                    ? {}
                    : {
                        ...(hoveredIndex !== 0
                          ? { animation: "contentSlide 0.8s ease-in-out forwards" }
                          : {}),
                      }
                }
              >
                {(banner?.cta?.icon || thumbnail) && (
                  <div className="relative h-[64px] w-[120px] shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={banner?.cta?.icon || thumbnail}
                      alt={banner?.cta?.productName || thumbnailAlt}
                      fill
                      sizes="120px"
                      className={banner?.cta?.icon ? "object-contain" : "object-cover"}
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className={`text-[16px] font-bold font-matter-bold ${banner?.darkBg ? "text-white" : "text-black"}`}>{banner?.cta?.productName}</p>
                  <Link
                    href={banner.cta?.href || "#"}
                    className={`mt-1 inline-flex items-center font-matter-regular gap-1 text-[18px] font-normal transition ${banner?.darkBg ? "text-white hover:text-white" : "text-black hover:text-black"}`}
                  >
                    {banner.cta?.text || "View product"} <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TwoColumnImage = ({ left, right, title, body, paddingY, bgColor, spacingBottom, responsiveImage = false, containerHeight }: ITwoColumnImage) => {
  if (!left && !right) return null;

  return (
    <section>
      {/* CSS keyframe animations for popover enter/exit */}
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
      `}</style>

      {containerHeight && (
        <style>{`
          @media (min-width: 1700px) {
            [style*="--container-h"] {
              height: var(--container-h) !important;
            }
          }
        `}</style>
      )}

      <div
        className={`grid w-full grid-cols-1 gap-2 p-2 md:grid-cols-2 ${paddingY ? "lg:px-0 md:pt-[var(--pd-y)] md:pb-[var(--pd-y)]" : "lg:p-0 lg:pt-2"} ${spacingBottom && "lg:pb-16"}`}
        style={
          {
            backgroundColor: bgColor,
            ...(paddingY ? ({ "--pd-y": paddingY } as React.CSSProperties) : {}),
            ...(containerHeight ? { ['--container-h' as string]: containerHeight } : {}),
          } as React.CSSProperties
        }
      >
        <Banner banner={left} responsiveImage={responsiveImage} />
        <Banner banner={right} responsiveImage={responsiveImage} />
      </div>

      {(title || body) && (
        <div className="px-6 py-8 text-[#000000] lg:px-[80px] lg:py-[48px]" style={{ backgroundColor: bgColor }}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2">
            {title && <h4 className="font-matter-regular text-2xl leading-[24px]">{title}</h4>}
            {body && (
              <div className="lg:pr-12 lg:pl-0">
                <RichText
                  doc={{
                    type: body.doc.type,
                    content: body.doc.content,
                  }}
                  className={{
                    p: "font-matter-regular text-base leading-relaxed",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TwoColumnImage;
