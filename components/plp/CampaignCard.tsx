"use client";

import Image from "next/image";
import Link from "next/link";
import { imageSizes } from "@/lib/image-sizes";
import RichText from "../RichText";

type CampaignLayout = "tile" | "wide" | "wideLarge";

type CampaignCardProps = {
  layout?: CampaignLayout;
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: any;
  ctaLabel?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  href: string;
};

export function CampaignCard({
  layout = "tile",
  imageSrc,
  imageAlt = "",
  title,
  description,
  ctaLabel,
  className,
  href,
}: CampaignCardProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ""}`}>
      {/* Image */}
      <Image
        src={imageSrc}
        alt={imageAlt || "Campaign Image"}
        fill
        sizes={layout === "tile" ? imageSizes({ base: "50vw", lg: "33vw" }) : "100vw"}
        className="object-cover"
      />

      {/* Exact gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/50 to-black/0" />

      {/* Content */}
      {layout === "tile" ? (
        <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2.5 p-4 text-white">
          <h3 className="font-matter-regular text-[18px]">{title}</h3>
          <RichText
            doc={{
              type: description?.type,
              content: description?.content,
            }}
            className={{
              p: "font-matter-regular text-white/90",
            }}
          />
          <Link
            href={href}
            className="font-matter-regular inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            {ctaLabel}
          </Link>
        </div>
      ) : (
        <>
          {/* Top-left text */}
          <div className="absolute top-0 left-0 flex w-[80%] flex-col gap-4 p-4 text-white">
            <h3 className="font-matter-regular text-[18px]">{title}</h3>
            <RichText
              doc={{
                type: description?.type,
                content: description?.content,
              }}
              className={{
                p: "font-matter-regular text-white/90",
              }}
            />
          </div>

          {/* Bottom-left CTA */}
          <div className="absolute bottom-0 left-0 p-5">
            <Link
              href={href}
              className="font-matter-regular inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4"
            >
              {ctaLabel}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
