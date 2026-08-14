import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { ITwoColumnText } from "@/models/widgets/ITwoColumnText";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class TwoColumnTextAdapter extends Adapter<ITwoColumnText, Promise<Nullable<ITwoColumnText>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ITwoColumnText>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const title = content?.teaser_title1;

    const subtitle = {
      doc: content?.teaser_longText1 || {},
    };

    let bgColor: ITwoColumnText["bgColor"] = "#ffffff";
    let fontColor: ITwoColumnText["fontColor"] = "#000000";

    let local_settings: any = {};
    try {
      local_settings = JSON.parse(content?.local_settings?.code ?? "{}");
      if (local_settings?.bgColor) bgColor = local_settings?.bgColor;
      if (local_settings?.fontColor) fontColor = local_settings?.fontColor;
    } catch {}

    const titleFontSize = local_settings?.titleFontSize;
    const mobilePaddingY = local_settings?.mobilePaddingY;
    const bottomPadding = local_settings?.bottomPadding;

    let cta: ITwoColumnText["cta"] | undefined;
    const teaserTarget = content?.teaser_targets?.[0];
    cta = {
      href: teaserTarget?.target_anchor || "",
      text: teaserTarget?.target_text || "",
    };

    return {
      title,
      subtitle,
      bgColor,
      fontColor,
      titleFontSize,
      mobilePaddingY,
      bottomPadding,
      cta,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
