import { ITwoColumnImage } from "@/models/widgets/ITwoColumnImage";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { api } from "@/lib/api";

// Extracts desktop/mobile images from a resolved Storyblok item's content.
// media[0] = desktop image, media[1] = mobile image (same pattern as FeaturedPair).
function extractBanner(item: any): ITwoColumnImage["left"] {
  let local_settings: any = {};
  try {
    local_settings = JSON.parse(item?.content?.local_settings?.code ?? "{}");
  } catch {}

  return {
    desktop: {
      url: item?.content?.media?.[0]?.filename || "",
      alt: item?.content?.media?.[0]?.alt || "",
    },
    mobile: {
      url: item?.content?.media?.[1]?.filename || "",
      alt: item?.content?.media?.[1]?.alt || "",
    },
    darkBg: local_settings?.darkBg || undefined,
    cta: {
      href: item?.content?.teaser_targets?.[0]?.target_anchor,
      text: item?.content?.teaser_targets?.[0]?.target_text,
      icon: item?.content?.teaser_icon?.[0]?.filename,
      ctaColor: local_settings?.ctaColor || "#3a3a2cbf",
      productName: item?.content?.teaser_title || local_settings?.productName,
    },
  };
}

export class TwoColumnImageAdapter extends Adapter<ITwoColumnImage, Promise<Nullable<ITwoColumnImage>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<ITwoColumnImage>> => {
    const data = source?.contents?.[0];
    const by_uuids = data?.content?.items?.join(",");
    const { data: items } = await api.cms.stories({
      by_uuids_ordered: by_uuids,
      language: lang,
    });

    const left = extractBanner(items?.[0]);
    const right = extractBanner(items?.[1]);

    if (!left.desktop.url && !left.mobile.url && !right.desktop.url && !right.mobile.url) {
      return null;
    }

    let local_settings: any = {};
    try {
      local_settings = JSON.parse(data?.content?.local_settings?.code ?? "{}");
    } catch {}

    const showText = local_settings?.showText ?? false;

    let title: string | undefined;
    let body: { doc: any } | undefined;

    if (showText) {
      const rawTitle = local_settings?.title ?? "";
      const rawBody = items?.[0]?.content?.teaser_text;

      const hasText = rawBody?.content?.some((block: any) => block?.content?.some((node: any) => node?.text?.trim()));

      title = rawTitle || undefined;
      body = hasText ? { doc: rawBody } : undefined;
    }

    const paddingY: string | undefined = local_settings?.paddingY;
    const bgColor: string = local_settings?.bgColor ?? "#f5f5f5";
    const spacingBottom: boolean | undefined = local_settings?.spacingBottom ?? false;
    const responsiveImage = local_settings?.responsiveImage ?? false;
    const containerHeight = local_settings?.containerHeight;

    return { left, right, title, body, paddingY, bgColor, spacingBottom, responsiveImage, containerHeight };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
