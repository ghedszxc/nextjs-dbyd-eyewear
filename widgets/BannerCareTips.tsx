import React from "react";
import { ICareTipsBanner } from "@/models/widgets/ICareTipsBanner";

const BannerCareTips = ({ heading, subtitle }: ICareTipsBanner) => {
  return (
    <section className="bg-white px-6 pt-24 pb-8 lg:px-20 lg:pt-32 lg:pb-10">
      <div className="mx-auto max-w-5xl xl:max-w-full text-left">
        {heading && (
          <>
            {/* <h2 className="font-matter-regular mb-3 text-3xl sm:hidden">
              Caring for your eyewear
            </h2> */}
            <h2 className="font-matter-regular mt-10 mb-3 text-4xl lg:text-5xl text-black sm:block">
              {heading}
            </h2>
          </>
        )}
        {subtitle && (
          <>
          {/* <p className="font-matter-regular text-lg text-black lg:text-xl sm:hidden">Preserve the beauty of your frames with these simple guidelines.</p> */}
          <p className="font-matter-regular text-xl lg:text-2xl text-black sm:block">{subtitle}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerCareTips;
