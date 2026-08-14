"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { imageSizes } from "@/lib/image-sizes";

type ProductImage = { src: string; alt?: string };

export type ProductCardProduct = {
  name: string;
  // gender: string;
  status?: string;
  age_group?: string | null;
  polarized?: boolean;
  frame_color?: string;
  productType: string;
  images: ProductImage[]; // allows multiple images per color if you want later
};

export type ProductCardProps = {
  products: ProductCardProduct[];
  className?: string;
  lastInRow?: boolean;
};

function normalizeProducts(props: ProductCardProps): ProductCardProduct[] {
  if ("products" in props && props.products?.length) return props.products;
  return [];
}

export function ProductCard(props: ProductCardProps) {
  const products = useMemo(() => normalizeProducts(props), [props]);
  const { lang, route } = useParams();
  const category = route?.[0] ?? "products";
  const type = route?.[1] ?? "eyeglasses";

  // Each carousel slide is a "product/color"
  const totalColors = products.length;

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!api) return;

    setIndex(api.selectedScrollSnap());

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setIndex(newIndex);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const active = products[index] ?? products[0];

  return (
    <div
      className={[
        "bg-secondary-light flex size-full flex-col justify-between p-4 lg:p-6",
        "className" in props ? props.className : "",
      ].join(" ")}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-col-reverse gap-2 lg:flex-col">
        <div className="flex justify-between">
          <p className="font-matter-regular text-sm">
            {(() => {
              if (active?.status) return active.status;
              if (active?.age_group) return active.age_group;
              return active?.polarized ? "Polarized" : "";
            })()}
          </p>
          <p className="font-matter-regular hidden text-sm lg:block">
            {(() => {
              const hasStatus = !!active?.status;
              if (hasStatus && active?.age_group) return active.age_group;
              if (hasStatus) return active?.polarized ? "Polarized" : "";
              if (active?.age_group && active?.polarized) return "Polarized";
              return "";
            })()}
          </p>
        </div>
        <p className="font-matter-bold text-sm">{active?.name ?? ""}</p>
      </div>

      <Carousel setApi={setApi} className="flex h-auto flex-col justify-between">
        <CarouselContent className="h-full">
          {products.map((p, i) => {
            const angledImage = p.images?.[1];
            const frontImage = p.images?.[0];
            const slug = p?.name?.replace(" ", "-").toLowerCase();

            return (
              <CarouselItem key={`${p.name}-${i}`} className="h-full">
                <Link href={`/${category}/${type}/${slug}`}>
                  <div className="flex h-[9999px] max-h-[177px] w-full items-center justify-center lg:max-h-[344px]">
                    <div className="relative size-full">
                      {angledImage?.src ? (
                        <>
                          <Image
                            src={angledImage.src}
                            alt={angledImage.alt ?? p.name}
                            fill
                            sizes={imageSizes({ base: "50vw", lg: "33vw" })}
                            className={`object-contain transition-opacity duration-300 ${
                              isHovering ? "opacity-0" : "opacity-100"
                            }`}
                          />
                          {frontImage?.src && (
                            <Image
                              src={frontImage.src}
                              alt={frontImage.alt ?? p.name}
                              fill
                              sizes={imageSizes({ base: "50vw", lg: "33vw" })}
                              className={`object-contain transition-opacity duration-300 ${
                                isHovering ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          )}
                        </>
                      ) : (
                        <div className="text-muted-foreground flex size-full items-center justify-center text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className={`flex justify-between gap-2 ${totalColors > 1 ? "flex-col" : "flex-col-reverse"}`}>
          <span className="font-matter-regular flex justify-self-start text-sm lg:justify-center">
            {active.frame_color}
          </span>

          <div
            className={`items-center transition-opacity duration-300 lg:grid lg:grid-cols-3 ${totalColors > 1 ? "block" : "hidden"}`}
          >
            <div className={`justify-self-start ${isHovering && totalColors > 1 ? "lg:opacity-100" : "lg:opacity-0"}`}>
              <CarouselPrevious
                className="static hidden translate-x-0 translate-y-0 cursor-pointer bg-transparent shadow-none disabled:opacity-10 lg:block"
                aria-label="Previous color"
                variant={null}
              />
            </div>
            <div
              className={`font-matter-regular justify-self-start text-[8px] lg:justify-self-center ${totalColors > 1 ? "opacity-100" : "opacity-0"}`}
            >
              {`${index + 1} / ${totalColors} color${totalColors > 1 ? "s" : ""}`}
            </div>
            <div className={`justify-self-end ${isHovering && totalColors > 1 ? "lg:opacity-100" : "lg:opacity-0"}`}>
              <CarouselNext
                className="static hidden translate-x-0 translate-y-0 cursor-pointer bg-transparent shadow-none disabled:opacity-10 lg:block"
                aria-label="Next color"
                variant={null}
              />
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
