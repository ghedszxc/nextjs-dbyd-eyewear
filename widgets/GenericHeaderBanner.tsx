import React from "react";
import { IGenericHeaderBanner } from "@/models/widgets/IGenericHeaderBanner";
import RichText from "@/components/RichText";

const GenericHeaderBanner = ({ heading, subtitle, bgColor, textColor, topPadding, mb = "mb-3" }: IGenericHeaderBanner) => {
  return (
    <section
      style={{ background: bgColor || "#fff" }}
      className="max-w-full px-[1.5rem] py-[2rem] text-left lg:mx-auto lg:px-[5rem] lg:py-[5rem]"
    >
      {/* added to serve as padding for pages that have fixed banners */}
      {topPadding && <div className={`pt-20 lg:pt-16`} />}

      {heading && (
        <span
          style={{ color: textColor || "#fff" }}
          className={`font-matter-regular ${mb} text-4xl sm:block lg:text-[48px]`}
        >
          {heading}
        </span>
      )}

      {subtitle && (
        <div style={{ color: textColor || "#fff" }} className="mt-5 lg:mt-0">
          <RichText
            doc={{
              type: subtitle.doc.type,
              content: subtitle.doc.content,
            }}
            className={{
              p: "font-matter-regular text-[16px] sm:block lg:text-2xl",
            }}
          />
        </div>
      )}
    </section>
  );
};

export default GenericHeaderBanner;
