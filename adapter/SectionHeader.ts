import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { ISectionHeader } from "@/models/widgets/ISectionHeader";

export class SectionHeaderAdapter extends Adapter<ISectionHeader, Promise<Nullable<ISectionHeader>>> {
  adapt = async (source: any): Promise<Nullable<ISectionHeader>> => {
    const data = source?.contents?.[0];
    const content = data?.content ?? {};

    const title = content.teaser_title ?? "";
    const subtitle = content.teaser_text?.content?.[0]?.content?.[0]?.text ?? "";

    let local_settings: any = {};
    try {
      local_settings = JSON.parse(content?.local_settings?.code ?? "{}");
    } catch {}

    const withSubtitle = local_settings?.withSubtitle ?? false;
    const paddingMobileY = local_settings?.paddingMobileY;
    const spacingTop = local_settings?.spacingTop ?? false;
    const bgColor = local_settings?.bgColor ?? "#FFFFFF";
    const maxWidth = local_settings?.maxWidth;
    const paddingTop = local_settings?.paddingTop;
    const mtMobile = local_settings?.mtMobile;
    const lineHeight = local_settings?.lineHeight;
    const mt = local_settings?.mt;

    return {
      title,
      subtitle,
      withSubtitle,
      paddingMobileY,
      bgColor,
      spacingTop,
      maxWidth,
      paddingTop,
      mtMobile,
      lineHeight,
      mt,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
