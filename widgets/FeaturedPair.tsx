import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { imageSizes } from "@/lib/image-sizes";
import { IFeaturedPair } from "@/models/widgets/IFeaturedPair";

const FeaturedPair = ({ cards, swap, variant = "default", imageSize }: IFeaturedPair) => {
  const firstCard = cards?.find((card) => card?.position === "left");
  const secondCard = cards?.find((card) => card?.position === "right");
//uncomment if you block layout
  // if (variant === "block") {
  //   return (
  //     <section>
  //       <div
  //         className={cn(
  //           "block lg:flex lg:gap-8 lg:p-8 lg:pr-0",
  //           swap && "flex flex-col-reverse lg:flex-row-reverse lg:pr-8 lg:pl-0"
  //         )}
  //       >
  //         {/* First Card */}
  //         <div className="flex-1 p-6 lg:p-0">
  //           <div className={cn("flex size-full flex-col gap-6 lg:mb-12", swap && "lg:mt-12 lg:mb-0")}>
  //             {/* Image */}
  //             <div className="relative h-[310px] md:h-[384px] lg:h-[628px] 2xl:h-[860px]">
  //               {/* Mobile */}
  //               {firstCard?.image?.mobile?.url && (
  //                 <Image
  //                   className="object-cover md:hidden"
  //                   src={firstCard?.image?.mobile?.url}
  //                   alt={firstCard?.image?.mobile?.alt as string}
  //                   fill
  //                    
  //                 />
  //               )}

  //               {/* Tablet/Desktop */}
  //               {firstCard?.image?.desktop?.url && (
  //                 <Image
  //                   className="hidden object-cover md:block"
  //                   src={firstCard?.image?.desktop?.url}
  //                   alt={firstCard?.image?.desktop?.alt as string}
  //                   fill
  //                    
  //                 />
  //               )}
  //             </div>

  //             {/* Text Content */}
  //             <div className="flex flex-col gap-2">
  //               {(firstCard?.title || firstCard?.subtitle) && (
  //                 <Link href={firstCard?.link?.url || "#"}>
  //                   <h3 className="h3-bold flex-start font-gt-america-expanded-bold gap-2">
  //                     {firstCard?.title || firstCard?.subtitle}
  //                     <span>
  //                       <Image src="/icons/arrow-right.svg" alt="Arrow Right" width={16} height={16}   />
  //                     </span>
  //                   </h3>
  //                 </Link>
  //               )}

  //               {firstCard?.title && firstCard?.subtitle && <h6 className="h6-bold font-gt-america-expanded-bold">{firstCard?.subtitle}</h6>}
  //             </div>
  //           </div>
  //         </div>

  //         {/* Second Card */}
  //         <div className="flex-1 p-6 lg:p-0">
  //           <div className={cn("flex size-full flex-col gap-6 lg:justify-end", swap && "lg:justify-start")}>
  //             {/* Image */}
  //             <div className="relative h-[200px] md:h-[384px] 2xl:h-[55%]">
  //               {secondCard?.image?.desktop?.url && (
  //                 <Image
  //                   className="object-cover"
  //                   src={secondCard?.image?.desktop?.url}
  //                   alt={secondCard?.image?.desktop?.alt as string}
  //                   fill
  //                    
  //                 />
  //               )}
  //             </div>

  //             {/* Text Content */}
  //             <div className={cn("flex flex-col gap-2", swap && "lg:ml-6")}>
  //               {(secondCard?.title || secondCard?.subtitle) && (
  //                 <Link href={secondCard?.link?.url || "#"}>
  //                   <h3 className="h3-bold flex-start font-gt-america-expanded-bold gap-2">
  //                     {secondCard?.title || secondCard?.subtitle}
  //                     <span>
  //                       <Image src="/icons/arrow-right.svg" alt="Arrow Right" width={16} height={16}   />
  //                     </span>
  //                   </h3>
  //                 </Link>
  //               )}

  //               {secondCard?.title && secondCard?.subtitle && (
  //                 <h6 className="h6-bold font-gt-america-expanded-bold">{secondCard?.subtitle}</h6>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // Default variant
  return (
    <section className="mt-10 lg:mt-14 lg:pb-4">
      <div
        className={cn(
          "flex flex-col gap-6 px-6 lg:flex-row lg:gap-8 lg:px-8 lg:pb-8",
          swap && "lg:flex-row-reverse lg:h-[973px]",
          imageSize && "px-0 lg:justify-center lg:gap-20"
        )}
      >
        {/* First Card */}
        <div
          className={cn(!imageSize && "flex-1", imageSize && "w-full lg:[max-width:var(--card-max-w)]")}
          style={imageSize ? ({ "--card-max-w": `${imageSize.width}px` } as React.CSSProperties) : undefined}
        >
          <div className={cn("flex size-full flex-col justify-start gap-6 pb-8 lg:pb-0 lg:mb-12", swap && "lg:mt-2 lg:mb-8")}>
            {/* Image — left offset on mobile, reset on desktop */}
            {firstCard?.link?.url ? (
              <Link href={firstCard.link.url} className="campaign-banner-link block">
                <div
                  className={cn(
                    "img-hover-zoom-container relative overflow-hidden mr-6 lg:ml-0",
                    imageSize
                      ? "max-h-[375px] lg:max-h-none"
                      : "h-[310px] md:h-[384px] lg:h-[628px] 2xl:h-[600px]"
                  )}
                  style={imageSize ? { height: imageSize.height } : undefined}
                >
                  {firstCard?.image?.mobile?.url && (
                    <Image
                      className="object-cover md:hidden img-hover-zoom"
                      src={firstCard?.image?.mobile?.url}
                      alt={firstCard?.image?.mobile?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                  {firstCard?.image?.desktop?.url && (
                    <Image
                      className="hidden object-cover md:block img-hover-zoom"
                      src={firstCard?.image?.desktop?.url}
                      alt={firstCard?.image?.desktop?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                </div>
                <div className={cn("flex flex-col gap-1 md:flex-row md:items-center md:justify-between pt-6", imageSize && "lg:px-4")}>
                  {firstCard?.subtitle && (
                    <p className="font-matter-regular ml-[18px] text-lg leading-normal md:text-[18px] lg:ml-0">{firstCard?.subtitle}</p>
                  )}
                  {firstCard?.link?.text && (
                    <span className="cta-hover-underline font-matter-regular ml-[18px] md:ml-0 md:mr-[18px] inline-flex items-center gap-2 text-lg leading-[1.5] md:text-[18px]">
                      {firstCard.link.text}
                      {firstCard?.icon?.url && (
                        <Image src={firstCard.icon.url} alt={firstCard.icon.alt || ""} width={20} height={20}   />
                      )}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <>
                <div
                  className={cn(
                    "img-hover-zoom-container relative overflow-hidden mr-6 lg:ml-0",
                    imageSize
                      ? "max-h-[375px] lg:max-h-none"
                      : "h-[310px] md:h-[384px] lg:h-[628px] 2xl:h-[600px]"
                  )}
                  style={imageSize ? { height: imageSize.height } : undefined}
                >
                  {firstCard?.image?.mobile?.url && (
                    <Image
                      className="object-cover md:hidden img-hover-zoom"
                      src={firstCard?.image?.mobile?.url}
                      alt={firstCard?.image?.mobile?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                  {firstCard?.image?.desktop?.url && (
                    <Image
                      className="hidden object-cover md:block img-hover-zoom"
                      src={firstCard?.image?.desktop?.url}
                      alt={firstCard?.image?.desktop?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                </div>
                <div className={cn("flex flex-col gap-1 md:flex-row md:items-center md:justify-between pt-6", imageSize && "lg:px-4")}>
                  {firstCard?.subtitle && (
                    <p className="font-matter-regular ml-[18px] text-lg leading-normal md:text-[18px] lg:ml-0">{firstCard?.subtitle}</p>
                  )}
                  {firstCard?.link?.text && (
                    <span className="cta-hover-underline font-matter-regular ml-[18px] md:ml-0 md:mr-[18px] inline-flex items-center gap-2 text-lg leading-[1.5] md:text-[18px]">
                      {firstCard.link.text}
                      {firstCard?.icon?.url && (
                        <Image src={firstCard.icon.url} alt={firstCard.icon.alt || ""} width={20} height={20}   />
                      )}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Second Card */}
        <div
          className={cn(!imageSize && "flex-1", imageSize && "w-full lg:[max-width:var(--card-max-w)]")}
          style={imageSize ? ({ "--card-max-w": `${imageSize.width}px` } as React.CSSProperties) : undefined}
        >
          <div className={cn("flex size-full flex-col justify-end gap-6 pb-8 lg:pb-0", swap && "justify-end")}>
            {/* Image — right offset on mobile, reset on desktop */}
            {secondCard?.link?.url ? (
              <Link href={secondCard.link.url} className="campaign-banner-link block">
                <div
                  className={cn(
                    "img-hover-zoom-container relative overflow-hidden ml-6 lg:mr-0",
                    imageSize
                      ? "max-h-[375px] lg:max-h-none"
                      : "mt-[50px] h-[310px] md:h-[384px] lg:h-[628px] 2xl:h-[600px]"
                  )}
                  style={imageSize ? { height: imageSize.height } : undefined}
                >
                  {secondCard?.image?.mobile?.url && (
                    <Image
                      className="object-cover md:hidden img-hover-zoom"
                      src={secondCard?.image?.mobile?.url}
                      alt={secondCard?.image?.mobile?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                  {secondCard?.image?.desktop?.url && (
                    <Image
                      className="hidden object-cover md:block img-hover-zoom"
                      src={secondCard?.image?.desktop?.url}
                      alt={secondCard?.image?.desktop?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                </div>
                <div className={cn("ml-6 flex flex-col gap-1 md:flex-row md:items-center md:justify-between pt-6", swap && "lg:ml-6", imageSize && "lg:px-0")}>
                  {secondCard?.subtitle && (
                    <p className="font-matter-regular ml-[18px] text-lg leading-normal md:text-[18px]">{secondCard?.subtitle}</p>
                  )}
                  {secondCard?.link?.text && (
                    <span className="cta-hover-underline font-matter-regular ml-[18px] md:ml-0 md:mr-[18px] inline-flex items-center gap-2 text-lg leading-[1.5] md:text-[18px]">
                      {secondCard.link.text}
                      {secondCard?.icon?.url && (
                        <Image src={secondCard.icon.url} alt={secondCard.icon.alt || ""} width={20} height={20}   />
                      )}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <>
                <div
                  className={cn(
                    "img-hover-zoom-container relative overflow-hidden ml-6 lg:mr-0",
                    imageSize
                      ? "max-h-[375px] lg:max-h-none"
                      : "mt-[50px] h-[310px] md:h-[384px] lg:h-[628px] 2xl:h-[600px]"
                  )}
                  style={imageSize ? { height: imageSize.height } : undefined}
                >
                  {secondCard?.image?.mobile?.url && (
                    <Image
                      className="object-cover md:hidden img-hover-zoom"
                      src={secondCard?.image?.mobile?.url}
                      alt={secondCard?.image?.mobile?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                  {secondCard?.image?.desktop?.url && (
                    <Image
                      className="hidden object-cover md:block img-hover-zoom"
                      src={secondCard?.image?.desktop?.url}
                      alt={secondCard?.image?.desktop?.alt as string}
                      fill
                      sizes={imageSizes({ base: "100vw", lg: "50vw" })}
                    />
                  )}
                </div>
                <div className={cn("ml-6 flex flex-col gap-1 md:flex-row md:items-center md:justify-between pt-6", swap && "lg:ml-6", imageSize && "lg:px-0")}>
                  {secondCard?.subtitle && (
                    <p className="font-matter-regular ml-[18px] text-lg leading-normal md:text-[18px]">{secondCard?.subtitle}</p>
                  )}
                  {secondCard?.link?.text && (
                    <span className="cta-hover-underline font-matter-regular ml-[18px] md:ml-0 md:mr-[18px] inline-flex items-center gap-2 text-lg leading-[1.5] md:text-[18px]">
                      {secondCard.link.text}
                      {secondCard?.icon?.url && (
                        <Image src={secondCard.icon.url} alt={secondCard.icon.alt || ""} width={20} height={20}   />
                      )}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturedPair;
