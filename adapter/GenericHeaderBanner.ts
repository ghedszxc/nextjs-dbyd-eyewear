import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IGenericHeaderBanner } from "@/models/widgets/IGenericHeaderBanner";
import { safeJsonParse } from "@/lib/utils";

export class GenericHeaderBannerAdapter extends Adapter<IGenericHeaderBanner, Promise<Nullable<IGenericHeaderBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IGenericHeaderBanner>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const local_settings = safeJsonParse(content?.local_settings?.code);
    const heading = content?.teaser_title1;
    const rawSubtitle = content?.teaser_longText1;
    const subtitle = rawSubtitle?.type ? { doc: rawSubtitle } : undefined;
    const bgColor = local_settings?.bgColor;
    const textColor = local_settings?.textColor;
    const topPadding = local_settings?.topPadding;
    const mb = local_settings?.mb;

    return {
      heading,
      subtitle,
      bgColor,
      textColor,
      topPadding,
      mb,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
