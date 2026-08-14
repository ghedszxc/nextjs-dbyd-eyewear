import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { ICenteredBanner } from "@/models/widgets/ICenteredBanner";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class CenteredBannerAdapter extends Adapter<ICenteredBanner, Promise<Nullable<ICenteredBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICenteredBanner>> => {
    const data = source?.contents?.[0];

    const by_uuids = data?.content?.teaser_targets?.[0]?.target?.join(",");
    const { data: target } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const title = data?.content?.teaser_title1 || "";
    const name = data?.content?.teaser_title2 || "";
    const rawBody = data?.content?.teaser_longText1;
    const body = rawBody?.type ? { doc: rawBody } : undefined;

    let local_settings: any = {};
    try {
      local_settings = JSON.parse(data?.content?.local_settings?.code ?? "{}");
    } catch {}

    const isVideo = local_settings?.isVideo ?? false;
    const mediaType = isVideo ? "video" : "image";
    const image = {
      desktop: {
        url: data?.content?.media?.[0]?.filename || "",
        alt: data?.content?.media?.[0]?.alt || "",
        type: mediaType as "image" | "video",
      },
      mobile: {
        url: data?.content?.media?.[1]?.filename || "",
        alt: data?.content?.media?.[1]?.alt || "",
        type: mediaType as "image" | "video",
      },
    };
    const cta = {
      href: target?.[0]?.full_slug?.replace(getStoryblokRoot(), "") || "",
      text: data?.content?.teaser_targets?.[0]?.target_text || "",
    };

    const noTeaserText = local_settings?.noTeaserText ?? false;
    const marginTop = local_settings?.marginTop ?? 0;
    const paddingBottom = local_settings?.paddingBottom ?? false;
    const imageHeight = local_settings?.imageHeight;
    const mobileImageHeight = local_settings?.mobileImageHeight;
    const responsiveImage = local_settings?.responsiveImage ?? false;
    const containerHeight = local_settings?.containerHeight;

    return {
      image,
      body,
      title,
      name,
      cta,
      isVideo,
      noTeaserText,
      marginTop,
      paddingBottom,
      imageHeight,
      mobileImageHeight,
      responsiveImage,
      containerHeight,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
