import { AboutHeroBannerAdapter } from "@/adapter/AboutHeroBanner";
import { AboutInfoAdapter } from "@/adapter/AboutInfo";
import { CampaignBannerAdapter } from "@/adapter/CampaignBanner";
import { CampaignCollectionAdapter } from "@/adapter/CampaignCollection";
import { CardSliderAdapter } from "@/adapter/CardSlider";
import { BannerCareTips } from "@/adapter/BannerCareTips";
import { TabCareTipsAdapter } from "@/adapter/TabCareTips";
import { SectionHeaderAdapter } from "@/adapter/SectionHeader";
import { CenteredBannerAdapter } from "@/adapter/CenteredBanner";
import { ProductSuggestionAdapter } from "@/adapter/ProductSuggestion";
import { TwoColumnImageAdapter } from "@/adapter/TwoColumnImage";
import { TwoColumnTextAndMediaAdapter } from "@/adapter/TwoColumnTextAndMedia";
import { ProductPillSliderAdapter } from "@/adapter/ProductPillSlider";
import { TwoColumnTextAdapter } from "@/adapter/TwoColumnText";
// [COMMENTED OUT] - These adapters are not needed for now
// import { TextWithoutMediaAdapter } from "@/adapter/TextWithoutMedia";
import { CategoryBannerAdapter } from "@/adapter/CategoryBanner";
import { FAQAdapter } from "@/adapter/FAQ";
import { FaqAccordionAdapter } from "@/adapter/FaqAccordion";
import { FaqBannerAdapter } from "@/adapter/FaqBanner";
import { FaqTabAdapter } from "@/adapter/FaqTab";
import { HeroSectionAdapter } from "@/adapter/HeroSection";
import { HomeCenteredTextAdapter } from "@/adapter/HomeCenteredText";
import { HomeHeroBannerAdapter } from "@/adapter/HomeHeroBanner";
import { HomeSocialBannerAdapter } from "@/adapter/HomeSocialBanner";
import { HomeWTBAdapter } from "@/adapter/HomeWTB";
import { FeaturedPairAdapter } from "@/adapter/FeaturedPair";
import { IAdapter } from "@/adapter/model/Adapter";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { ProductGridAdapter } from "@/adapter/ProductGrid";
import { StoreLocatorAdapter } from "@/adapter/StoreLocator";
import { ThreeColumnSectionAdapter } from "@/adapter/ThreeColumnSection";
import { Factory } from "./Factory";
import { GenericHeaderBannerAdapter } from "@/adapter/GenericHeaderBanner";
import { StoreListAdapter } from "@/adapter/StoreList";


// Adapters
export class WidgetParamAdapterFactory extends Factory<string, Nullable<IAdapter>> {
  instance: (comparator: string) => Nullable<IAdapter> = (comparator) => {
    switch (comparator) {
      case "CategoryBanner":
        return new CategoryBannerAdapter();
      case "ProductGrid":
        return new ProductGridAdapter();
      case "FAQ":
        return new FAQAdapter();
      case "FaqAccordion":
        return new FaqAccordionAdapter();
      case "FaqBanner":
        return new FaqBannerAdapter();
      case "FaqTab":
        return new FaqTabAdapter();
      case "HomeHeroBanner":
        return new HomeHeroBannerAdapter();
      case "HomeCenteredText":
        return new HomeCenteredTextAdapter();
      case "HomeSocialBanner":
        return new HomeSocialBannerAdapter();
      case "HomeWTB":
        return new HomeWTBAdapter();
      case "AboutHeroBanner":
        return new AboutHeroBannerAdapter();
      case "AboutInfo":
        return new AboutInfoAdapter();
      case "StoreLocator":
        return new StoreLocatorAdapter();
      case "HeroSection":
        return new HeroSectionAdapter();
      case "ThreeColumnSection":
        return new ThreeColumnSectionAdapter();
      case "CardSlider":
        return new CardSliderAdapter();
      case "CampaignBanner":
        return new CampaignBannerAdapter();
      case "CampaignCollection":
        return new CampaignCollectionAdapter();
      case "FeaturedPair":
        return new FeaturedPairAdapter();
      case "BannerCareTips":
        return new BannerCareTips();
      case "TabCareTips":
        return new TabCareTipsAdapter();
      case "SectionHeader":
        return new SectionHeaderAdapter();
      case "ProductPillSlider":
        return new ProductPillSliderAdapter();
      case "CenteredBanner":
        return new CenteredBannerAdapter();
      case "ProductSuggestion":
        return new ProductSuggestionAdapter();
      case "TwoColumnImage":
        return new TwoColumnImageAdapter();
      case "TwoColumnTextAndMedia":
        return new TwoColumnTextAndMediaAdapter();
      case "GenericHeaderBanner":
        return new GenericHeaderBannerAdapter();
      case "StoreList":
        return new StoreListAdapter();
      case "TwoColumnText":
        return new TwoColumnTextAdapter();
      // [COMMENTED OUT] - These cases are not needed for now
      // case "TextWithoutMedia":
      //   return new TextWithoutMediaAdapter();
      default:
        return null;
    }
  };
}
