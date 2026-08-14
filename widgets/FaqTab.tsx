'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IFaqTab } from '@/models/widgets/IFaqTab';
import { useSearch } from '@/context/SearchContext';
import FaqBar from './FaqBar';


const FaqTab = ({ tabs }: IFaqTab) => {
  const [activeTab, setActiveTab] = useState(0);
  const isClickScrolling = useRef(false);
  const { isSearching, searchQuery, hasSearchResults } = useSearch();

  // Scroll-spy: direction-aware active tab detection
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!tabs || tabs.length === 0) return;

    const navbarHeight = window.innerWidth >= 1024 ? 112 : 80;
    const faqBarHeight = 60;
    const offset = navbarHeight + faqBarHeight;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY >= lastScrollY.current;
      lastScrollY.current = currentScrollY;

      let activeIndex = 0;

      if (scrollingDown) {
        // Scroll DOWN: activate when section heading passes the trigger line
        for (let i = 0; i < tabs.length; i++) {
          if (!tabs[i].anchorTarget) continue;
          const el = document.getElementById(tabs[i].anchorTarget!);
          if (el && el.getBoundingClientRect().top <= offset + 10) {
            activeIndex = i;
          }
        }
      } else {
        let found = false;
        for (let i = 0; i < tabs.length; i++) {
          if (!tabs[i].anchorTarget) continue;
          const el = document.getElementById(tabs[i].anchorTarget!);
          if (!el) continue;

          // Find the actual section heading, fall back to element top
          const heading = el.querySelector('h3');
          const headingTop = heading ? heading.getBoundingClientRect().top : el.getBoundingClientRect().top;

          if (headingTop >= offset && headingTop <= window.innerHeight) {
            activeIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          for (let i = 0; i < tabs.length; i++) {
            if (!tabs[i].anchorTarget) continue;
            const el = document.getElementById(tabs[i].anchorTarget!);
            if (el && el.getBoundingClientRect().top <= offset + 10) {
              activeIndex = i;
            }
          }
        }
      }

      setActiveTab(activeIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  if (!tabs || tabs.length === 0) return null;

  const handleTabClick = (index: number, anchorTarget?: string) => {
    setActiveTab(index);

    if (anchorTarget) {
      isClickScrolling.current = true;
      const target = document.getElementById(anchorTarget);
      if (target) {
        const navbarHeight = window.innerWidth >= 1024 ? 112 : 80;
        const faqBarEl = document.getElementById('faq-bar');
        const faqBarHeight = faqBarEl ? faqBarEl.offsetHeight : 104;
        const targetAbsTop = target.getBoundingClientRect().top + window.scrollY;
        const scrollingDown = targetAbsTop > window.scrollY;
        const offset = scrollingDown ? faqBarHeight : navbarHeight + faqBarHeight;
        const top = targetAbsTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      setTimeout(() => { isClickScrolling.current = false; }, 800);
    }
  };

  return (
    <>
      {!isSearching && (
        <FaqBar
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      )}

      {isSearching && (
        <div className="bg-white px-8 lg:px-20  text-black text-lg">
          <div className="mx-auto max-w-9xl">
            {hasSearchResults ? (
              <p className="font-matter-regular text-lg pt-8">
                Results for &quot;{searchQuery.trim()}&rdquo;.
              </p>
            ) : (
              <>
                <p className="font-matter-regular pt-12 pb-8">No results found.</p>
                <p className="font-matter-regular">
                  We couldn&apos;t find anything for &quot;{searchQuery.trim()}&rdquo;.
                </p>
                <p className="font-matter-regular pb-12">
                  Try using broader or alternative keyword or check for any spelling errors.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FaqTab;
