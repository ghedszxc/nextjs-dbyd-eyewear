import React from "react";
import { ICampaignBanner } from "@/models/widgets/ICampaignBanner";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

const CampaignBanner = ({ title, body, name, image, cta, position, bgColor, imageMaxWidth, mobileImage }: ICampaignBanner) => {
  return (
    <section>
      <div className="relative text-black" style={{ backgroundColor: bgColor || "#ffffff" }}>
        <div className="flex flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-20 lg:pt-20 lg:pb-12">
          {title && <h4 className="font-matter-regular text-2xl leading-normal lg:flex-1">{title}</h4>}

          {body && (
            <div className="lg:flex-1">
              <RichText
                doc={{
                  type: body.doc.type,
                  content: body.doc.content,
                }}
                className={{
                  p: "font-matter-regular text-base leading-normal",
                }}
              />
            </div>
          )}
        </div>

        <div className="flex py-4 lg:py-8">
          {position === "right" && (
            <div className="hidden w-[200px] shrink-0 lg:block 2xl:hidden" aria-hidden="true" />
          )}

          <div
            className={`flex-1 campaign-banner-image${position === "right" ? " campaign-banner-image--right" : ""}`}
            style={{
              maxWidth: imageMaxWidth ? `${imageMaxWidth}px` : undefined,
              ...(mobileImage ? {
                '--m-img-w': `calc(${mobileImage.width} / 375 * 100vw)`,
                '--m-img-h': `${mobileImage.height}px`,
                '--m-img-offset': `calc(${mobileImage.offset} / 375 * 100vw)`,
                '--m-img-w-px': `${mobileImage.width}px`,
                '--m-img-offset-px': `${mobileImage.offset}px`,
              } as React.CSSProperties : {}),
            }}
          >
            {cta?.href ? (
              <Link href={cta.href} className="campaign-banner-link block">
                <div
                  className={cn(
                    "img-hover-zoom-container relative overflow-hidden",
                    mobileImage
                      ? "h-[var(--m-img-h)] w-[var(--m-img-w)] ml-[var(--m-img-offset)] md:h-[384px] md:w-full md:ml-0 md:max-w-none lg:h-[600px]"
                      : "h-[327px] w-full lg:h-[600px]"
                  )}
                >
                  {image?.mobile?.url && (
                    <Image
                      src={image?.mobile?.url}
                      alt={image?.mobile?.alt as string}
                      fill
                      sizes="100vw"
                      className="block object-cover md:hidden img-hover-zoom"
                    />
                  )}
                  {image?.desktop?.url && (
                    <Image
                      src={image?.desktop?.url}
                      alt={image?.desktop?.alt as string}
                      fill
                      sizes="100vw"
                      className="hidden object-cover md:block img-hover-zoom"
                       
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:pt-6",
                    mobileImage
                      ? "pl-[calc(var(--m-img-offset)+16px)] pr-6 md:px-6"
                      : "px-6"
                  )}
                >
                  {name && <p className="font-matter-regular text-lg">{name}</p>}
                  <span className="cta-hover-underline font-matter-regular text-lg">
                    {cta?.text}
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <div
                  className={cn(
                    "img-hover-zoom-container relative overflow-hidden",
                    mobileImage
                      ? "h-[var(--m-img-h)] w-[var(--m-img-w)] ml-[var(--m-img-offset)] md:h-[384px] md:w-full md:ml-0 md:max-w-none lg:h-[600px]"
                      : "h-[327px] w-full lg:h-[600px]"
                  )}
                >
                  {image?.mobile?.url && (
                    <Image
                      src={image?.mobile?.url}
                      alt={image?.mobile?.alt as string}
                      fill
                      sizes="100vw"
                      className="block object-cover md:hidden img-hover-zoom"
                    />
                  )}
                  {image?.desktop?.url && (
                    <Image
                      src={image?.desktop?.url}
                      alt={image?.desktop?.alt as string}
                      fill
                      sizes="100vw"
                      className="hidden object-cover md:block img-hover-zoom"
                       
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:pt-6",
                    mobileImage
                      ? "pl-[calc(var(--m-img-offset)+16px)] pr-6 md:px-6"
                      : "px-6"
                  )}
                >
                  {name && <p className="font-matter-regular text-lg">{name}</p>}
                </div>
              </>
            )}
          </div>

          {position !== "right" && (
            <div className="hidden w-[200px] shrink-0 lg:block 2xl:hidden" aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
};
export default CampaignBanner;
