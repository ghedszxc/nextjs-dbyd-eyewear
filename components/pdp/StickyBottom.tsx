"use client";

import { useProductData } from "./useProductData";
import { Button } from "../ui/button";
import Link from "next/link";
import { useScroll } from "@/hooks/useScroll";
import { useFooterVisibility } from "@/lib/FooterContext";
import { useCTAVisibility } from "@/lib/CTAVisibilityContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";

const StickyBottom = ({ pdpData, productId }: { pdpData: any[]; productId: string }) => {
  // Extract product data using the hook
  const { productCode, productAttributes } = useProductData(pdpData, productId);
  const productColor = productAttributes?.FRONT_FRAME_COLOR;

  const { scrollY } = useScroll();
  const { current } = useBreakpoint(breakpoints);
  const { isFooterVisible } = useFooterVisibility();
  const { isCTAVisible } = useCTAVisibility();
  const isMobile = current === "mobile" || current === "tablet";
  
  const isSticky = isMobile ? (!isFooterVisible && !isCTAVisible) : (scrollY > 820 && !isFooterVisible);

  return (
    <div
      className={`bg-dark-green fixed bottom-0 flex w-full flex-row items-center justify-between px-6 py-4 text-white transition ease-in-out lg:px-8 lg:py-6 ${isSticky ? "translate-y-0 duration-500" : "translate-y-full duration-200"}`}
    >
      <div className="hidden lg:flex lg:flex-row lg:gap-12">
        <span className="font-matter-bold text-lg uppercase">{productCode}</span>
        <p className="font-matter-regular self-center text-base">{productColor}</p>
      </div>
      <Button
        asChild
        className="flex h-[43px] w-full items-center rounded-none border border-white bg-transparent px-4 py-2 hover:bg-[#F7F2EA66] lg:w-fit"
      >
        <Link href={`/storelist`}>
          <span className="font-matter-regular text-lg text-white">Find nearest store</span>
        </Link>
      </Button>
    </div>
  );
};

export default StickyBottom;
