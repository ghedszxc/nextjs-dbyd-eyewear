import { IWidgetModel } from "@/adapter/model/IWidget";
import { WidgetParamAdapterFactory } from "@/factory/WidgetParamAdapterFactory";
import GenericHeaderBanner from "@/widgets/GenericHeaderBanner";
import dynamic from "next/dynamic";
import React from "react";

const Widgets = {
  CategoryBanner: dynamic(() => import("@/widgets/CategoryBanner")),
  ProductGrid: dynamic(() => import("@/widgets/ProductGrid")),
  FAQ: dynamic(() => import("@/widgets/FAQ")),
  FaqAccordion: dynamic(() => import("@/widgets/FaqAccordion")),
  FaqBanner: dynamic(() => import("@/widgets/FaqBanner")),
  FaqTab: dynamic(() => import("@/widgets/FaqTab")),
  HomeHeroBanner: dynamic(() => import("@/widgets/HomeHeroBanner")),
  HomeCenteredText: dynamic(() => import("@/widgets/HomeCenteredText")),
  HomeSocialBanner: dynamic(() => import("@/widgets/HomeSocialBanner")),
  HomeWTB: dynamic(() => import("@/widgets/HomeWTB")),
  AboutHeroBanner: dynamic(() => import("@/widgets/AboutHeroBanner")),
  AboutInfo: dynamic(() => import("@/widgets/AboutInfo")),
  StoreLocator: dynamic(() => import("@/widgets/StoreLocator")),
  HeroSection: dynamic(() => import("@/widgets/HeroSection")),
  ThreeColumnSection: dynamic(() => import("@/widgets/ThreeColumnSection")),
  CardSlider: dynamic(() => import("@/widgets/CardSlider")),
  CampaignBanner: dynamic(() => import("@/widgets/CampaignBanner")),
  CampaignCollection: dynamic(() => import("@/widgets/CampaignCollection")),
  FeaturedPair: dynamic(() => import("@/widgets/FeaturedPair")),
  BannerCareTips: dynamic(() => import("@/widgets/BannerCareTips")),
  TabCareTips: dynamic(() => import("@/widgets/TabCareTips")),
  SectionHeader: dynamic(() => import("@/widgets/SectionHeader")),
  ProductPillSlider: dynamic(() => import("@/widgets/ProductPillSlider")),
  CenteredBanner: dynamic(() => import("@/widgets/CenteredBanner")),
  ProductSuggestion: dynamic(() => import("@/widgets/ProductSuggestion")),
  TwoColumnImage: dynamic(() => import("@/widgets/TwoColumnImage")),
  TwoColumnTextAndMedia: dynamic(() => import("@/widgets/TwoColumnTextAndMedia")),
  GenericHeaderBanner: dynamic(() => import("@/widgets/GenericHeaderBanner")),
  StoreList: dynamic(() => import("@/widgets/StoreList")),
  TwoColumnText: dynamic(() => import("@/widgets/TwoColumnText")),
  // [COMMENTED OUT] - These widgets are not needed for now
  // TextWithoutMedia: dynamic(() => import("@/widgets/TextWithoutMedia")),
};

const WidgetGenerator: React.FC<IWidgetModel> = async ({ widgetName, widgetValue, lang }) => {
  const adapter = new WidgetParamAdapterFactory().instance(widgetName);
  const adaptedValues = adapter ? await adapter.adapt(widgetValue, lang) : null;
  const widgetKey = widgetName as keyof typeof Widgets;
  const DynamicWidget = Widgets[widgetKey];

  if (DynamicWidget) {
    (DynamicWidget as React.ComponentType<unknown>).displayName = widgetName;
    return <DynamicWidget {...adaptedValues} />;
  } else {
    return null;
  }
};

export default WidgetGenerator;
