import React from "react";
import Link from "next/link";
import { StoryblokRichTextProps } from "@storyblok/react/rsc";
import CollectionsSubmenu from "./CollectionSubmenu";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { ArrowRight } from "lucide-react";

type ProductGroup = {
  header: string;
  children: { label: string; href: string }[];
};

type CollectionGroup = {
  header: string;
  href: string;
  children: { label: string; href: string }[];
  image?: string;
  description?: Pick<StoryblokRichTextProps, "doc">;
};

type MoreGroup = {
  header: string;
  href: string;
};

type SubmenuProps = {
  subLinks: (ProductGroup | CollectionGroup | MoreGroup)[];
  label: string;
  isOpen: boolean;
  productCounts?: Record<string, number>;
  skipAnimation?: boolean;
};

const FADE_BASE = 80;
const FADE_STEP = 35;

const Submenu = ({ subLinks, label, isOpen, productCounts, skipAnimation }: SubmenuProps) => {
  let itemIndex = 0;
  const animateContainer = !skipAnimation;
  const containerTransition = animateContainer
    ? "transition-[clip-path,opacity] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
    : "duration-0";
  const itemTransition = "transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]";
  const itemOpacity = !isOpen ? "opacity-0" : "opacity-100";
  
  return (
    <div
      className={`fixed inset-x-0 top-22 z-30 bg-dark-green shadow-lg ${containerTransition} ${isOpen ? "pointer-events-auto opacity-100 [clip-path:inset(0_0_0_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]"}`}
    >
      {label === "Products" && (
        <div className="flex flex-row gap-20 p-20 justify-center">
          {(subLinks as ProductGroup[]).map((g) => {
            const headerDelay = FADE_BASE + itemIndex++ * FADE_STEP;
            return (
              <div key={g.header} className="flex flex-row gap-12">
                <span
                  className={`font-matter-regular text-2xl text-white leading-none ${itemTransition} ${itemOpacity}`}
                  style={{ transitionDelay: isOpen ? `${headerDelay}ms` : "0ms" }}
                >
                  {g.header}
                </span>
                <ul className="flex flex-col gap-3">
                  {g.children.map((child) => {
                    const childDelay = FADE_BASE + itemIndex++ * FADE_STEP;
                    return (
                      <li
                        key={child.label}
                        className={`group ${itemTransition} ${itemOpacity}`}
                        style={{ transitionDelay: isOpen ? `${childDelay}ms` : "0ms" }}
                      >
                        <Link href={child.href}>
                          <div className="flex items-center gap-2">
                            <span className="font-matter-regular text-base text-white hover:underline">
                              {child.label}
                            </span>
                            {productCounts?.[child.label.toLowerCase()] != null && (
                              <sup className="font-matter-regular text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                {productCounts[child.label.toLowerCase()]}
                              </sup>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {label === "Collections" && (
        <CollectionsSubmenu subLinks={subLinks as CollectionGroup[]} isOpen={isOpen} />
      )}

      {label !== "Products" && label !== "Collections" && (
        <div className="flex flex-row gap-20 p-20">
          {subLinks.map((group) => {
            const m = group as MoreGroup;
            const delay = FADE_BASE + itemIndex++ * FADE_STEP;
            return (
              <Link
                key={m.header}
                href={m.href}
                className={`group flex flex-row items-center justify-center gap-1 ${itemTransition} ${itemOpacity}`}
                style={{ transitionDelay: isOpen ? `${delay}ms` : "0ms" }}
              >
                <span className="font-matter-regular text-2xl text-white group-hover:underline">{m.header}</span>
                <span className="opacity-0 group-hover:opacity-100">
                  {/* <HiOutlineArrowSmRight className="text-white w-6 h-6"/> */}
                  <ArrowRight className="ml-[2px] text-white w-5 h-5" strokeWidth={2.3}/>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Submenu;
