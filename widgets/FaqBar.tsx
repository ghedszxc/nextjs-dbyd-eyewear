'use client';

import React, { useRef, useEffect, useState } from 'react';
import { IFaqTabItem } from '@/models/widgets/IFaqTab';
import { useNavStore } from '@/lib/store/nav';

interface FaqBarProps {
  tabs: IFaqTabItem[];
  activeTab: number;
  onTabClick: (index: number, anchorTarget?: string) => void;
}

const FaqBar = ({ tabs, activeTab, onTabClick }: FaqBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isStuck, setIsStuck] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const isNavbarHidden = useNavStore((s) => s.hidden);
  const [navbarHeight, setNavbarHeight] = useState(88);

  useEffect(() => {
    const updateHeight = () => {
      setNavbarHeight(window.innerWidth >= 1024 ? 88 : 80);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (!placeholderRef.current || !barRef.current) return;

    setBarHeight(barRef.current.offsetHeight);

    const handleScroll = () => {
      if (!placeholderRef.current) return;
      const rect = placeholderRef.current.getBoundingClientRect();
      setIsStuck(rect.top <= navbarHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navbarHeight]);

  useEffect(() => {
    const activeButton = tabRefs.current[activeTab];
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  if (!tabs || tabs.length === 0) return null;

  const stickyTop = isNavbarHidden ? 0 : navbarHeight;

  return (
    <>
      <div
        ref={placeholderRef}
        className="bg-[#3A3A2C]"
        style={{ height: isStuck ? barHeight : 0 }}
      />
      <div
        ref={barRef}
        id="faq-bar"
        className={`py-10 lg:py-8 transition-[top,background-color] duration-300 ease-in-out overflow-x-auto scrollbar-hide ${
          isStuck ? 'bg-[#3A3A2CBF] fixed left-0 right-0 z-[19]' : 'bg-[#3A3A2C] relative z-auto'
        }`}
        style={isStuck ? { top: stickyTop } : undefined}
      >
        <div className="mx-auto max-w-9xl pl-[24px] lg:px-[80px]">
          <div className="flex flex-nowrap justify-start 2xl:justify-center gap-6">
            {tabs.map((tab, index) => (
              <button
                key={index}
                ref={(el) => { tabRefs.current[index] = el; }}
                onClick={() => onTabClick(index, tab.anchorTarget)}
                className={`shrink-0 rounded-full border px-8 py-2 text-base font-matter-regular transition-colors duration-200 ${
                  activeTab === index
                    ? 'border-white bg-white text-[#3A3A2C]'
                    : 'border-[0.5px] border-white/40 bg-transparent text-white hover:bg-[#ffffff]/25'
                }`}
              >
                {tab.tabName}
              </button>
            ))}
            <div
              className="shrink-0 lg:hidden"
              style={{ minWidth: 'calc(50vw - 80px)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqBar;
