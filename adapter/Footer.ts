import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { IFooter } from "@/models/widgets/IFooter";
import { api } from "@/lib/api";
import { safeJsonParse } from "@/lib/utils";

const getStoriesByUuids = async (uuids: string[], lang: Language): Promise<any[] | null> => {
  if (!uuids?.length) return [];
  const { success, data } = await api.cms.stories({
    by_uuids_ordered: uuids.join(","),
    language: lang,
  });

  return success && Array.isArray(data) ? data : null;
};

const findPlacement = (widgets: any[], componentName: string) =>
  widgets?.find((w: any) => w?.component === componentName);

export class FooterAdapter extends Adapter<any[], Promise<Nullable<IFooter>>> {
  adapt = async (source: any[], lang?: Language): Promise<Nullable<IFooter>> => {
    if (!Array.isArray(source) || source.length === 0) return null;

    // --- Tagline (from footer_newsletter or similar placement) ---
    const newsletterWidget = findPlacement(source, "footer_newsletter");
    const newsletterStories = await getStoriesByUuids(newsletterWidget?.contents, lang!);

    const newsletterTitle = newsletterStories?.[0]?.content?.teaser_title1 || "";
    const rawRichText = newsletterStories?.[0]?.content?.teaser_longText1;
    const newsletterSubtitle = rawRichText?.type ? { doc: rawRichText } : undefined;

    // --- Social ---
    const newsletterOverlay = findPlacement(source, "footer_social");
    const newsletterOverlayInit = await getStoriesByUuids(newsletterOverlay?.contents, lang!);
    const newsletterOverlayStories = await getStoriesByUuids(newsletterOverlayInit?.[0]?.content?.items, lang!);

    const socialContent = newsletterOverlayStories?.[0]?.content ?? {};

    const social = {
      icon: socialContent?.media?.[0]?.filename || "",
      title: socialContent?.teaser_title || "",
      href: socialContent?.url || "",
    };

    // --- Navigation Links ---
    const navWidget = findPlacement(source, "footer_navigation");

    const navUuids: string[] = (navWidget?.contents ?? [])
      .map((c: any) => c)
      .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);

    const navInit = await getStoriesByUuids(navUuids, lang!);
    const navFinal = await getStoriesByUuids(navInit?.[0]?.content?.items, lang!);

    const navigationLinks = await Promise.all(
      (navFinal ?? []).map(async (story: any) => {
        const childContent = await getStoriesByUuids(story?.content?.items, lang!);

        const links = childContent?.map((child: any) => ({
          text: child?.content?.teaser_targets?.[0]?.target_text || "",
          href:
            child?.content?.teaser_targets?.[0]?.target_anchor !== "#"
              ? child?.content?.teaser_targets?.[0]?.target_anchor
              : child?.content?.media?.[0]?.filename || "",
        }));

        return {
          title: story?.content?.collection_title || "",
          links: links ?? [],
        };
      })
    );

    // --- Copyright ---
    const copyrightWidget = findPlacement(source, "footer_copyright");
    const copyrightContent = copyrightWidget?.contents?.[0]?.content ?? {};
    const copyright =
      copyrightContent?.teaser_title1 ||
      "Copyright ⓒ 2026 GrandVision Retail Holding B.V. All rights reserved. DbyD and the DbyD logo are registered trademarks of GrandVision Retail Holding B.V.";

    // --- Logo ---
    const logo = {
      src: "/icons/dbyd-logo-footer.svg",
      alt: "DbyD Logo",
    };

    return {
      newsletterTitle,
      newsletterSubtitle,

      social,
      navigationLinks,
      copyright,
      logo,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
