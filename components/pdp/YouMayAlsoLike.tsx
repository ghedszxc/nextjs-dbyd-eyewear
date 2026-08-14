import { fetchHandler } from "@/lib/handlers/fetch";
import { getBaseUrlForServer, safeJsonParse, transformStoryblokProducts } from "@/lib/utils";
import { ProductAttributes } from "@/types/pdp";
import { ProductCard } from "./ProductCard";

const YouMayAlsoLike = async ({ productId, pdpData, lang }: { productId: string; pdpData: any; lang: Language }) => {
  const product = pdpData?.find((product: any) => product?.name === productId?.replace("-", " ").toLocaleUpperCase());
  const productModel = product?.content?.product_code?.split(" ")[0];
  const productAttributes = safeJsonParse(product?.content?.local_settings?.code) as ProductAttributes;
  const productCollection = productAttributes?.FRAME_SHAPE;

  const MAX_PRODUCTS = 4;

  // Filter: Category = Products | FRAME_MATERIAL (Collection)
  // Using getBaseUrlForServer for server-side fetch (requires absolute URL).
  // fetchHandler checks response.ok before parsing — a CDN/origin HTML error
  // page must degrade to a hidden section, not crash the page render.
  const res = await fetchHandler<any>(
    `${getBaseUrlForServer()}/api/fetchProducts?lang=${lang}&category=products&attributes.FRAME_SHAPE=${productCollection}`
  );

  if (!res?.success) return null;

  const products = res?.data;
  const transformedProducts = transformStoryblokProducts(products);

  // Remove the product/product variants itself on you may like
  const filtered = transformedProducts
    .map((group) => group.filter((item) => !item.name.startsWith(productModel)))
    .filter((group) => group.length > 0)
    ?.slice(0, 4);

  if (filtered?.length === 0) return null;

  return (
    <>
      <div className="px-6 py-10 lg:py-12">
        <p className="font-matter-regular text-center text-2xl text-[#000000] lg:text-center">You may also like</p>
      </div>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto p-6 pt-2 lg:items-center lg:justify-center lg:p-8 lg:pt-0">
        {filtered.slice(0, MAX_PRODUCTS).map((group, index) => (
          <div className="w-[50%] shrink-0 md:w-1/4 lg:w-1/4" key={index}>
            <ProductCard products={group} />
          </div>
        ))}
      </div>
    </>
  );
};

export default YouMayAlsoLike;
