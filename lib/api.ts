import { defaultLocale } from "@/constants/locales";
import { PLACEMENTS_MAIN } from "@/constants/storyblok";
import { getProductVariants } from "@/lib/products";
import { getStories, getStory } from "@/lib/storyblok";
import { getPath } from "@/lib/utils";

export const api = {
  cms: {
    page: async (lang: Language, route?: string[]) => {
      const path = getPath(lang, route);
      const { success, data, status } = await getStory(
        path,
        lang,
        [...PLACEMENTS_MAIN?.map((placement) => `${placement}.contents`)],
        [`/${path}`]
      );

      return { success, data, status };
    },

    stories: async ({
      language,
      by_uuids_ordered,
      content_type,
      by_slugs,
      starts_with,
      with_tag,
      page,
      per_page,
      relations,
      search_term,
    }: FetchStoriesParams) => {
      const { success, data, status } = await getStories({
        language: language,
        by_uuids_ordered,
        content_type,
        by_slugs,
        starts_with,
        with_tag,
        page,
        per_page,
        relations,
        search_term,
      });
      return { success, data, status };
    },

    // Direct Storyblok query — no HTTP loopback through the public domain/CDN
    product: (lang: Language, id: string) => getProductVariants(lang || defaultLocale, id),
  },
};
