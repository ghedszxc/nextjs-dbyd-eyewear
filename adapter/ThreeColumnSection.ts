import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IThreeColumnCard, IThreeColumnSection } from "@/models/widgets/IThreeColumnSection";
import { api } from "@/lib/api";

export class ThreeColumnSectionAdapter extends Adapter<IThreeColumnSection, Promise<Nullable<IThreeColumnSection>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IThreeColumnSection>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.items?.join(",");
    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const cards = items?.map((item) => {
      return {
        number: item?.content?.teaser_title1,
        title: item?.content?.teaser_title2,
        body: {
          doc: item?.content?.teaser_longText1 || {},
        },
        image: {
          url: item?.content?.media?.[0]?.filename || "",
          alt: item?.content?.media?.[0]?.alt || "",
          type: "image" as "image" | "video",
        },
      };
    }) as IThreeColumnCard[];

    const iconLeft = {
      url: data?.content?.teaser_icon?.[0]?.filename,
      alt: data?.content?.teaser_icon?.[0]?.alt,
    };

    const iconRight = {
      url: data?.content?.teaser_icon?.[1]?.filename,
      alt: data?.content?.teaser_icon?.[1]?.alt,
    };

    return { cards, iconLeft, iconRight };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
