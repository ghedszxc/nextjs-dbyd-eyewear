import { getStoryblokRoot } from "@/constants/storyblok";
import handleError from "@/lib/handlers/error";
import logger from "@/lib/logger";
import { RequestError } from "@/lib/http-errors";
import { apiPlugin, StoryblokClient, storyblokInit } from "@storyblok/react/rsc";
import { ISbStoryData } from "storyblok-js-client";

export const toStoryblokRequestError = (error: unknown): RequestError => {
  if (error instanceof RequestError) return error;

  const sbError = error as {
    status?: number;
    message?: string;
    response?: { status?: number };
  };
  const status = sbError?.status ?? sbError?.response?.status;
  const message =
    typeof sbError?.message === "string" && sbError.message ? sbError.message : "Storyblok request failed";

  // No status means the request never completed (network failure/timeout) —
  // treat as upstream unavailable, never as "not found".
  return new RequestError(typeof status === "number" ? status : 503, message);
};

export const getStoryblokApi = process.env.STORYBLOK_CONTENT_API_ACCESS_TOKEN
  ? storyblokInit({
      accessToken: process.env.STORYBLOK_CONTENT_API_ACCESS_TOKEN,
      use: [apiPlugin],
      apiOptions: {
        region: "eu",
        timeout: 10,
        // Cache Content API responses in memory and reuse the space cache
        // version (cv) on every request, so Storyblok serves us from its CDN
        // cache — cached requests allow 1,000+ req/s vs 50/s uncached.
        // https://www.storyblok.com/docs/concepts/caching
        cache: { type: "memory", clear: "auto" },
        maxRetries: 3,
      },
    })
  : null;

export const flushStoryblokCache = async () => {
  const client = getStoryblokApi?.();
  if (!client) return;
  client.clearCacheVersion();
  await client.flushCache();
  lastCacheRefresh = Date.now();
  // Measurable in Grafana/logs: flush frequency indicates publish churn.
  // If this fires constantly, revisit per-story caching (see NTD ticket).
  logger.info("Storyblok cache flushed");
};

const CACHE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
let lastCacheRefresh = Date.now();

export const refreshCacheIfStale = async () => {
  if (Date.now() - lastCacheRefresh < CACHE_REFRESH_INTERVAL_MS) return;
  await flushStoryblokCache();
};

// Debounce for publish-webhook flushes: a bulk operation (e.g. a product
// import) fires one webhook per story — flushing on every one would thrash
// the cache and stampede uncached requests at Storyblok. A single publish
// still flushes immediately; bursts collapse into one leading + one trailing
// flush, so the last story in a burst is always picked up.
const FLUSH_DEBOUNCE_MS = 15 * 1000;
let trailingFlushTimer: ReturnType<typeof setTimeout> | null = null;

export const requestStoryblokCacheFlush = async () => {
  const sinceLastFlush = Date.now() - lastCacheRefresh;

  if (sinceLastFlush >= FLUSH_DEBOUNCE_MS) {
    await flushStoryblokCache();
    return;
  }

  if (!trailingFlushTimer) {
    trailingFlushTimer = setTimeout(() => {
      trailingFlushTimer = null;
      void flushStoryblokCache();
    }, FLUSH_DEBOUNCE_MS - sinceLastFlush);
  }
};

export const getStory = async (
  path: string,
  lang?: Language,
  relations?: string[],
  tags?: string[]
): Promise<ActionResponse<ISbStoryData>> => {
  const storyblokApi: StoryblokClient = getStoryblokApi!();
  await refreshCacheIfStale();

  const mode = (process.env.NEXT_PUBLIC_MODE as "preview" | "public") === "preview" ? "draft" : "published";

  const params: Record<string, unknown> = {
    version: mode,
    language: lang,
    resolve_relations: relations,
  };

  try {
    const { data } = await storyblokApi.getStory(`${getStoryblokRoot()}/${path}`, params, {
      next: mode === "published" ? { tags, revalidate: 3600 } : undefined,
    });
    const { story } = data;
    return { success: true, data: story };
  } catch (error) {
    return handleError(toStoryblokRequestError(error)) as ErrorResponse;
  }
};

export const getStories = async ({
  slugs,
  content_type,
  relations,
  per_page,
  page,
  sort_by,
  language,
  by_uuids,
  by_uuids_ordered,
  by_slugs,
  starts_with,
  with_tag,
  search_term,
}: FetchStoriesParams): Promise<ActionResponse<ISbStoryData[]>> => {
  const storyblokApi: StoryblokClient = getStoryblokApi!();
  await refreshCacheIfStale();

  const mode = (process.env.NEXT_PUBLIC_MODE as "preview" | "public") === "preview" ? "draft" : "published";

  const params: Record<string, unknown> = {
    version: mode,
    resolve_relations: relations,
    per_page: 100,
  };

  if (slugs) params.by_slugs = slugs;
  if (content_type) params.content_type = content_type;
  if (relations) params.resolve_relations = relations;
  if (per_page) params.per_page = per_page;
  if (page) params.page = page;
  if (sort_by) params.sort_by = sort_by;
  if (by_uuids) params.by_uuids = by_uuids;
  if (by_uuids_ordered) params.by_uuids_ordered = by_uuids_ordered;
  if (language) params.language = language;
  if (by_slugs) params.by_slugs = by_slugs;
  if (starts_with) params.starts_with = starts_with;
  if (with_tag) params.with_tag = with_tag;
  if (search_term) params.search_term = search_term;

  try {
    const { data } = await storyblokApi.getStories(params);
    const { stories } = data;

    return { success: true, data: stories };
  } catch (error) {
    return handleError(toStoryblokRequestError(error)) as ErrorResponse;
  }
};
