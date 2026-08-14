"use client";

/**
 * ProductVariants Component
 * Displays available color variants as a horizontal scrollable gallery
 */

import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ACTIVE_VARIANT_IMAGE_CLASSES,
  FRAME_COLOR_CONTAINER_CLASSES,
  FRAME_COLOR_LABEL_CLASSES,
  PRODUCT_VARIANTS_CONTAINER_CLASSES,
  VARIANT_IMAGE_CLASSES,
  VARIANT_HOVER_DETAILS_CLASSES,
  VARIANT_HOVER_DETAIL_ITEM_CLASSES,
  VARIANT_HOVER_DETAIL_LABEL_CLASSES,
  VARIANT_HOVER_DETAIL_VALUE_CLASSES,
} from "./constants";

interface Variant {
  name: string;
  full_slug: string;
  content: {
    media: Array<{
      filename: string;
      alt: string;
    }>;
    local_settings?: {
      code: string; // JSON string containing attributes like AGE_GROUP, POLARIZED, FRONT_FRAME_COLOR, etc.
    };
  };
}

interface ProductImage {
  src: string;
  alt: string;
}

interface HoverDetails {
  frameColour: string;
  frameMaterial: string;
  frameType: string;
  lensesColour: string;
}

interface ProductVariantsProps {
  activeImage: ProductImage;
  variants: Variant[];
  label?: string;
  activeAttributes?: any;
  productType?: string; // "eyeglasses", "sunglasses", or campaign route (e.g., "made-for-every-moment")
  onHoverVariant?: (variant: Variant | null) => void;
}

/**
 * Extracts the side snapshot image from product media
 */
function getVariantSideImage(variant: Variant) {
  return variant?.content?.media?.find((media) => media?.alt === "Product Side Snapshot");
}

function determineLensColor(lensColorDescription: string): string {
  return lensColorDescription === "Not Defined" ? "Clear" : lensColorDescription.toLowerCase();
}

function buildHoverDetails(attrs: any): HoverDetails {
  return {
    frameColour: attrs?.FRONT_FRAME_COLOR ?? "",
    frameMaterial: attrs?.FRAME_MATERIAL ?? "",
    frameType: attrs?.LENS_TYPE ?? "",
    lensesColour: determineLensColor(attrs?.LENS_COLOR_DESCRIPTION),
  };
}

function HoverDetailsTooltip({ details }: { details: HoverDetails }) {
  const items = [details.frameColour, details.frameMaterial, details.frameType, details.lensesColour].filter(Boolean);
  return (
    <div className={VARIANT_HOVER_DETAILS_CLASSES}>
      <span className={VARIANT_HOVER_DETAIL_VALUE_CLASSES}>{items.join(" - ")}</span>
    </div>
  );
}

export function ProductVariants({ activeImage, variants, label = "Frame Color", activeAttributes, onHoverVariant }: ProductVariantsProps) {
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  if (!activeImage) return null;

  return (
    <div className={PRODUCT_VARIANTS_CONTAINER_CLASSES}>
      <p className={FRAME_COLOR_LABEL_CLASSES}>{label}</p>
      <div className={FRAME_COLOR_CONTAINER_CLASSES}>
        {/* Active Variant Image */}
        <div
          className={ACTIVE_VARIANT_IMAGE_CLASSES}
          onMouseEnter={() => activeAttributes && setHoveredName("__active__")}
          onMouseLeave={() => setHoveredName(null)}
        >
          <Image src={activeImage.src} alt={activeImage.alt} fill sizes="80px" className="object-contain" />
          {hoveredName === "__active__" && activeAttributes && (
            <HoverDetailsTooltip details={buildHoverDetails(activeAttributes)} />
          )}
        </div>

        {/* Variant Links */}
        {variants?.length >= 1 &&
          variants.map((variant) => {
            const variantImage = getVariantSideImage(variant);
            // Extract just the variant slug (e.g., "0db2143-001") from full_slug

            const variantSlug = variant?.full_slug.split("/").pop() ?? "";
            const variantAttributes = safeJsonParse(variant?.content?.local_settings?.code);
            const variantType = variantAttributes?.COLLECTION?.trim() || variantAttributes?.CAMPAIGN_FOOTER_SELECTION?.trim() || variantAttributes?.LENS_TYPE?.trim();
            const type = variantType ? variantType.toLowerCase().replace(/\s+/g, '-') : null;
            const variantUrl = `/products/${type}/${variantSlug}`;

            if (!variantImage) return null;

            return (
              <Link
                href={variantUrl}
                key={variant.name}
                className={VARIANT_IMAGE_CLASSES}
                onMouseEnter={() => {
                  onHoverVariant?.(variant);
                  if (variant.name) setHoveredName(variant.name);
                }}
                onMouseLeave={() => {
                  onHoverVariant?.(null);
                  setHoveredName(null);
                }}
              >
                <Image
                  src={variantImage.filename}
                  alt={variantImage.alt}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
                {hoveredName === variant.name && (
                  <HoverDetailsTooltip details={buildHoverDetails(variantAttributes)} />
                )}
              </Link>
            );
          })}
      </div>
    </div>
  );
}
