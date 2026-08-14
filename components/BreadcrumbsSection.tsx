"use client";

import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbsSectionProps {
  items: BreadcrumbItem[];
}

const BreadcrumbsSection = ({ items }: BreadcrumbsSectionProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY > 0) {
        // scroll down — hide breadcrumbs
        setIsVisible(false);
      }

      if (currentY === 0) {
        // scroll up — show breadcrumbs
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="bg-secondary-light mt-20 lg:mt-22">
      {isVisible && (
        <div>
          <div className="bg-white px-6 py-2 transition-all duration-200 lg:px-8 lg:py-4">
            <Breadcrumbs items={items} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BreadcrumbsSection;
