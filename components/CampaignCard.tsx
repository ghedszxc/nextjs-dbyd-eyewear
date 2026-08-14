import { imageSizes } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";
import { ICampaignCard } from "@/models/widgets/ICampaignCollection";
import Image from "next/image";
import Link from "next/link";

const CampaignCard = ({ image, name, cta, tall = true, imgContainerClass, className }: ICampaignCard & { tall?: boolean, imgContainerClass?: string, className?: string } ) => {
  return (
    <div className={cn("flex w-[288px] flex-col gap-4 md:w-[590px] md:gap-[24px]", className)}>
      {/* Image — stagger via tall prop */}
      <div className={cn("relative h-[288px] w-full overflow-clip md:h-[600px]", !tall && "md:h-[430px]", tall && imgContainerClass)}>
        {/* Mobile */}
        {image?.mobile?.url && (
          <Image
            src={image.mobile.url}
            alt={image.mobile.alt ?? ""}
            fill
            sizes={imageSizes({ base: "288px", md: "590px" })}
            className="block object-cover md:hidden"
          />
        )}
        {/* Desktop */}
        {image?.desktop?.url && (
          <Image
            src={image.desktop.url}
            alt={image.desktop.alt ?? ""}
            fill
            sizes={imageSizes({ base: "288px", md: "590px" })}
            className="hidden object-cover md:block"
          />
        )}
        {/* Fallback: desktop image on mobile when no mobile variant */}
        {!image?.mobile?.url && image?.desktop?.url && (
          <Image
            src={image.desktop.url}
            alt={image.desktop.alt ?? ""}
            fill
            sizes={imageSizes({ base: "288px", md: "590px" })}
            className="block object-cover md:hidden"
          />
        )}
      </div>

      {/* Caption */}
      <div className="flex flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between md:gap-0 md:px-[32px]">
        {name && <p className="font-matter-regular flex-[1_0_0] text-lg leading-normal md:text-[18px]">{name}</p>}
        {cta?.href && (
          <Link
            href={cta.href}
            className="font-matter-regular flex-[1_0_0] text-lg leading-[1.5] md:text-right md:text-[18px]"
          >
            {cta.text}
          </Link>
        )}
      </div>
    </div>
  );
};
export default CampaignCard;
