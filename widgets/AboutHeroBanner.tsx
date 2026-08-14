import { IAboutHeroBanner } from "@/models/widgets/IAboutHeroBanner";
import RichText from "@/components/RichText";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AboutHeroBanner = ({
  image,
  subtitle,
  heading,
  body,
  cta,
  overlay,
  paddingTopMobile,
  paddingTopDesktop,
  minHeightMobile,
}: IAboutHeroBanner) => {
  return (
    <section
      className={cn(
        "relative md:min-h-[667px] lg:h-[945px]",
        paddingTopDesktop ? "lg:mt-22" : "",
        minHeightMobile ? "min-h-[var(--min-h-mobile)] md:!min-h-[667px]" : "min-h-[538px]"
      )}
      style={minHeightMobile ? ({ "--min-h-mobile": minHeightMobile } as React.CSSProperties) : undefined}
    >
      {/* Desktop image */}
      <Image src={image.desktop.url} alt={image.desktop.alt} fill sizes="100vw" className="hidden md:block" priority />
      {/* Mobile image */}
      <Image src={image.mobile.url} alt={image.mobile.alt} fill sizes="100vw" className="block object-cover md:hidden" priority />

      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlay.color,
            mixBlendMode: overlay.blendMode as React.CSSProperties["mixBlendMode"],
          }}
        />
      )}

      <div
        className={cn(
          "absolute inset-0 flex flex-col px-[24px] pb-[40px] md:block md:p-0",
          paddingTopMobile ? "pt-[127px]" : "pt-[40px]"
        )}
      >
        <div
          className={cn(
            "font-matter-regular text-white",
            "md:absolute md:left-8 md:w-[85vw]",
            paddingTopMobile ? "md:top-[127px] lg:top-12" : "md:top-12"
          )}
        >
          {subtitle && <p className="mb-6 text-sm leading-normal tracking-[1px] md:text-base">{subtitle}</p>}
          {heading && (
            <h1 className="max-w-[320px] text-4xl font-normal leading-[1.25] md:max-w-none md:pr-8 md:text-[48px]">
              {heading}
            </h1>
          )}
        </div>

        <div className="font-matter-regular mt-auto text-white md:absolute md:left-8 md:w-[85vw] md:top-auto md:!bottom-8 lg:w-[50vw]">
          {body?.doc?.content && (
            <div className="mb-6 text-base">
              <RichText
                doc={{
                  type: body.doc.type,
                  content: body.doc.content,
                }}
              />
            </div>
          )}

          {cta?.href && (
            <Link
              href={cta.href}
              className="block border border-white px-4 py-2 text-center text-lg leading-normal md:inline-block md:w-auto"
            >
              {cta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutHeroBanner;
