import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IProductFullWidthBanner } from "@/models/widgets/IProductFullWidthBanner";
import { api } from "@/lib/api";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

export class ProductFullWidthBannerAdapter extends Adapter<IProductFullWidthBanner, Promise<Nullable<IProductFullWidthBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IProductFullWidthBanner>> => {
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
          url: target?.full_slug.replace(getStoryblokRoot(), ""),
          text: teaser?.target_text,
          type: "internal",
        };
      }) ?? []
    );

    const title = data?.content?.teaser_title1 || "";
    const description = data?.content?.teaser_title2 || "";
    const image = {
      url: data?.content?.media?.[0]?.filename || "",
      alt: data?.content?.media?.[0]?.alt || "",
      type: "image" as "image" | "video",
    }
    const isVideo = local_settings?.isVideo;

    return {
      title,
      description,
      image,
      links,
      isVideo,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
