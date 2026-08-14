export type ProductCatalog = {
  productNameSegment: string;         
  productCmsRoute: string[];           
  variantFilter?: {                   
    field: string;                     
    value: string | string[];          
  };
};

export const productCatalogs: ProductCatalog[] = [
  {
    productNameSegment: "products",
    productCmsRoute: ["products"],
    // no filter → returns everything (the "all products" PLP)
  },
  {
    productNameSegment: "eyeglasses",
    productCmsRoute: ["products/eyeglasses"],
    variantFilter: { field: "LENS_TYPE", value: "Eyeglasses" },
  },
  {
    productNameSegment: "sunglasses",
    productCmsRoute: ["products/sunglasses"],
    variantFilter: { field: "LENS_TYPE", value: "Sunglasses" },
  },
];

export type FilterConfig = {
  attribute: string | null;
  value: string | string[] | null;
  storyblokField: string | null;
  filterType: "model" | "variant" | null;
  additionalStoryblokField?: string;
  additionalValue?: string;
};

export const CATEGORY_FILTERS: Record<string, FilterConfig> = {
  // Gender/Style filters (MODEL-LEVEL: all variants inherit)
  male: {
    attribute: "GENDER",
    value: "Male",
    storyblokField: "GENDER",
    filterType: "model",
    additionalStoryblokField: "AGE_GROUP",
    additionalValue: "Adults",
  },
  female: {
    attribute: "GENDER",
    value: "Female",
    storyblokField: "GENDER",
    filterType: "model",
    additionalStoryblokField: "AGE_GROUP",
    additionalValue: "Adults",
  },
  unisex: { attribute: "GENDER", value: "Unisex", storyblokField: "GENDER", filterType: "model" },
  teens: { attribute: "AGE_GROUP", value: "Teens (11-13)", storyblokField: "AGE_GROUP", filterType: "model" },

  // Product status filters (VARIANT-LEVEL: filters related_products by STATUS_N1_26)
  new: { attribute: "STATUS_N1_26", value: "New", storyblokField: "STATUS_N1_26", filterType: "variant" },
  "best-seller": {
    attribute: "STATUS_N1_26",
    value: "Best Seller",
    storyblokField: "STATUS_N1_26",
    filterType: "variant",
  },

  // Special: View All (clears filter)
  prod: { attribute: null, value: null, storyblokField: null, filterType: null },
} as const;

/**
 * List of all filter values (used to identify filters in URL)
 */
export const FILTER_VALUES = Object.keys(CATEGORY_FILTERS) as Array<keyof typeof CATEGORY_FILTERS>;

/**
 * Check if a filter value is a known collection route
 */
export const isCollectionFilter = (filterValue: string): boolean => {
  return collectionCatalogs.some((c) => c.collectionRoute === filterValue);
};

/**
 * Get collection route from catalog
 */
export const getCollectionRoute = (filterValue: string): string | null => {
  const collection = collectionCatalogs.find((c) => c.collectionRoute === filterValue);
  return collection?.collectionRoute ?? null;
};

export const collectionCatalogs: {
  collectionNameSegment: string;
  collectionRoute: string;
  productCmsRoute?: string[];
}[] = [
  {
    collectionNameSegment: "Clean Lines",
    collectionRoute: "clean-lines",
    productCmsRoute: ["products/clean-lines"],
  },
  {
    collectionNameSegment: "Made for Every Moment",
    collectionRoute: "made-for-every-moment",
    productCmsRoute: ["products/made-for-every-moment"],
  },
  {
    collectionNameSegment: "Moments of Glow",
    collectionRoute: "moments-of-glow",
    productCmsRoute: ["products/moments-of-glow"],
  },
  {
    collectionNameSegment: "Characters in Bloom",
    collectionRoute: "characters-in-bloom",
    productCmsRoute: ["products/characters-in-bloom"],
  },
];
