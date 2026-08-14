import { getStoryblokRoot } from "@/constants/storyblok";
import { api } from "@/lib/api";
import { IProductSuggestion } from "@/models/widgets/IProductSuggestion";
import { Adapter } from "./model/Adapter";
import { Nullable } from "./model/Nullable.interface";
import { getBaseUrlForServer, safeJsonParse, transformStoryblokProducts } from "@/lib/utils";
import { fetchHandler } from "@/lib/handlers/fetch";

export class ProductSuggestionAdapter extends Adapter<IProductSuggestion, Promise<Nullable<IProductSuggestion>>> {
  adapt = async (source: any, lang?: Language): Promise<Nullable<IProductSuggestion>> => {
    const data = source?.contents?.[0];

    let local_settings: any = {};
    try {
      local_settings = JSON.parse(data?.content?.local_settings?.code ?? "{}");
    } catch {}

    const collection = local_settings?.CAMPAIGN_FOOTER_SELECTION;
    if (!collection) return null;

    const title = data?.content?.teaser_title1 || "We think you'll love these";

    const teaserTarget = data?.content?.teaser_targets?.[0];
    const targetId = teaserTarget?.target?.join(",");
    let cta: { text?: string; href?: string } | undefined;
    if (targetId) {
      const { data: targetData } = await api.cms.stories({
        by_uuids_ordered: targetId,
        language: lang,
      });
      cta = {
        href: targetData?.[0]?.full_slug?.replace(getStoryblokRoot() + `/${lang}`, "") || "",
        text: teaserTarget?.target_text || "",
      };
    }

    // Using getBaseUrlForServer for server-side fetch (requires absolute URL).
    // fetchHandler checks response.ok before parsing — a CDN/origin HTML error
    // page must degrade to a hidden section, not crash the page render.
    const res = await fetchHandler<any>(`${getBaseUrlForServer()}/api/fetchProducts?lang=${lang}&category=products`);

    if (!res?.success) return null;

    const products = res?.data;
    const filteredProducts = products
      ?.map((story: any) => {
        const related = story?.content?.related_products ?? [];

        const filteredRelated = related.filter((rp: any) => {
          const variantCollection = String(rp?.content?.campaign_footer_selection ?? "").toLowerCase();
          return variantCollection === collection.toLowerCase();
        });

        return {
          ...story,
          content: {
            ...story.content,
            related_products: filteredRelated,
          },
        };
      })
      ?.filter((product: any) => product.content?.related_products?.length);  
    

    const transformedProducts = transformStoryblokProducts(filteredProducts);
    const limited = transformedProducts.slice(0, 4);

    if (limited.length === 0) return null;

    return {
      title,
      products: limited,
      cta,
    };
  };

  adaptReverse = (source: Nullable<any>) => {
    return source;
  };
}
