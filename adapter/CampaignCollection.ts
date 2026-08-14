import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { ICampaignCollection } from "@/models/widgets/ICampaignCollection";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class CampaignCollectionAdapter extends Adapter<ICampaignCollection, Promise<Nullable<ICampaignCollection>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICampaignCollection>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.items?.join(",");

    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
      relations: ["teaser_targets.target"], // resolve teaser targets from teaser
    });

    const campaigns = items?.map((item) => {
      return {
        image: {
          desktop: {
            url: item?.content?.media?.[0]?.filename || null,
            alt: item?.content?.media?.[0]?.alt || "",
          },
          mobile: {
            url: item?.content?.media?.[1]?.filename || null,
            alt: item?.content?.media?.[1]?.alt || "",
          },
        },
        name: item?.content?.teaser_title || "",
        cta: {
          href: item?.content?.teaser_targets?.[0]?.target?.[0]?.full_slug?.replace(getStoryblokRoot(), "")?.replace(/^\/[a-z]{2}\//, "/") || "",
          text: item?.content?.teaser_targets?.[0]?.target_text || "",
        },
      };
    });

    return {
      campaigns,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
