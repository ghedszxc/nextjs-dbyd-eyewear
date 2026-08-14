"use client";

import NavLinks from "@/components/navigation/NavLinks";
import SidebarMenu from "@/components/SidebarMenu";
import { Button } from "@/components/ui/button";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useScroll } from "@/hooks/useScroll";
import { useNavStore } from "@/lib/store/nav";
import { INavigation } from "@/models/widgets/INavigation";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Navigation = ({ NavData, lang }: INavigation) => {
  const headerRef = useRef<HTMLElement>(null);
  const { current } = useBreakpoint(breakpoints);
  const { scrollY, scrollDirection } = useScroll();

  // The nav owns the hide-on-scroll state and publishes it. PLP's sticky
  // FiltersBar and FaqBar read `hidden` so they can stay flush with the nav as
  // it slides in and out.
  const setHidden = useNavStore((s) => s.setHidden);

  const TRANSPARENT_NAV_ROUTES = ["/"];
  const HIDE_ON_SCROLL_ROUTES = ["/", "/products", "/faqs", "/about", "/caretips", "/collections", "/storelist"];
  const DARK_BACKGROUND_ROUTES = ["/storelist"];

  // Submenu
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const prevOpenMenu = useRef<string | null>(null);
  const skipAnimation = prevOpenMenu.current !== null && openMenu !== null;
  useEffect(() => {
    prevOpenMenu.current = openMenu;
  }, [openMenu]);

  // Sidebar Menu (Mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const path = decodeURI(usePathname() ?? "/");
  // Remove language prefix for route matching (e.g., "/en/caretips" → "/caretips")
  const pathWithoutLang = path.replace(new RegExp(`^/${lang}/`), "/") || "/";

  const isTransparent = TRANSPARENT_NAV_ROUTES.some((route) => path === route || pathWithoutLang === route);
  const isDarkBackground = DARK_BACKGROUND_ROUTES.some((route) => path === route || pathWithoutLang === route);
  const shouldHideOnScroll = HIDE_ON_SCROLL_ROUTES.some(
    (route) => pathWithoutLang === route || pathWithoutLang.startsWith(route + "/")
  );

  const isMobile = current === "mobile" || current === "tablet";
  const navHeight = isMobile ? 80 : 88; // h-20 / lg:h-22

  const isSticky = scrollY > (headerRef.current?.clientHeight ?? navHeight);

  // Hide the nav only while scrolling down past it, on eligible routes, and never
  // while a submenu is open. Derived from scroll state — no imperative DOM writes.
  const hidden = shouldHideOnScroll && !openMenu && scrollDirection === "down" && scrollY > navHeight;

  const showTransparentNav = isTransparent && !isSticky;
  const showLightContentNav = isDarkBackground || showTransparentNav || openMenu;

  // Publish hide-on-scroll state for the sticky FiltersBar / FaqBar to follow.
  useEffect(() => {
    setHidden(hidden);
  }, [hidden, setHidden]);

  // Fetch product counts for submenu
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const categories = ["eyeglasses", "sunglasses"];
    Promise.all(
      categories.map((cat) =>
        fetch(`/api/fetchProducts?lang=${lang ?? "en"}&category=products,${cat}`)
          .then((res) => res.json())
          .then((json) => ({ category: cat, count: json?.count ?? 0 }))
          .catch(() => ({ category: cat, count: 0 }))
      )
    ).then((results) => {
      const counts: Record<string, number> = {};
      results.forEach((r) => (counts[r.category] = r.count));
      setProductCounts(counts);
    });
  }, [lang]);

  useEffect(() => {
    if (!isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div>
      {openMenu && <div className="fixed inset-0 z-10 bg-[#3A3A2C33]" onMouseEnter={() => setOpenMenu(null)}></div>}
      {isSidebarOpen && <div className="fixed inset-0 z-10 bg-[#3A3A2C33] lg:hidden"></div>}

      <header
        className={clsx(
          "fixed inset-0 z-20 flex h-20 items-center justify-between p-6 transition-[transform,background-color] duration-300 ease-in-out lg:h-22 lg:p-8",
          "w-[calc(100%-var(--removed-body-scroll-bar-size,0px))]",
          showTransparentNav ? "bg-transparent" : isDarkBackground ? "bg-dark-green" : "bg-white",
          openMenu && "bg-dark-green! border-b-hairline"
        )}
        style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
        ref={headerRef}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="relative">
          <Link href="/">
            <Image
              src="/icons/dbyd-logo.svg"
              alt="DbyD Logo"
              width={current === "mobile" || current === "tablet" ? 80 : 120}
              height={current === "mobile" || current === "tablet" ? 29 : 44}
              unoptimized
              className={showLightContentNav ? "" : "invert"}
            />
          </Link>
        </div>

        <div className="hidden lg:block">
          <NavLinks
            navLinks={NavData ?? []}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            className={showLightContentNav ? "text-white hover:text-white" : "text-black hover:text-black"}
            productCounts={productCounts}
            currentPath={pathWithoutLang}
            lang={lang}
            skipAnimation={skipAnimation}
          />
        </div>

        <div className="flex items-center justify-start gap-6 text-[18px]">
          <Link
            href={"/storelist"}
            className={clsx(
              "text-md font-matter-regular mt-1 hidden cursor-pointer p-0 hover:bg-transparent lg:mt-0 lg:block",
              pathWithoutLang.startsWith("/storelist") ? "underline" : "hover:underline",
              showLightContentNav ? "text-white hover:text-white" : "text-black hover:text-black"
            )}
          >
            Stores
          </Link>
          <Link href="/storelist" className="p-0 lg:hidden">
            <Image
              src="/icons/store-list.svg"
              alt="Store List"
              width={32}
              height={32}
              unoptimized
              className={showLightContentNav ? "invert" : ""}
            />
          </Link>
          <Button onClick={openSidebar} variant="ghost" className="p-0 lg:hidden">
            <Image
              src="/icons/menu-burger.svg"
              alt="Hamburger Menu"
              width={32}
              height={32}
              unoptimized               
              className={showLightContentNav ? "invert" : ""}
            />
          </Button>
        </div>
      </header>

      {isSidebarOpen && <SidebarMenu navLinks={NavData ?? []} closeSidebar={closeSidebar} />}
    </div>
  );
};
export default Navigation;
