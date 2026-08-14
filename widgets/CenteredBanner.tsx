import React from "react";
import { ICenteredBanner } from "@/models/widgets/ICenteredBanner";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/RichText";
import VideoPlayer from "@/components/VideoPlayer";
import { cn } from "@/lib/utils";

const CenteredBanner = ({
  title,
  body,
  name,
  image,
  cta,
  isVideo = false,
  noTeaserText = false,
  marginTop = 0,
  paddingBottom = false,
  imageHeight,
  mobileImageHeight,
  responsiveImage = false,
  containerHeight,
}: ICenteredBanner) => {
  return (
    <section
      style={{ marginTop: marginTop && `${marginTop}px` }}
      className={cn("w-full", paddingBottom && "pb-8 lg:pb-20")}
    >
      {containerHeight && (
        <style>{`
          @media (min-width: 1700px) {
            [style*="--container-h"] {
              height: var(--container-h) !important;
            }
          }
        `}</style>
      )}
      <div
        className={cn("relative w-full", responsiveImage && "h-[650px] md:h-auto")}
        style={{
          ...(!responsiveImage ? { height: imageHeight || "650px" } : {}),
          ...(containerHeight ? { ['--container-h' as string]: containerHeight } : {}),
        }}
      >
        {/* Mobile Image/Video */}
        {image?.mobile?.url &&
          (isVideo ? (
            <div className="block h-full w-full md:hidden">
              <VideoPlayer src={image.mobile.url} className="h-full w-full object-cover" />
            </div>
          ) : (
            <Image
              src={image.mobile.url}
              alt={image.mobile.alt as string}
              fill
              sizes="100vw"
              className="block object-cover md:hidden"
            />
          ))}

        {/* Desktop Image/Video */}
        {image?.desktop?.url &&
          (isVideo ? (
            <div className="hidden h-full w-full md:block">
              <VideoPlayer src={image.desktop.url} className="h-full w-full object-cover" />
            </div>
          ) : responsiveImage ? (
            <Image
              src={image.desktop.url}
              alt={image.desktop.alt || ""}
              width={0}
              height={0}
              sizes="100vw"
              className="hidden h-auto w-full md:block md:h-full md:object-cover"
               
            />
          ) : (
            <Image
              src={image.desktop.url}
              alt={image.desktop.alt as string}
              fill
              sizes="100vw"
              className="hidden object-cover md:block"
               
            />
          ))}
      </div>

      {/* Text Section Below Image */}
      {!noTeaserText && (
        <div className="bg-white px-6 py-8 lg:px-20 lg:py-20">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            {title && <h4 className="font-matter-regular text-2xl leading-normal lg:flex-1">{title}</h4>}

            <div className="flex flex-col gap-4 lg:flex-1">
              {body && (
                <RichText
                  doc={{
                    type: body.doc.type,
                    content: body.doc.content,
                  }}
                  className={{
                    p: "font-matter-regular text-base leading-normal lg:text-sm",
                  }}
                />
              )}

              {cta?.href && (
                <Link href={cta.href} className="font-matter-regular text-base underline">
                  {cta.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CenteredBanner;
