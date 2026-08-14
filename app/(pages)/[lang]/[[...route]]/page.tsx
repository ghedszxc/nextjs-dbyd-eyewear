// import NavigationAdapter from "@/adapter/Navigation";
import PLPAdapter from "@/adapter/PLP/adapter";
import CategoryPageBuilder from "@/components/CategoryPageBuilder";
import StaticPageBuilder from "@/components/StaticPageBuilder";
import { productCatalogs, collectionCatalogs, FILTER_VALUES } from "@/constants/productPrefixQuery";
import { api } from "@/lib/api";
import { buildBreadcrumbs, getFooterWidgets, getHeaderWidgets, getWidgets, safeJsonParse } from "@/lib/utils";
import Footer from "@/widgets/Footer";
import Navigation from "@/widgets/Navigation";
import { notFound } from "next/navigation";
import OneTrustAnalytics from "@/components/onetrust/OneTrustAnalytsics";
import BreadcrumbsSection from "@/components/BreadcrumbsSection";
import AdobeAnalytics from "@/components/adobeanalytics/AdobeAnalytics";
import NavigationAdapter from "@/adapter/Navigation";
import { FooterAdapter } from "@/adapter/Footer";
import PDPPageBuilder from "@/components/PDPPageBuilder";

export const revalidate = 0;

const Page = async ({ params, searchParams }: PageProps) => {
  const { lang, route } = await params;

  // Default: use the actual route
  let cmsRoute: string[] = route ?? [];

  // PLP override: if first segment matches a configured product prefix
  const firstSegment = cmsRoute[0];
  if (firstSegment) {
    const secondSegment = cmsRoute[1];
    const catalog = productCatalogs.find((c) => c.productNameSegment === firstSegment);
    const secondSegmentCatalog = productCatalogs.find((c) => c.productNameSegment === secondSegment);
    const collection = collectionCatalogs.find((c) => c.collectionRoute === secondSegment);

    if (catalog && firstSegment === "products") {
      cmsRoute = catalog.productCmsRoute ?? cmsRoute;
    }
    if (secondSegmentCatalog && firstSegment === "products" && secondSegment) {
      cmsRoute = secondSegmentCatalog.productCmsRoute ?? cmsRoute;
    }
    if (collection && firstSegment === "products") {
      cmsRoute = collection.productCmsRoute ?? cmsRoute;
    }
  }

  const { success, data: page, status } = await api.cms.page(lang, cmsRoute);
  if (!success) {
    if (status === 404) return notFound();
    throw new Error(`Storyblok upstream error (${status ?? "unknown"}) fetching /${lang}/${cmsRoute.join("/")}`);
  }

  const headerWidgets = getHeaderWidgets(page);
  const footerWidgets = getFooterWidgets(page);
  const widgets = getWidgets(page);
  const component = page?.content?.component;

  if (!widgets?.length && component === "page") return notFound();

  const NavData = headerWidgets.length > 0 ? await NavigationAdapter(headerWidgets, lang) : null;
  const footerData = footerWidgets?.length > 0 ? await new FooterAdapter().adapt(footerWidgets, lang) : {};
  /**
   * PDP ROUTE SHORT-CIRCUIT
   *
   * Matches:  /products/:slug
   * Where :slug is NOT a known PLP segment (optic, sun, male, female, unisex...)
   *
   * Behavior:
   * - Call api.cms.product
   * - Render ProductDetailPage directly
   */
  const PDP_BASE = "products";

  // segments under /products that are NOT PDP slugs (they map to PLP)
  const PRODUCTS_PLP_SEGMENTS = new Set(
    productCatalogs.map((c) => c.productNameSegment).filter((s) => s !== PDP_BASE) // exclude "products" itself
  );

  const isProductsRoot = route?.[0] === PDP_BASE;
  const productType = route?.[1]; // /products/:type (eyeglasses, sunglasses, clean-lines)
  const possibleSlugOrFilter = route?.[2]; // /products/:type/:slug_or_filter

  // Pattern validation: determine if productType is a product ID vs category name
  // Product IDs typically follow patterns like: hex strings (0db1125), UUIDs (123e4567-e89b-12d3-a456-426614174000)
  const isProductIdPattern = productType && /^[a-f0-9\-]{7,}$/i.test(productType);

  // Validate that productType is a known category (not a product ID)
  const isKnownCategory =
    PRODUCTS_PLP_SEGMENTS.has(productType ?? "") || collectionCatalogs.some((c) => c.collectionRoute === productType);

  // Prevent /products/:id routes (product IDs without category) - return 404
  if (isProductsRoot && isProductIdPattern && !possibleSlugOrFilter) {
    return notFound();
  }

  // Detect if position 2 is a category filter (male, female, unisex, new, best-seller, etc.)
  const isSlugAFilter = possibleSlugOrFilter && FILTER_VALUES.includes(possibleSlugOrFilter as any);

  // Campaign match for determining if productType itself is a campaign
  const campaignMatch = collectionCatalogs.find((c) => c.collectionRoute === productType);
  const isCampaignRoute = Boolean(isProductsRoot && campaignMatch && !isProductIdPattern);

  // PLP routes: includes base, product types, campaigns, and with filters
  // Must have a known category at position 1
  const isPLPRoute =
    (isProductsRoot && !productType) || // /products (root)
    (isProductsRoot && !isProductIdPattern && isKnownCategory && !possibleSlugOrFilter) || // /products/eyeglasses or /products/clean-lines
    (isProductsRoot && productType && isSlugAFilter); // /products/eyeglasses/female (with filter)

  // PDP routes: /products/:type/:slug (where slug is NOT a filter and type is known category)
  const isPdpRoute = Boolean(
    isProductsRoot && !isProductIdPattern && productType && possibleSlugOrFilter && !isSlugAFilter // Exclude filters like male, female, new, best-seller
    // Campaigns CAN have PDP routes (e.g., /products/made-for-every-moment/0db2143-001)
  );

  if (isPdpRoute) {
    const productSlug = possibleSlugOrFilter as string; // /products/<type>/<slug>

    const { success: productSuccess, data, status: productStatus } = await api.cms.product(lang, productSlug);

    // Same rule as the page fetch: a failed upstream call is only a 404 when the
    // record is actually missing - otherwise throw so it renders as a retryable 5xx.
    if (!productSuccess && productStatus !== 404) {
      throw new Error(`Storyblok upstream error (${productStatus ?? "unknown"}) fetching product ${productSlug}`);
    }

    const productVariants = data?.stories ?? [];

    if (!productVariants.length) return notFound();

    return (
      <>
        <OneTrustAnalytics />
        <AdobeAnalytics
          pageType={"Pdp"}
          lang={lang}
        />
        <Navigation NavData={NavData ?? []} isPLPRoute={isPLPRoute} lang={lang} />
        <BreadcrumbsSection
          items={buildBreadcrumbs({
            lang,
            route: [...route!.slice(0, -1), productSlug?.toUpperCase() ?? ""],
          })}
        />
        <PDPPageBuilder productId={productSlug} pdpData={productVariants} lang={lang} />
        <Footer {...(footerData ?? {})} />
      </>
    );
  }

  const renderBuilder = async () => {
    switch (component) {
      case "page":
        return <StaticPageBuilder lang={lang} widgets={widgets} />;

      case "category": {
        const data = await PLPAdapter(widgets, lang);
        return (
          <CategoryPageBuilder
            plpData={{
              lang,
              category: route as string[],
              data,
            }}
          />
        );
      }

      default:
        return notFound();
    }
  };

  const getPageType = () => {
    if (isPLPRoute) {
      return "Plp"
    } else if (isPdpRoute) {
      return "Pdp"
    } else {
      return page?.name
    }
  }

  return (
    <>
      <OneTrustAnalytics />
      <AdobeAnalytics
        pageType={getPageType()}
        lang={lang}
      />
      <Navigation NavData={NavData ?? []} isPLPRoute={isPLPRoute} lang={lang} />
      {renderBuilder()}
      <Footer {...(footerData ?? {})} />
    </>
  );
};

export default Page;
