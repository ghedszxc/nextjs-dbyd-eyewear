import { Button } from "@/components/ui/button";
import { IProductFullWidthBanner } from "@/models/widgets/IProductFullWidthBanner";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RichText from "../RichText";

const ProductFullWidthBanner = ({ image, title, description, links }: IProductFullWidthBanner) => {
  return (
    <section className="bg-linear-to-l from-[#8B6945] to-[#321A01]">
      <div className="relative mx-auto p-6 h-[810px] w-full lg:p-12 lg:h-[652px]">
        {image && image.type === "video" && (
          <video
            className="h-full w-full object-cover"
            src={image.url}
            autoPlay={false}
            muted={true}
            loop={true}
            controls={true}
            playsInline
          />
        )}
        {image && image.type === "image" && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        )}
        <div className="relative z-1 font-matter-regular">
          {title && <p className="max-w-lg text-2xl text-white">{title}</p>}
          {description && <p className="mt-4 max-w-lg text-sm text-white">{description}</p>}
          {links &&
            links?.map((link, index: number) => (
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-none text-white border-[1px] border-white  bg-transparent px-4 py-2 w-[100%] mt-6 md:text-lg lg:w-[187px] lg:hover:bg-transparent/80 lg:hover:text-white"
                key={index}
              >
                <Link href={link?.url}>
                  <span className="font-matter-regular text-lg">{link.text}</span>
                </Link>
              </Button>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFullWidthBanner;
