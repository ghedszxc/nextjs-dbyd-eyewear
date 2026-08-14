"use client";

import { Button } from "@/components/ui/button";
import BackButton from "./BackButton";
import { ProductGallery } from "./ProductGallery";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";
import { type CarouselApi } from "@/components/ui/carousel";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";
import {
  CTA_BUTTON_CLASSES,
  FLEX_FULL_BETWEEN_CLASSES,
  FLEX_GAP_CLASSES,
  GALLERY_BACK_BUTTON,
  GALLERY_SECTION_CLASSES,
  HEADER_CONTAINER_CLASSES,
  INFO_SECTION_CLASSES,
  MAIN_GRID_CLASSES,
  PRODUCT_BADGES,
  PRODUCT_CODE,
  PRODUCT_CODE_BADGES,
  PRODUCT_TITLE,
  PRODUCT_TITLE_CLASSES,
} from "./constants";
import { ProductVariants } from "./ProductVariants";
import { ProductTabs } from "./ProductTabs";
import Link from "next/link";
import { useCTARef } from "@/hooks/useCTARef";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { extractVariantDisplayData } from "./useProductData";

const HOVER_SWITCH_DELAY = 300;

export default function ProductDetail({ productData }: { productData: any }) {
  const {
    productCode,
    productTitle,
    productDescription,
    productImages,
    productInfo,
    productDetails,
    productCare,
    productVariants,
    productFrameColor,
    productAttributes,
    productType,
  } = productData;
  const ctaRef = useCTARef();
  const { current: currentViewport } = useBreakpoint(breakpoints);
  const productDetailRef = useRef<HTMLDivElement>(null!);
  const galleryRef = useRef<HTMLElement>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [isCarouselScrollEnabled, setIsCarouselScrollEnabled] = useState(false);
  const productDetailTopRef = useRef<number>(0);

  // Calculate productDetail's top position once on mount
  useEffect(() => {
    if (!productDetailRef.current) return;

    const updateProductDetailTop = () => {
      productDetailTopRef.current = productDetailRef.current?.offsetTop ?? 0;
    };

    updateProductDetailTop();
    window.addEventListener("resize", updateProductDetailTop);

    return () => {
      window.removeEventListener("resize", updateProductDetailTop);
    };
  }, []);

  // Monitor scroll position to enable/disable carousel scroll
  useEffect(() => {
    const handleScroll = () => {
      // Recalculate productDetail position dynamically (updates when BreadcrumbsSection visibility changes)
      productDetailTopRef.current = productDetailRef.current?.offsetTop ?? 0;
      
      // Enable carousel scroll once user scrolls to the productDetail section
      const shouldEnable = window.scrollY > productDetailTopRef.current;
      setIsCarouselScrollEnabled(shouldEnable);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useCarouselScroll(productDetailRef, carouselApi, {
    wheelSensitivity: 50,
    enabled: isCarouselScrollEnabled && currentViewport === "desktop",
  });

  // Variant hover animation logic
  const [hoveredVariant, setHoveredVariant] = useState<any | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHoverVariant = useCallback((variant: any | null) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHoveredVariant(variant), HOVER_SWITCH_DELAY);
  }, []);

  useEffect(
    () => () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    },
    []
  );

  const display = useMemo(() => {
    if (hoveredVariant) return extractVariantDisplayData(hoveredVariant);
    return { productTitle, productInfo, productImages, productFrameColor };
  }, [hoveredVariant, productTitle, productInfo, productImages, productFrameColor]);

  const previewImage = useMemo(() => {
    if (!hoveredVariant) return undefined;
    return [...display.productImages].reverse()[0];
  }, [hoveredVariant, display.productImages]);

  return (
    <main>
      <div ref={productDetailRef} className={MAIN_GRID_CLASSES}>
        {/* Gallery Section */}
        <section ref={galleryRef} className={GALLERY_SECTION_CLASSES}>
          <div className={GALLERY_BACK_BUTTON}>
            <BackButton />
          </div>
          <ProductGallery productInfo={display.productInfo} images={productImages} previewImage={previewImage} onCarouselApiReady={setCarouselApi} />
        </section>

        {/* RIGHT — INFO */}
        <section className={INFO_SECTION_CLASSES}>
          <div className={FLEX_GAP_CLASSES}>
            <div className={PRODUCT_TITLE_CLASSES}>
              <div className={PRODUCT_CODE_BADGES}>
                <span className={PRODUCT_CODE}>{display.productInfo.productCode}</span>
                <div className={PRODUCT_BADGES}>
                  {display.productInfo.productLabels?.map((l: string, i: number) => (
                    <span key={i}>{l}</span>
                  ))}
                </div>
              </div>
              <p className={PRODUCT_TITLE}>{display.productTitle}</p>
            </div>

            {/* Product Variants */}
            <ProductVariants
              activeImage={productImages?.[1]}
              variants={productVariants}
              label={display.productFrameColor}
              activeAttributes={productAttributes}
              onHoverVariant={handleHoverVariant}
            />
          </div>

          <div className={FLEX_FULL_BETWEEN_CLASSES}>
            {/* Tabs */}
            <ProductTabs description={productDescription} details={productDetails} care={productCare} />

            {/* CTA */}
            <div ref={ctaRef} className="-mr-[17px] lg:mr-0">
              <Button variant={null} className={CTA_BUTTON_CLASSES}>
                <Link href={`/storelist`}>Find nearest store</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
