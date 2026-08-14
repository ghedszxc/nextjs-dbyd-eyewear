import Image from "next/image";
import Link from "next/link";
import { imageSizes } from "@/lib/image-sizes";
import RichText from "../RichText";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { ISplitBanner } from "@/models/widgets/ISplitBanner";

const SplitBanner = (bannerProps: ISplitBanner) => {
  const { layout_variant, image, title, body, subtext, cta, background_color, tabs, reversed } = bannerProps;
  const isRight = layout_variant === "split-right";
  const isDark = background_color === "#000000";    

  // Resolve responsive images with fallback to shared image
  const desktopSrc = image?.desktop?.src || image?.src;
  const mobileSrc = image?.mobile?.src || image?.src;
  const imageAlt = image?.desktop?.alt || image?.mobile?.alt || image?.alt || "";

  // Type guard to check if cta has multiple links
  const isMultipleCTA = (cta: typeof bannerProps.cta): cta is { multiple: Array<{ text: string; href: string }> } => {
    return cta !== undefined && "multiple" in cta;
  };

  return (
    <div
      className={`flex ${reversed ? "flex-col-reverse" : "flex-col"} ${isRight ? "lg:flex-row-reverse" : "lg:flex-row"} overflow-hidden lg:h-[720px]`}
    >
      {/* Image */}
      <div className="relative h-[375px] w-full md:h-[640px] lg:h-full lg:w-1/2">
        {mobileSrc && (
          <Image className="object-cover lg:hidden" src={mobileSrc} alt={imageAlt} fill sizes={imageSizes({ base: "100vw", lg: "50vw" })} />
        )}
        {desktopSrc && (
          <Image className="hidden object-cover lg:block" src={desktopSrc} alt={imageAlt} fill sizes={imageSizes({ base: "100vw", lg: "50vw" })} />
        )}
      </div>

      {/* Content */}
      <div
        className={`flex h-full w-full flex-col justify-between gap-12 p-6 pr-12 lg:w-1/2 lg:gap-0 lg:p-8 ${isDark ? "text-white" : "text-black"}`}
        style={{ backgroundColor: background_color }}
      >
        {tabs?.length ? (
          <div className="flex flex-1 flex-col">
            <Tabs defaultValue={tabs[0].key} className="flex h-full min-h-40 flex-col">
              <TabsList className="flex gap-6 bg-transparent p-0">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="font-matter-regular data-[state=active]:font-matter-bold cursor-pointer rounded-none bg-transparent px-0 pt-0 pb-1 text-sm underline-offset-1 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none!"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((t) => (
                <TabsContent key={t.key} value={t.key} className="flex flex-1 flex-col justify-center gap-6">
                  {t.title && <h3 className="font-matter-regular text-2xl">{t.title}</h3>}
                  {t.body && <p className="font-matter-regular text-sm">{t.body}</p>}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="flex h-full">
            <div className="flex flex-col gap-2">
              {title && <h3 className="font-matter-regular text-2xl">{title}</h3>}
              {body?.doc && <RichText doc={body.doc} className={{ p: "font-matter-regular text-sm" }} />}
            </div>
          </div>
        )}

        <div className="-mr-[19px] lg:mr-0">
          {isMultipleCTA(cta) ? (
            // Multiple CTAs - render as button group
            <div className="flex flex-row gap-4">
              {cta.multiple.map((link, i) => (
                <Button
                  key={i}
                  asChild
                  className="flex h-[43px] w-auto items-center rounded-none border border-black bg-transparent px-4 py-2 hover:bg-[#F7F2EA66] lg:w-fit"
                >
                  <Link href={link.href}>
                    <span className="font-matter-regular text-lg text-black">{link.text}</span>
                  </Link>
                </Button>
              ))}
            </div>
          ) : cta?.href ? (
            // Single CTA
            <Button
              asChild
              className="flex h-[43px] w-full items-center rounded-none border border-black bg-transparent px-4 py-2 hover:bg-[#F7F2EA66] lg:w-fit"
            >
              <Link href={cta.href}>
                <span className="font-matter-regular text-lg text-black">{cta.text}</span>
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SplitBanner;
