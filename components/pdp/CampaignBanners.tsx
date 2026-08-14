import { api } from "@/lib/api";
import GenericFullWidthBanner from "./GenericFullWidthBanner";
import SplitBanner from "./SplitBanner";
import { IGenericFullWidthBanner } from "@/models/widgets/IGenericFullWidthBanner";
import { ISplitBanner } from "@/models/widgets/ISplitBanner";
import { getStoryblokRoot } from "@/constants/storyblok";
import { safeJsonParse } from "@/lib/utils";

type CampaignBannersProps = {
  campaign?: any;
  lang: Language;
};

type BannerBlock =
  | { type: "full-width"; props: IGenericFullWidthBanner }
  | { type: "split"; props: ISplitBanner };

const getStoriesByUuids = async (uuids: string[], lang: Language) => {
  if (!uuids.length) return [];
  const { success, data } = await api.cms.stories({
    by_uuids_ordered: uuids.join(","),
    language: lang,
  });
  return success && Array.isArray(data) ? data : [];
};

const CampaignBanners = async ({ campaign, lang }: CampaignBannersProps) => {
  const itemUuids = Array.isArray(campaign?.content?.items)
    ? campaign.content.items.filter((x: any) => typeof x === "string")
    : [];

  if (!itemUuids.length) return null;

  const stories = await getStoriesByUuids(itemUuids, lang);
  if (!stories.length) return null;

  const targetUuids = stories
    .flatMap((story: any) => story?.content?.teaser_targets ?? [])
    .flatMap((t: any) => t?.target ?? [])
    .filter((id: any) => typeof id === "string" && id.length > 0);

  const targetStories = await getStoriesByUuids(targetUuids, lang);

  const targetHrefByUuid = new Map(
    targetStories.map((s: any) => [s.uuid, s.full_slug?.replace(getStoryblokRoot() + `/${lang}`, "")])
  );

  const normalized: BannerBlock[] = stories.map((story: any) => {
    const b = story?.content ?? {};
    const targetUuid = b.teaser_targets?.[0]?.target?.[0];
    const targetAnchor = b.teaser_targets?.[0]?.target_anchor;
    const baseHref = targetUuid ? targetHrefByUuid.get(targetUuid) : "";
    const href = baseHref ? (targetAnchor ? `${baseHref}#${targetAnchor}` : baseHref) : "";
    const localSettings = safeJsonParse(b.local_settings?.code);
    const tabs = Array.isArray(localSettings?.tabs) ? localSettings.tabs : [];
    const multipleCTAs = Array.isArray(localSettings?.cta_links) ? localSettings.cta_links : [];
    
    // Priority: Use multipleCTAs if available, otherwise fall back to teaser_targets
    const resolvedCTA = multipleCTAs.length > 0
      ? multipleCTAs.length === 1
        ? multipleCTAs[0] // Single CTA from local settings
        : { multiple: multipleCTAs } // Multiple CTAs from local settings
      : { text: b.teaser_targets?.[0]?.target_text ?? "Discover collection", href: href }; // Fall back to teaser_targets

    // Build image object with fallback src/alt
    const imageObject = {
      src: b.media?.[0]?.filename,
      alt: b.media?.[0]?.alt || b.image?.[0]?.alt || "Banner Image",
      ...(b.media?.[1]?.filename && {
        desktop: { src: b.media?.[0]?.filename, alt: b.media?.[0]?.alt || b.image?.[0]?.alt || "Banner Image" },
        mobile: { src: b.media?.[1]?.filename, alt: b.media?.[1]?.alt || b.image?.[1]?.alt || "Banner Image" },
      }),
    };
    const isReversed = localSettings ? localSettings?.reversed : null;

    if (b.layout_variant === "full-width") {
      return {
        type: "full-width",
        props: {
          title: b.teaser_title1,
          body: { doc: b.teaser_longText1 },
          image: imageObject,
          video: b.overlay_video ? { src: b.overlay_video.filename, type: b.overlay_video.mime_type || "video/mp4" } : undefined,
          cta: resolvedCTA,
          theme: b.theme,
          background_color: b.backgroundColor,
        },
      };
    }

    return {
      type: "split",
      props: {
        layout_variant: b.layout_variant,
        title: b.teaser_title1,
        body: { doc: b.teaser_longText1 },
        subtext: { doc: b.teaser_longText2 },
        image: imageObject,
        video: b.overlay_video ? { src: b.overlay_video.filename, type: b.overlay_video.mime_type || "video/mp4" } : undefined,
        cta: resolvedCTA,
        tabs,
        background_color: b.backgroundColor?.[0],
        reversed: isReversed,
      },
    };
  });

  return (
    <>
      {normalized.map((block, i) => {
        if (block.type === "full-width") {
          return <GenericFullWidthBanner key={i} {...block.props} />;
        }
        if (block.type === "split") {
          return <SplitBanner key={i} {...block.props} />;
        }
        return null;
      })}
    </>
  );
};

export default CampaignBanners;
