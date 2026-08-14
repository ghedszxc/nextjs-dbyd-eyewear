import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { IAboutHeroBanner } from "@/models/widgets/IAboutHeroBanner";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";

export class AboutHeroBannerAdapter extends Adapter<IAboutHeroBanner, Promise<Nullable<IAboutHeroBanner>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IAboutHeroBanner>> => {
    const data = source?.contents?.[0];
    const content = data?.content;

    const heading = content?.teaser_title1 || "";
    const subtitle = content?.teaser_preTitle || "";

    const body = {
      doc: content?.teaser_longText1 || {},
    };

    const desktopMedia = content?.media?.[0];
    const mobileMedia = content?.media?.[1];
    const image = {
      desktop: {
        url: desktopMedia?.filename || "",
        alt: desktopMedia?.alt || "",
      },
      mobile: {
        url: mobileMedia?.filename || desktopMedia?.filename || "",
        alt: mobileMedia?.alt || desktopMedia?.alt || "",
      },
    };

    let cta: IAboutHeroBanner["cta"] = undefined;
    const teaserTarget = content?.teaser_targets?.[0];

    cta = {
      href: teaserTarget?.target_anchor || "",
      text: teaserTarget?.target_text || "",
    };

    let overlay: IAboutHeroBanner["overlay"] = undefined;
    let local_settings: any = {};
    try {
      local_settings = JSON.parse(content?.local_settings?.code ?? "{}");

      if (local_settings?.overlay_color) {
        overlay = {
          color: local_settings.overlay_color,
          blendMode: local_settings.overlay_blend_mode || "multiply",
        };
      }
    } catch {}

    const paddingTopMobile = local_settings?.paddingTopMobile;
    const paddingTopDesktop = local_settings?.paddingTopDesktop;
    const minHeightMobile = local_settings?.minHeightMobile ?? "";

    return {
      image,
      subtitle,
      heading,
      body,
      cta,
      overlay,
      paddingTopMobile,
      paddingTopDesktop,
      minHeightMobile,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
