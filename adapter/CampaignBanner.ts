import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { ICampaignBanner } from "@/models/widgets/ICampaignBanner";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class CampaignBannerAdapter extends Adapter<ICampaignBanner, Promise<Nullable<ICampaignBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICampaignBanner>> => {
    const data = source?.contents?.[0];

    const by_uuids = data?.content?.teaser_targets?.[0]?.target?.join(",");
    const { data: target } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const title = data?.content?.teaser_title1 || "";
    const name = data?.content?.teaser_title2 || "";
    const body = {
      doc: data?.content?.teaser_longText1 || {},
    };
    const image = {
      desktop: {
        url: data?.content?.media?.[0]?.filename || "",
        alt: data?.content?.media?.[0]?.alt || "",
      },
      mobile: {
        url: data?.content?.media?.[1]?.filename || "",
        alt: data?.content?.media?.[1]?.alt || "",
      },
    };
    const slugWithoutRoot = target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") || "";
    const targetAnchor = data?.content?.teaser_targets?.[0]?.target_anchor || "";

  
    const cta = {
      href: targetAnchor.startsWith("/")
        ? targetAnchor
        : slugWithoutRoot + targetAnchor,
      text: data?.content?.teaser_targets?.[0]?.target_text || "",
    };

    let local_settings: any = {};
    try {
      local_settings = JSON.parse(data?.content?.local_settings?.code ?? "{}");
    } catch {}
    const position = local_settings?.image_position;
    const bgColor = local_settings?.background_color;
    const imageMaxWidth = local_settings?.image_max_width;
    const mobileImage = local_settings?.mobile_image;
    return {
      image,
      body,
      title,
      name,
      cta,
      position,
      bgColor,
      imageMaxWidth,
      mobileImage,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
