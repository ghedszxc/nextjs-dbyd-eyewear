/**
 * Custom hook for extracting and processing product data
 * Separates data transformation logic from component rendering
 */

import { safeJsonParse } from "@/lib/utils";
import { ProductAttributes } from "@/types/pdp";

interface ProductImage {
  src: string;
  alt: string;
}

export interface DetailItem {
  label: string;
  value: string;
  tooltip?: string;
}

export interface ExtractedProductData {
  product: any;
  productCode: string;
  productTitle: string;
  productDescription: any;
  productAttributes: ProductAttributes;
  productImages: ProductImage[];
  productInfo: {
    productCode: string;
    productLabels: string[];
  };
  productDetails: DetailItem[];
  productFrameColor: string;
  productCare: string[];
  productVariants: any[];
}

/**
 * Normalizes product age group by removing parenthetical information
 */
function getNormalizedAgeGroup(group: string): string | null {
  const trimmed = group.trim();
  const kidsGroup = ["Kids", "Juniors", "Baby"];
  if (kidsGroup.includes(trimmed)) return "Kids";
  // Remove "Adults" and trim; return null if empty or was just "Adults"
  const afterRemoval = trimmed.replace(/\s*Adults\s*/g, "").trim();
  return afterRemoval || null;
}
/**
 * Determines lens color, defaulting to "Clear" if not defined
 */
function determineLensColor(lensColorDescription: string): string {
  return lensColorDescription === "Not Defined" ? "Clear" : lensColorDescription.toLowerCase();
}

/**
 * Determines lens material based on lens type
 */
function determineLensMaterial(lensType: string): string {
  return lensType === "Eyeglasses" ? "Standard" : lensType;
}

/**
 * Creates product badge array with priority filtering
 */
function createBadges(productAttributes: ProductAttributes, productAgeGroup: string | null): string[] {
  const normalizedStatus =
    productAttributes.STATUS_N1_26 === "Best Seller" ? "Bestseller" : productAttributes.STATUS_N1_26;
  return [
    normalizedStatus, // Priority 1
    productAgeGroup ? productAgeGroup : productAttributes.POLARIZED === "Polarized" ? "Polarized" : null, // If there's no age group, use polarized
  ].filter(Boolean) as string[];
}

/**
 * Transforms product attributes into displayable details
 */
function createProductDetails(
  productAttributes: ProductAttributes,
  productFrameColor: string,
  productLensColor: string,
  productFrameMaterial: [string, string],
  productLensMaterial: [string, string],
  productModelCode: string
): DetailItem[] {
  return [
    { label: "Frame Colour", value: productFrameColor },
    { label: "Lenses Colour", value: productLensColor },
    { label: "Frame Material", value: productFrameMaterial[0], tooltip: productFrameMaterial[1] },
    { label: "Lenses Material", value: productLensMaterial[0], tooltip: productLensMaterial[1] },
    { label: "Model Code", value: productModelCode },
  ];
}

export interface VariantDisplayData {
  productTitle: string;
  productInfo: {
    productCode: string;
    productLabels: string[];
  };
  productImages: ProductImage[];
  productFrameColor: string;
}

export function extractVariantDisplayData(variant: any): VariantDisplayData {
  const productAttributes = safeJsonParse(variant?.content?.local_settings?.code) as ProductAttributes;

  const productTitle = productAttributes?.TITLE ?? "";
  const productCode = `${productAttributes?.MODEL_CODE} ${productAttributes?.COLOR_CODE}`;
  const productFrameColor = productAttributes?.FRONT_FRAME_COLOR;

  const productImages =
    variant?.content?.media?.map((media: any) => ({
      src: media?.filename,
      alt: media?.alt,
    })) ?? [];

  const rawAgeGroup = String(productAttributes?.AGE_GROUP ?? "");
  const normalizedAgeGroup = rawAgeGroup.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const productAgeGroup = getNormalizedAgeGroup(normalizedAgeGroup);
  const badges = createBadges(productAttributes, productAgeGroup);

  return {
    productTitle,
    productInfo: {
      productCode,
      productLabels: badges,
    },
    productImages,
    productFrameColor,
  };
}

/**
 * Extracts and processes product data from raw data array
 */
export function useProductData(pdpData: any[], productId: string): ExtractedProductData {
  // Find product by normalized name
  const product = pdpData?.find((product) => product?.name === productId?.replace("-", " ").toLocaleUpperCase());

  const productDescription = product?.content?.product_long_description ?? "";
  const productAttributes = safeJsonParse(product?.content?.local_settings?.code) as ProductAttributes;

  const productCode = `${productAttributes?.MODEL_CODE} ${productAttributes?.COLOR_CODE}`;
  const productModelCode = productAttributes?.MODEL_CODE;
  const productTitle = productAttributes?.TITLE;

  const productFrameColor = productAttributes?.FRONT_FRAME_COLOR;
  const productLensColor = determineLensColor(productAttributes?.LENS_COLOR_DESCRIPTION);

  // Material info for tooltips
  const productFrameMaterialInfo =
    productAttributes?.FRAME_MATERIAL === "Bio-acetate"
      ? "Made with at least 61% bio-carbon content representing the amount of carbon coming from plant vs. fossil-based sources."
      : productAttributes?.FRAME_MATERIAL === "Recycled metal"
        ? "Made with 60% recycled content."
        : "";
  const productLensMaterialInfo =
    "Frames are made with bio-based acetate containing at least 61% bio-carbon content, representing the amount of carbon derived from plant-based versus fossil-based sources.";

  const productFrameMaterial: [string, string] = [productAttributes?.FRAME_MATERIAL, productFrameMaterialInfo];
  const productLensMaterial: [string, string] = [
    determineLensMaterial(productAttributes?.LENS_TYPE),
    productLensMaterialInfo,
  ];

  const productImages = product?.content?.media?.map((media: any) => ({
    src: media?.filename,
    alt: media?.alt,
  }));

  const rawAgeGroup = String(productAttributes?.AGE_GROUP ?? "");
  const normalizedAgeGroup = rawAgeGroup.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const productAgeGroup = getNormalizedAgeGroup(normalizedAgeGroup);

  const badges = createBadges(productAttributes, productAgeGroup);

  const productInfo = {
    productCode,
    productLabels: badges,
  };

  const productDetails = createProductDetails(
    productAttributes,
    productFrameColor,
    productLensColor,
    productFrameMaterial,
    productLensMaterial,
    productModelCode
  );

  const productCare = [
    "Use a clean microfibre cloth to gently wipe your lenses, avoid using harsh chemicals or acids to clean them.",
    "Use both hands when putting your glasses.",
    "Place glasses in a hard protective case when you're not using them.",
    "Protect them from sun and heat.",
  ];
  const productVariants = pdpData?.filter(
    (product) => product.name !== productId?.replace("-", " ").toLocaleUpperCase()
  );

  return {
    product,
    productCode,
    productTitle,
    productDescription,
    productAttributes,
    productImages,
    productInfo,
    productDetails,
    productFrameColor,
    productCare,
    productVariants,
  };
}
