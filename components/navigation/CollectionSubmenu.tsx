import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import RichText from "../RichText";
import type { StoryblokRichTextProps } from "@storyblok/react/rsc";
import CollectionBanners from "./CollectionBanners";

type CollectionChild = {
  label: string;
  href: string;
};

export type CollectionGroup = {
  header: string;
  href?: string;
  children?: CollectionChild[];
  image?: string;
  description?: Pick<StoryblokRichTextProps, "doc">;
};

export type CollectionRoot = {
  label: string;
  href?: string;
  children?: CollectionGroup[];
};

type CollectionSubmenuProps = {
  subLinks?: CollectionGroup[] | CollectionRoot;
  isOpen?: boolean;
};

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

const FADE_BASE = 80;
const FADE_STEP = 35;

const CollectionSubmenu = ({ subLinks, isOpen = true }: CollectionSubmenuProps) => {
  const itemTransition = "transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]";
  const itemOpacity = !isOpen ? "opacity-0" : "opacity-100";
  const groups: CollectionGroup[] = Array.isArray(subLinks) ? subLinks : (subLinks?.children ?? []);

  const linksGroup = groups.find(
    (group): group is CollectionGroup & { children: CollectionChild[] } =>
      Array.isArray(group.children) && group.children.length > 0
  );

  const banners = groups.filter(
    (group): group is CollectionGroup & { image: string } => typeof group.image === "string" && group.image.length > 0
  );

  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const activeBanner = activeLabel
    ? banners.find((banner) => normalize(banner.header) === normalize(activeLabel))
    : undefined;

  useEffect(() => {
    setImageLoaded(false);
  }, [activeBanner?.image]);

  if (!linksGroup) return null;

  const visible = banners.slice(0, 4);

  // Width class mapping for Tailwind - see constants for reference
  const widthClasses: Record<number, string> = {
    2: "w-1/2",
    3: "w-1/3",
    4: "w-1/4",
  };
  const widthClass = widthClasses[visible.length] || widthClasses[4];

  return (
    <>
      {linksGroup.children.length <= 4 && (
        <div className="flex flex-row gap-6 px-20 py-10">
          {banners.map((item, index) => {
            const c = item as CollectionGroup & { image: string };
            return (
              <div
                className={`flex items-center justify-center border-[0.5px] border-transparent hover:border-white ${itemTransition} ${widthClass} ${itemOpacity}`}
                style={{ transitionDelay: isOpen ? `${FADE_BASE + index * 50}ms` : "0ms" }}
                key={c.header}
              >
                <CollectionBanners
                  collectionBanner={c}
                  imageLoaded={imageLoaded}
                  setImageLoaded={setImageLoaded}
                  activeLabel={activeLabel}
                  sizes={{ 2: "50vw", 3: "33vw", 4: "25vw" }[visible.length] ?? "25vw"}
                />
              </div>
            );
          })}
        </div>
      )}
      {linksGroup.children.length > 4 && (
        <div className="flex h-[515px] flex-row gap-10 px-20 py-10">
          <div className="flex w-1/2 flex-row gap-12">
            <span
              className={`font-matter-regular text-2xl text-white ${itemTransition} ${itemOpacity}`}
              style={{ transitionDelay: isOpen ? `${FADE_BASE}ms` : "0ms" }}
            >
              {linksGroup.header}
            </span>

            <ul className="flex flex-col gap-4" onMouseLeave={() => setActiveLabel(null)}>
              {linksGroup.children.map((child, index) => (
                <li
                  key={child.label}
                  className={`cursor-pointer ${itemTransition} ${itemOpacity}`}
                  style={{ transitionDelay: isOpen ? `${FADE_BASE + (index + 1) * FADE_STEP}ms` : "0ms" }}
                >
                  <Link
                    href={child.href}
                    onMouseEnter={() => setActiveLabel(child.label)}
                    onFocus={() => setActiveLabel(child.label)}
                  >
                    <span
                      className={`font-matter-regular text-base text-white ${
                        activeLabel === child.label ? "underline" : "hover:underline"
                      }`}
                    >
                      {child.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`flex w-1/2 flex-col gap-8 transition-opacity duration-300 ${
              activeBanner ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {activeBanner && (
              <>
                <div
                  className={`relative h-[328px] transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={activeBanner.image}
                    alt={activeBanner.header || activeLabel || "Collection banner"}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-matter-regular text-lg text-white">{activeBanner.header}</h3>

                  {activeBanner.description?.doc && Array.isArray(activeBanner.description.doc.content) && (
                    <RichText
                      doc={{
                        type: activeBanner.description.doc.type,
                        content: activeBanner.description.doc.content,
                      }}
                      className={{
                        p: "font-matter-regular text-sm font-light text-white",
                      }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionSubmenu;
