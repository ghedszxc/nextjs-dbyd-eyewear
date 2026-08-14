import Image from "next/image";
import Link from "next/link";
import { imageSizes } from "@/lib/image-sizes";
import RichText from "../RichText";
import { Button } from "../ui/button";

type SplitCampaignCardProps = {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: any;
  ctaLabel?: string;
  href: string;
};

export function SplitCampaignCard({
  imageSrc,
  imageAlt = "",
  title,
  description,
  ctaLabel,
  href,
}: SplitCampaignCardProps) {
  return (
    <div className="grid size-full grid-rows-[375px_1fr] overflow-hidden lg:grid-cols-12 lg:grid-rows-none">
      {/* Left: Image */}
      <div className="relative col-span-6">
        <Image src={imageSrc} alt={imageAlt} fill sizes={imageSizes({ base: "100vw", lg: "50vw" })} className="object-cover" />
      </div>

      {/* Right: Content panel */}
      <div className="col-span-6 bg-[#3A3A2D] text-white">
        <div className="flex h-full flex-col p-6">
          {/* Top copy */}
          <div className="flex flex-col gap-4">
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

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <Button
            className="w-fit rounded-none border border-white/60 px-5 py-2 text-sm text-white/90 hover:border-white hover:text-white"
            variant={null}
            asChild
          >
            <Link href={href}>{ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
