import React from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";
import Image from "next/image";
import { ICardSliderItem } from "@/models/widgets/ICardSlider";
import { imageSizes } from "@/lib/image-sizes";
import RichText from "./RichText";

const CampaignCard = ({ image, title, description, number, length }: ICardSliderItem) => {
  const { current } = useBreakpoint(breakpoints);

  return (
    <div className="campaign-card flex w-[288px] w-fit flex-col gap-6 lg:w-[352px]">
      <div className="relative h-[288px] w-[288px] lg:h-[352px] lg:w-[352px]">
        {image && (
          <Image className="object-cover" src={image.url} alt={image.alt} fill sizes={imageSizes({ base: "288px", lg: "352px" })} />
        )}
      </div>

      <div className="flex flex-col gap-2">
        {current == "mobile" && (
          <h5 className="h5-bold font-matter-bold">
            {number! + 1}/{length}
          </h5>
        )}
        {title && <h3 className="mb-3 text-2xl">{title}</h3>}
        {description && (
          <RichText
            doc={{
              type: description.doc.type,
              content: description.doc.content,
            }}
            className={{ p: "font-matter-regular w-[288px] text-sm" }}
          />
        )}
      </div>
    </div>
  );
};
export default CampaignCard;
