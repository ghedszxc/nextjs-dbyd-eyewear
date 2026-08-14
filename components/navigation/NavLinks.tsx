import Link from "next/link";
import React from "react";
import Submenu from "./Submenu";

const NavLinks = ({
  navLinks,
  openMenu,
  setOpenMenu,
  className,
  productCounts,
  currentPath,
  lang,
  skipAnimation,
}: {
  navLinks: any[];
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
  className?: string;
  productCounts?: Record<string, number>;
  currentPath?: string;
  lang?: string;
  skipAnimation?: boolean;
}) => {
  const isRouteActive = (link: any): boolean => {
    if (!currentPath || currentPath === "/") return false;

    // Normalize href: strip lang prefix and trailing slashes to match currentPath format
    const normalize = (href: string): string => {
      let h = href.replace(/\/+$/, "");
      if (lang) h = h.replace(new RegExp(`^/${lang}(/|$)`), "/");
      return h;
    };

    const matches = (href?: string): boolean => {
      if (!href || href === "/") return false;
      const normalized = normalize(href);
      return normalized !== "/" && currentPath.startsWith(normalized);
    };

    if (matches(link.href)) return true;

    if (link.children) {
      return link.children.some((group: any) => {
        if (matches(group.href)) return true;
        if (matches(group.cta?.href)) return true;
        if (group.children) {
          return group.children.some((child: any) => matches(child.href));
        }
        return false;
      });
    }
    return false;
  };

  return (
    <ul className="flex items-center justify-between gap-8">
      {navLinks.map((link: any) => {
        const isHoverActive = openMenu === link.label;
        const isActive = isHoverActive || isRouteActive(link);
        return (
          <li
            key={link.label}
            onMouseEnter={() => setOpenMenu(link.children ? link.label : null)}
            className={className}
          >
            <div className="group flex items-center gap-2 pointer-events-none">
              <h6
                className={`font-matter-regular text-[18px] ${isActive ? "underline" : "group-hover:underline"}`}
              >
                {link.label}
              </h6>
            </div>

            {link.children && <Submenu subLinks={link.children} label={link.label} isOpen={isHoverActive} productCounts={productCounts} skipAnimation={skipAnimation} />}
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
