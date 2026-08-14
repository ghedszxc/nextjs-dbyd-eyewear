"use client";

import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { buildBreadcrumbs, getBaseUrl, transformStoryblokProducts } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";

import { formUrlQuery } from "@/lib/url";
import { DesktopBlock, FetchStatus, MobileBlock, TransformedProducts } from "@/types/plp";
import ButtonFilters from "./filters/ButtonFilters";
import { FiltersBar } from "./filters/FiltersBar";

import Banner from "./plp/Banner";
import BlocksGrid from "./plp/BlocksGrid";
import { Button } from "./ui/button";
import { usePLPProgressiveReveal } from "@/hooks/usePLPProgressiveReveal";
import { useNavStore } from "@/lib/store/nav";
import { clsx } from "clsx";
import TopFilters from "./filters/TopFilters";
import { CampaignBanner, CampaignSet } from "@/adapter/PLP/adapter";
import { collectionCatalogs, FILTER_VALUES } from "@/constants/productPrefixQuery";
import ProductsGrid from "./plp/ProductsGrid";

type LayoutBlock =
  | { type: "products"; items: TransformedProducts }
  | { type: "fullRow"; banner: CampaignBanner }                                          
  | { type: "singleTile"; banner: CampaignBanner; products: TransformedProducts }        
  | { type: "halfWidthTile"; banner: CampaignBanner; product?: TransformedProducts };     


function buildPLPLayout({ products, banners, columns, isMobile }: any): LayoutBlock[] {
  const blocks: LayoutBlock[] = [];
  const positionKey = isMobile ? "positionMobile" : "positionDesktop";
  const used = new Set<CampaignBanner>();
  let cursor = 0;
  let rowIndex = 1;

  while (cursor < products.length) {
    // 1) Banners that own the entire row (full-width, split) — emit BEFORE the row
    banners
      .filter((b: CampaignBanner) => !used.has(b) && b[positionKey] === rowIndex && (b.layout === "full-width" || b.layout === "split"))
      .forEach((b: CampaignBanner) => {
        blocks.push({ type: "fullRow", banner: b });
        used.add(b);
      });

    // 2) Tile rows — banner shares the row with products
    const halfTile = banners.find((b: CampaignBanner) => !used.has(b) && b[positionKey] === rowIndex && b.layout === "half-width-tile");
    const singleTile = banners.find((b: CampaignBanner) => !used.has(b) && b[positionKey] === rowIndex && b.layout === "single-tile");

    if (halfTile) {
      const productsInRow = isMobile ? 1 : 1; // tile col-span-3 + product col-span-3 on desktop, 1+1 on mobile
      blocks.push({
        type: "halfWidthTile",
        banner: halfTile,
        product: products[cursor],
      });
      used.add(halfTile);
      cursor += productsInRow;
    } else if (singleTile) {
      const productsInRow = columns - 1; // tile takes 1 slot, products fill the rest
      blocks.push({
        type: "singleTile",
        banner: singleTile,
        products: products.slice(cursor, cursor + productsInRow),
      });
      used.add(singleTile);
      cursor += productsInRow;
    } else {
      // 3) Plain product row
      blocks.push({ type: "products", items: products.slice(cursor, cursor + columns) });
      cursor += columns;
    }

    rowIndex++;
  }

  // Tail pass: emit any banner whose position was past the last product row.
  // Without this, banners are silently dropped when filters return fewer rows than the banner's position.
  banners
    .filter((b: CampaignBanner) => !used.has(b))
    .sort((a: CampaignBanner, b: CampaignBanner) => a[positionKey] - b[positionKey])
    .forEach((b: CampaignBanner) => {
      if (b.layout === "single-tile") {
        blocks.push({ type: "singleTile", banner: b, products: [] });
      } else if (b.layout === "half-width-tile") {
        blocks.push({ type: "halfWidthTile", banner: b });
      } else {
        blocks.push({ type: "fullRow", banner: b });
      }
      used.add(b);
    });

  return blocks;
}

const DESKTOP_PRODUCT_SLOTS = 18;
const MOBILE_PRODUCT_SLOTS = 12;

function formApiUrl({
  baseUrl,
  lang,
  category,
  searchParams,
}: {
  baseUrl: string;
  lang: string;
  category: string;
  searchParams: URLSearchParams;
}) {
  // For relative paths (baseUrl is empty in production on client), build URL string directly
  // For absolute URLs (baseUrl exists on server or in development), use new URL() constructor
  const isRelativePath = !baseUrl;
  const endpoint = isRelativePath ? "/api/fetchProducts" : `${baseUrl}/api/fetchProducts`;

  if (isRelativePath) {
    // Build relative URL string manually
    const params = new URLSearchParams();
    params.set("lang", lang);
    params.set("category", category);

    // Carry over filter URL params (exclude page since we're progressive revealing)
    for (const [key, value] of searchParams.entries()) {
      if (key === "lang" || key === "category" || key === "page") continue;
      params.set(key, value);
    }

    return `${endpoint}?${params.toString()}`;
  } else {
    // Use new URL() for absolute URLs (development mode)
    const url = new URL(endpoint);
    url.searchParams.set("lang", lang);
    url.searchParams.set("category", category);

    // Carry over filter URL params (exclude page since we're progressive revealing)
    for (const [key, value] of searchParams.entries()) {
      if (key === "lang" || key === "category" || key === "page") continue;
      url.searchParams.set(key, value);
    }

    return url.toString();
  }
}

const PLP = ({
  plpData,
}: {
  plpData: {
    lang: Language;
    category: string[];
    data: any;
  };
}) => {
  const { lang, category, data } = plpData;
  const { productsPlaceholder, filters: sideFilters, topFilters, campaigns, viewMoreProducts, banner } = data;
  const mode = process.env.NEXT_PUBLIC_MODE === "public" ? "published" : "draft";

  const searchParams = useSearchParams();
  const hasQueryString = Array.from(searchParams.keys()).length > 0;
  // The nav publishes its hide-on-scroll state; the single sticky FiltersBar
  // (and the desktop sidebar) follow it so they stay flush with the nav.
  const navHidden = useNavStore((s) => s.hidden);

  const [transformedProducts, setTransformedProducts] = useState<TransformedProducts>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { width, current } = useBreakpoint(breakpoints);
  const isMobile = width <= 768;
  const hasCampaignLayout = (campaigns?.length ?? 0) > 0;

  const { visibleCount, hasMore, revealMore, reset } = usePLPProgressiveReveal({
    totalProducts: transformedProducts.length,
    isMobile,
    desktopPageSize: DESKTOP_PRODUCT_SLOTS,
    mobilePageSize: MOBILE_PRODUCT_SLOTS,
    hasCampaignLayout,
  });

  const filterQueryString = useMemo(() => {
    // Create a string without the page param to detect filter changes
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    return params.toString();
  }, [searchParams]);

  useEffect(() => {
    // Reset progressive reveal when filters change
    reset();
  }, [filterQueryString, reset]);

  const productsForGrid = useMemo(() => {
    return transformedProducts.slice(0, visibleCount);
  }, [transformedProducts, visibleCount]);

  const filterMatch = category.find((seg) => FILTER_VALUES.includes(seg as any));
  const collectionMatch = collectionCatalogs.find((c) => category.includes(c.collectionRoute));
  const hasExplicitScope = Boolean(filterMatch || collectionMatch);
  const activeFilter = filterMatch ?? collectionMatch?.collectionRoute ?? "default";

  const activeBanners = useMemo<CampaignBanner[]>(() => {
    if (!campaigns?.length) return [];

    const target = activeFilter.toLowerCase();
    const scoped = campaigns.find((s: CampaignSet) => s.scope?.toLowerCase() === target);
    if (scoped) return scoped.banners;

    // URL has an explicit filter/collection but no matching banner set → show nothing.
    // Prevents /products/sunglasses/best-seller from falling back to the default banner.
    if (hasExplicitScope) return [];

    // No filter/collection in URL → safe to use the default set.
    const defaultSet = campaigns.find((s: CampaignSet) => s.scope?.toLowerCase() === "default");
    return defaultSet?.banners ?? [];
  }, [campaigns, activeFilter, hasExplicitScope]);

  const layout = useMemo<any>(
    () => buildPLPLayout({ products: productsForGrid, banners: activeBanners, columns: isMobile ? 2 : 3, isMobile }),
    [productsForGrid, activeBanners, isMobile]
  );

  // Calculate expected skeleton slots based on current breakpoint and visible products
  const expectedSlotCount = Math.min(
    visibleCount || (isMobile ? MOBILE_PRODUCT_SLOTS : DESKTOP_PRODUCT_SLOTS),
    isMobile ? MOBILE_PRODUCT_SLOTS : DESKTOP_PRODUCT_SLOTS
  );

  const fetchUrl = useMemo(() => {
    return formApiUrl({
      baseUrl: getBaseUrl(),
      lang: String(lang),
      category: String(category.join(",")),
      searchParams,
    });
  }, [lang, category, filterQueryString]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAllProducts() {
      try {
        setStatus("loading");
        setErrorMsg("");

        const res = await fetch(fetchUrl, {
          method: "GET",
          signal: controller.signal,
          credentials: "include",
          headers: { Accept: "application/json" },
          next: mode === "published" ? { revalidate: 15 } : undefined,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to fetch products (HTTP ${res.status})`);
        }

        const json = await res.json();
        const products = json?.data ?? [];

        // Warn if fetching a large dataset (consider pagination for > 500)
        if (products.length > 500) {
          console.warn(
            `[PLP] ${products.length} products fetched. Consider server-side pagination for large datasets.`
          );
        }

        setTransformedProducts(transformStoryblokProducts(products));
        setStatus("ready");
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setStatus("error");
        setErrorMsg(err?.message || "Something went wrong while fetching products.");
      }
    }

    fetchAllProducts();
    return () => controller.abort();
  }, [fetchUrl, mode]);

  // HANDLER: View More Products
  const handleViewMore = useCallback(() => {
    revealMore();
    // Optional: Scroll to grid for better UX
    // window.scrollTo({ top: gridRef.current?.offsetTop, behavior: "smooth" });
  }, [revealMore]);

  return (
    <>
      <FiltersBar
        filters={sideFilters}
        topFilters={topFilters}
        category={category}
        placeholder={productsPlaceholder}
        resultsCount={transformedProducts.length}
        status={status}
        errorMsg={errorMsg}
        lang={lang}
        containerClassName={clsx(
          "z-10 mt-20 transition-[top] duration-300 ease-in-out lg:sticky lg:mt-22",
          navHidden ? "lg:top-0" : "lg:top-22"
        )}
        onApply={(selected) => {
          console.log("APPLY FILTERS:", selected);
        }}
      />

      {/* Main Content */}
      <div className={`flex flex-col lg:flex-row ${!hasMore ? "pb-10" : ""}`}>
        {/* Fixed Sidebar Filters (Desktop Only) */}
        {sideFilters.length > 0 && current === "desktop" && (
          <div
            className={clsx(
              "sticky top-20 hidden h-max w-64 transition-[top] duration-300 ease-in-out lg:block",
              navHidden ? "lg:top-31" : "lg:top-53"
            )}
          >
            <ButtonFilters filters={sideFilters} category={category} />
          </div>
        )}

        {sideFilters.length > 0 && isMobile && (
          <>
            <div className="relative block w-full flex-1 overflow-hidden lg:hidden">
              <div className="no-scrollbar scroll overflow-x-auto">
                <ButtonFilters filters={sideFilters} category={category} />
              </div>

              <div
                className="pointer-events-none absolute inset-y-0 -right-2 w-11 bg-linear-to-l from-white to-transparent"
                style={{
                  backdropFilter: "blur(1.5px)",
                  maskImage: "linear-gradient(to left, black 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to left, black -30%, black 70%, transparent 100%)",
                }}
              />
            </div>
            <div
              className={clsx(
                "sticky z-10 flex w-full justify-end-safe bg-white/75 px-6 py-2 backdrop-blur-[2px] transition-[top] duration-300 ease-in-out lg:hidden",
                navHidden ? "top-0" : "top-20"
              )}
            >
              <TopFilters
                filterConfig={topFilters}
                triggerLabel="Filters"
                resultsCount={transformedProducts.length}
                lang={lang}
                category={category}
                onApply={(selected) => {
                  console.log("APPLY FILTERS:", selected);
                }}
                className="font-matter-regular cursor-pointer gap-4 text-sm hover:bg-transparent hover:underline"
              />
            </div>
          </>
        )}

        {/* Products Grid with Campaign Banners */}
        {campaigns?.length > 0 && !hasQueryString ? (
          <BlocksGrid
            blocks={layout}
            status={status}
            isMobile={isMobile}
            slotCount={expectedSlotCount}
            className="w-full gap-2 px-2 pb-0 lg:gap-2 lg:px-0"
          />
        ) : (
          <ProductsGrid
            transformedProducts={productsForGrid}
            slotCount={expectedSlotCount}
            status={status}
            className="w-full gap-2 p-2 pb-0 lg:p-0"
          />
        )}
      </div>
      {hasMore && (
        <div className="flex-center w-full px-4 py-10">
          <Button
            variant={null}
            className="font-matter-regular cursor-pointer rounded-none border border-black px-4 py-2"
            disabled={status === "loading"}
            onClick={handleViewMore}
          >
            {viewMoreProducts}
          </Button>
        </div>
      )}

      {/* Bottom Banner */}
      <Banner banner={banner} category={category} />
    </>
  );
};

export default PLP;
