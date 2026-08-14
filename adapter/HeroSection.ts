import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IHeroSection } from "@/models/widgets/IHeroSection";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

export class HeroSectionAdapter extends Adapter<IHeroSection, Promise<Nullable<IHeroSection>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IHeroSection>> => {
    const data = source?.contents?.[0];
    const local_settings = safeJsonParse(data?.content?.local_settings?.code);

    const links = await Promise.all(
      data?.content?.teaser_targets?.map(async (teaser: any) => {
        const { data } = await api.cms.stories({
          by_uuids_ordered: teaser?.target?.[0],
          language: lang,
        });
        const target = data?.find((d: any) => d.uuid === teaser?.target?.[0]);
        return {
          url: target?.full_slug?.replace(getStoryblokRoot() + `/${lang}`, "") + (teaser?.target_anchor || ""),
          text: teaser?.target_text,
          type: "internal",
        };
      }) ?? []
    );

    const title1 = data?.content?.teaser_title1 || "";
    const title3 = data?.content?.teaser_title3 || "";
    const title4 = data?.content?.teaser_title4 || "";
    const body = {
      doc: data?.content?.teaser_longText1 || {},
    };
    const visual = {
      desktop: {
        url: data?.content?.media?.[0]?.filename || "",
        alt: data?.content?.media?.[0]?.alt || "",
        type: "image" as "image" | "video",
      },
      mobile: {
        url: data?.content?.media?.[1]?.filename || "",
        alt: data?.content?.media?.[1]?.alt || "",
        type: "image" as "image" | "video",
      },
    };
    const isVideo = local_settings?.isVideo;
    const bodyMaxWidth = local_settings?.bodyMaxWidth;

    return {
      titleDesktop: title1,
      titleMobile1: title3,
      titleMobile2: title4,
      body,
      visual,
      links,
      isVideo,
      bodyMaxWidth,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
