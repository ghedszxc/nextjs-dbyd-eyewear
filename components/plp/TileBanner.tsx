// components/plp/TileBanner.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { imageSizes } from "@/lib/image-sizes";
import RichText from "../RichText";
import { CampaignBanner } from "@/adapter/PLP/adapter";
import { Button } from "../ui/button";

type Props = {
  banner: CampaignBanner;
  variant: "single" | "half-width";
};

const TileBanner = ({ banner, variant }: Props) => {
  const { desktopImage, mobileImage, title, description, cta, backgroundColor } = banner;
  // single tile is tall/portrait-ish, half-width tile is wider/landscape
  const aspect = variant === "single" ? "aspect-[1/1.4]" : "aspect-[16/9]";
  // single tile takes 1 of 3 desktop grid columns; half-width tile spans half the row
  const sizes = variant === "single" ? imageSizes({ base: "50vw", lg: "33vw" }) : "50vw";

  // Fallback: use desktop image for both if mobile image is missing
  const mobileSrc = mobileImage?.url || desktopImage?.url;
  const mobileAlt = mobileImage?.alt || desktopImage?.alt || "Banner";
  const desktopSrc = desktopImage?.url;
  const desktopAlt = desktopImage?.alt || "Banner";

  return (
    <div className={`relative h-[490px] lg:h-[519px] w-full overflow-hidden ${aspect}`}>
      {/* Image */}
      <div className="relative w-full h-full">
        {mobileSrc && <Image className="object-cover lg:hidden" src={mobileSrc} alt={mobileAlt} fill sizes={sizes} />}
        {desktopSrc && (
          <Image className="hidden object-cover lg:block" src={desktopSrc} alt={desktopAlt} fill sizes={sizes} />
        )}
      </div>

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-6 pr-12 text-white"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="flex flex-col h-full gap-4">
          {title && <h3 className="font-matter-regular text-2xl">{title}</h3>}
          {description?.doc && <RichText doc={description.doc} className={{ p: "font-matter-regular text-sm" }} />}
        </div>
        {cta?.label && (
          <Button variant={null} asChild className="font-matter-regular w-fit text-lg text-white hover:underline p-0">
            <Link href={cta.url}>{cta.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TileBanner;
