import { ITwoColumnTextAndMedia } from "@/models/widgets/ITwoColumnTextAndMedia";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class TwoColumnTextAndMediaAdapter extends Adapter<ITwoColumnTextAndMedia, Nullable<ITwoColumnTextAndMedia>> {
  adapt = (source: any): Nullable<ITwoColumnTextAndMedia> => {
    const data = source?.contents?.[0];

    const title = data?.content?.teaser_title || "";
    const subtitle = {
      doc: data?.content?.teaser_text || { type: "doc", content: [] },
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

    let local_settings: any = {};
    try {
      local_settings = JSON.parse(data?.content?.local_settings?.code ?? "{}");
    } catch {}

    const leftImage = local_settings?.leftImage ?? false;
    const mobileTextTop = local_settings?.mobileTextTop ?? false;
    const mt = local_settings?.mt;
    const mb = local_settings?.mb;
    const px = local_settings?.px;
    const responsiveImage = local_settings?.responsiveImage ?? false;
    const containerHeight = local_settings?.containerHeight;
    const subtitleClassName = local_settings?.subtitleClassName;

    return { title, subtitle, image, leftImage, mobileTextTop, mt, mb, px, responsiveImage, containerHeight, subtitleClassName };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
