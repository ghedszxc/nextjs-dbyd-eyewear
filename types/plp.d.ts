export type VariantGroup = ProductCardProduct[]; // one ProductCard consumes one "group" (variants)
export type TransformedProducts = VariantGroup[];

export type ProductBlock = {
  type: "product";
  index: number; // points to transformedProducts[index]
  colSpan: number;
  heightClass?: string;
};

export type CampaignBlock = {
  type: "campaign";
  colSpan: number;
  heightClass?: string;
  layout?: "tile" | "wide";
  campaignIndex: number; // points to campaigns[campaignIndex]
};

export type SplitCampaignBlock = {
  type: "splitCampaign";
  colSpan: number;
  heightClass?: string;
  campaignIndex: number; // points to campaigns[campaignIndex]
};

export type DesktopBlock = ProductBlock | CampaignBlock | SplitCampaignBlock;
export type MobileBlock = DesktopBlock;
export type FetchStatus = "idle" | "loading" | "ready" | "error";
