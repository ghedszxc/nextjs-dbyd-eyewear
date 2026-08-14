import { ISectionHeader } from "@/models/widgets/ISectionHeader";
import React from "react";

const SectionHeader = ({
  title,
  subtitle,
  withSubtitle,
  paddingMobileY,
  bgColor,
  spacingTop,
  maxWidth,
  paddingTop,
  mtMobile,
  lineHeight,
  mt = "mt-4",
}: ISectionHeader) => {
  const scopedId = React.useId().replace(/:/g, "");
  const containerId = `${scopedId}-container`;
  const mobilePyStyle = paddingMobileY ? { paddingTop: paddingMobileY, paddingBottom: paddingMobileY } : undefined;

  return (
    <div
      data-shid={containerId}
      className={`bg-[${bgColor}] font-matter-regular px-[24px] ${spacingTop ? "pt-[112px]" : "pt-[32px]"} pb-[32px] text-[#000000] lg:px-20 ${paddingMobileY ? "lg:!pt-[80px] lg:!pb-20" : "lg:pt-[80px] lg:pb-20"} ${withSubtitle ? `px-5 pb-20 text-[#000000] lg:px-20 ${paddingMobileY ? "lg:!pt-[160px]" : "lg:pt-[160px]"}` : ""}`}
      style={{ ...mobilePyStyle, ...(paddingTop ? { paddingTop } : {}) }}
    >
      {mtMobile && (
        <style>{`
          @media (max-width: 767px) { 
            [data-shid="${containerId}"] { margin-top: ${mtMobile}; }
          }
        `}</style>
      )}
      {maxWidth && (
        <style>{`
          @media (min-width: 1440px) {
            [data-shid="${scopedId}"] { max-width: ${maxWidth}; white-space: nowrap; }
          }
        `}</style>
      )}
      {lineHeight && (
        <style>{`
          @media (min-width: 1024px) {
            [data-shid="${containerId}"] h2 { line-height: ${lineHeight}; }
          }
        `}</style>
      )}
      {title && <h2 className="text-4xl  md:text-5xl ">{title}</h2>}
      {subtitle && (
        <p data-shid={maxWidth ? scopedId : undefined} className={`${mt} max-w-3xl text-base md:text-2xl lg:text-2xl`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
