"use client";

import React, { useState, useEffect } from "react";
import { IFaqBanner } from "@/models/widgets/IFaqBanner";
import { ArrowRight, X } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

const FaqBanner = ({ heading }: IFaqBanner) => {
  const { searchQuery, setSearchQuery, isSearching, hasOpenAccordion } = useSearch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
    <div className="bg-white pt-24 lg:pt-24" />
    <section className={`bg-[#3A3A2C] max-w-9xl px-6 pt-8 lg:px-20 lg:pb-8 lg:pt-20 ${searchQuery ? 'pb-8' : ''}`}>
      <div className="mx-auto max-w-9xl">
        {heading && (
          <h2 className="font-matter-regular mb-8 text-4xl text-white lg:text-5xl lg:mb-4">
            {heading}
          </h2>
        )}
        
        <div className="flex items-center gap-6 lg:pt-8">
          <div className="relative flex-1 mt-8 lg:mt-0">
            <input
              type="text"
              placeholder={isMobile ? "Search" : "Search something"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[59px] rounded-full border border-white bg-[#3A3A2C] py-3 pr-5 lg:pr-28 pl-5 text-base text-white placeholder-white placeholder:text-[18px] placeholder:font-matter-regular placeholder:font-normal outline-none"
            />
            {!searchQuery && (
              <ArrowRight className="absolute inset-y-0 left-20 my-auto h-5 w-5 text-white pointer-events-none lg:hidden" />
            )}
            {!searchQuery && (
              <button
                type="button"
                className="absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-1.5 rounded-full px-4 py-1.5 text-base text-white font-matter-regular lg:flex"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="flex h-9 w-9 min-w-9 shrink-0 items-center justify-center mt-8 lg:mt-0">
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex h-full w-full items-center justify-center rounded-full border border-white transition-colors hover:bg-white/10"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default FaqBanner;
