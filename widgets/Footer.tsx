"use client";

import DesktopFooterNavigation from "@/components/homepage/DesktopFooterNavigation";
import MobileFooterNavigation from "@/components/homepage/MobileFooterNavigation";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { IFooter } from "@/models/widgets/IFooter";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/RichText";
import { useFooterVisibility } from "@/lib/FooterContext";
import { useEffect, useRef } from "react";

const Footer = ({
  newsletterTitle,
  newsletterSubtitle,
  social,
  navigationLinks,
  copyright,
  logo,
}: Partial<IFooter>) => {
  const { current } = useBreakpoint(breakpoints);
  const footerRef = useRef<HTMLDivElement>(null);
  const { setIsFooterVisible } = useFooterVisibility();

  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    // IntersectionObserver to detect when footer enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Footer is visible when it intersects the viewport
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    );

    observer.observe(footerElement);

    return () => observer.disconnect();
  }, [setIsFooterVisible]);

  return (
    <footer
      ref={footerRef}
      className="font-matter-regular bg-dark-green h-auto w-full px-6 py-8 font-normal text-white lg:px-10 lg:py-12"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-[104px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12">
          <h5 className="text-sm">{newsletterTitle}</h5>
          {newsletterSubtitle?.doc?.type && (
            <RichText
              doc={{
                type: newsletterSubtitle.doc.type,
                content: newsletterSubtitle.doc.content,
              }}
              className={{
                p: "text-sm",
              }}
            />
          )}
        </div>

        {social?.href && (
          <div className="flex flex-row items-center gap-3">
            <Link href={social.href} className="flex items-center">
              <Image
                src={social.icon || "/icons/instagram.svg"}
                alt={social.title || ""}
                height={32}
                width={32}
                unoptimized
              />
            </Link>

            <h5 className="text-base lg:text-sm">{social?.title}</h5>
          </div>
        )}
      </div>
      <div className="pt-8">
        <div className="border-b-hairline" />
        {["desktop", "laptop"].includes(current) && <DesktopFooterNavigation navigationLinks={navigationLinks} />}
        {["mobile", "tablet"].includes(current) && <MobileFooterNavigation navigationLinks={navigationLinks} />}
        <div className="border-b-hairline" />
      </div>
      <div className="flex flex-col gap-10 pt-12 lg:flex-row lg:items-center lg:justify-between">
        {logo && <Image src={logo.src} alt={logo.alt} height={59} width={105} unoptimized />}
        {copyright && <p className="max-w-full text-[8px]">{copyright}</p>}
      </div>
    </footer>
  );
};

export default Footer;
