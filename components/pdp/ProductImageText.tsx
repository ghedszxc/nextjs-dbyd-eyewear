import Image from "next/image";
import Link from "next/link";
import { imageSizes } from "@/lib/image-sizes";
import RichText from "../RichText";
import { Button } from "../ui/button";
import { IProductImageTextCollection } from "@/models/widgets/IProductImageText";

export function ProductImageText({ banners, direction }: IProductImageTextCollection) {
  return (
    // Mobile & Tablet: no height constraints | Desktop (lg): fixed height
    <div className="overflow-hidden lg:min-h-[579px] lg:max-h-[652px] lg:h-[662px]">
      {banners && banners?.map((banner, index: number) => (
        // Mobile & Tablet: flex column stacking 
        <div className="flex flex-col lg:grid lg:size-full lg:overflow-hidden lg:grid-cols-12" key={index}>

          {/* Tablet view   */}
          <div className={"relative h-[375px] md:h-[810px] lg:h-auto lg:col-span-6" + (direction == "rtl" ? " lg:order-2" : "")}>
            <Image src={banner.imageSrc} alt={banner.imageAlt} fill sizes={imageSizes({ base: "100vw", lg: "50vw" })} className="object-cover" />
          </div>

          {/* Text — Mobile & Tablet (md): block below image */}
          <div className={"relative lg:col-span-6 bg-[#fff] text-black" + (direction == "rtl" ? " lg:order-1" : "")}>
            <div className="flex justify-start h-full flex-col p-6 lg:p-12 lg:justify-center">
              {/*Tablet view end */}
              <div className="flex flex-col gap-4">
                <h3 className="font-matter-regular text-[24px]">{banner.title}</h3>
                <RichText
                  doc={{
                    type: banner.description?.type,
                    content: banner.description?.content,
                  }}
                  className={{
                    p: "font-matter-regular text-[14px] text-black/90",
                    div:"text-[14px]",
                  }}
                />
              </div>
              {banner.links &&
                <div className="lg:absolute lg:bottom-[32px]">
                  {
                    banner.links?.map((link, index: number) => (
                      <Button
                        asChild
                        variant="outline"
                        className="h-10 rounded-none text-black border-black bg-transparent px-4 py-2 w-[100%] mt-6 me-[16px] md:text-lg lg:w-auto lg:hover:bg-transparent/80 lg:hover:text-black "
                        key={index}
                      >
                        <Link href={link?.url}>
                          <span className="font-matter-regular text-lg">{link.text}</span>
                        </Link>
                      </Button>
                    ))
                  }
                </div>
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductImageText;
