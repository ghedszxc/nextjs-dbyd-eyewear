"use client";

import { ProductCard } from "@/components/pdp/ProductCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { imageSizes } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";
import { IProductSuggestion } from "@/models/widgets/IProductSuggestion";
import Link from "next/link";

const ProductSuggestion = ({ title, products, cta }: IProductSuggestion) => {
  if (!products?.length) return null;

  const MAX_PRODUCTS = 4;

  return (
    <div className="text-black">
      <div className="px-6 py-10 lg:py-12">
        <p className="font-matter-regular text-center text-2xl lg:text-center">{title}</p>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto p-6 pt-2 lg:items-center lg:justify-center lg:px-8 lg:pb-0.5 lg:pt-0">
        {products.slice(0, MAX_PRODUCTS).map((group, index) => (
          <div className="w-[175px] shrink-0 md:w-1/4 lg:w-1/4" key={index}>
            <ProductCard
              products={group}
              className="h-[261px] lg:h-auto"
              imageClassName="flex h-[140px] w-[143px] items-center justify-center lg:h-[9999px] lg:max-h-[344px] lg:w-full"
              sizes={imageSizes({ base: "143px", lg: "25vw" })}
            />
          </div>
        ))}
      </div>

      {cta?.href && (
        <div className="flex justify-center px-6 py-8 lg:px-20 lg:py-10">
          <Link
            href={cta.href}
            className="font-matter-regular block w-full border border-black px-4 py-2 text-center text-lg lg:inline-block lg:w-auto"
          >
            {cta.text}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductSuggestion;
