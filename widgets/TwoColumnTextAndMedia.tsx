import { ITwoColumnTextAndMedia } from "@/models/widgets/ITwoColumnTextAndMedia";
import Image from "next/image";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";
import { imageSizes } from "@/lib/image-sizes";

const TwoColumnTextAndMedia = ({
  title,
  subtitle,
  image,
  leftImage = false,
  mobileTextTop = false,
  mt,
  mb,
  px,
  responsiveImage = false,
  containerHeight,
  subtitleClassName,
}: ITwoColumnTextAndMedia) => {
  if (!title && !subtitle && !image?.desktop?.url && !image?.mobile?.url) return null;

  const imageOrder = leftImage
    ? `md:order-1 ${px !== undefined ? "md:mr-0" : "md:mr-1"}`
    : `md:order-2 ${px !== undefined ? "md:ml-0" : "md:ml-1"}`;
  const textOrder = leftImage ? "md:order-2" : "md:order-1";
  const mobileImageOrder = mobileTextTop ? "order-2" : "order-1";
  const mobileTextOrder = mobileTextTop ? "order-1" : "order-2";

  return (
    <section>
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
        className="grid w-full grid-cols-1 md:grid-cols-2"
        style={containerHeight ? { ['--container-h' as string]: containerHeight } as React.CSSProperties : undefined}
      >
        <div
          className={cn(
            "relative lg:mt-0",
            mt === undefined ? "mt-1 lg:mt-8" : "",
            mb === undefined ? "md:mb-1" : "",
            responsiveImage ? "h-[375px] overflow-hidden md:h-auto" : "h-[375px] md:h-[652px]",
            mobileImageOrder,
            imageOrder
          )}
          style={{
            ...(mt !== undefined ? { marginTop: mt } : {}),
            ...(mb !== undefined ? { marginBottom: mb } : {}),
          }}
        >
          {image?.mobile?.url && (
            <Image src={image.mobile.url} alt={image.mobile.alt || ""} fill sizes="100vw" className="block object-cover md:hidden" />
          )}
          {image?.desktop?.url && (
            responsiveImage ? (
              <Image
                src={image.desktop.url}
                alt={image.desktop.alt || ""}
                width={0}
                height={0}
                sizes={imageSizes({ base: "100vw", md: "50vw" })}
                className="hidden h-auto w-full md:block md:h-full md:object-cover"
                 
              />
            ) : (
              <Image
                src={image.desktop.url}
                alt={image.desktop.alt || ""}
                fill
                sizes={imageSizes({ base: "100vw", md: "50vw" })}
                className="hidden object-cover md:block"
              />
            )
          )}
        </div>

        <div
          className={`flex items-center justify-center px-[24px] py-[24px] lg:px-20 lg:pt-20 lg:pb-20 ${mobileTextOrder} ${textOrder}`}
        >
          <div className="flex flex-col gap-4">
            {title && <h4 className="font-matter-regular text-4xl leading-normal lg:text-5xl">{title}</h4>}
            {subtitle && (
              <RichText
                doc={{
                  type: subtitle.doc.type,
                  content: subtitle.doc.content,
                }}
                className={{
                  p: `font-matter-regular text-base ${subtitleClassName ? `lg:${subtitleClassName}` : ""} !leading-[24px] text-[#000000]`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoColumnTextAndMedia;
