import { api } from "@/lib/api";
import { ICardSlider } from "@/models/widgets/ICardSlider";
import { Nullable } from "@/adapter/model/Nullable.interface";
import { Adapter } from "@/adapter/model/Adapter";

export class CardSliderAdapter extends Adapter<ICardSlider, Promise<Nullable<ICardSlider>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ICardSlider>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.items?.join(",");
    const { data: teasers } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const title = data?.content?.collection_title;
    const subtitle = data?.content?.collection_subtitle;

    const items = teasers?.map((item) => {
      return {
        title: item?.content?.teaser_title,
        description: {
          doc: item?.content?.teaser_text || {},
        },
        image: {
          url: item?.content?.media?.[0]?.filename || "",
          alt: item?.content?.media?.[0]?.alt || "",
          type: "image" as "image" | "video",
        },
      };
    });

    return { title, subtitle, items };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
