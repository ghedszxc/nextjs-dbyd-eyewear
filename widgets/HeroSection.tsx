import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IHeroSection } from "@/models/widgets/IHeroSection";
import RichText from "@/components/RichText";
import { Button } from "@/components/ui/button";

const HeroSection = ({
  titleDesktop,
  titleMobile1,
  titleMobile2,
  body,
  visual,
  links,
  isVideo = false,
  bodyMaxWidth,
}: IHeroSection) => {
  return (
    <section>
      <div className="relative mx-auto h-auto w-full lg:h-screen lg:p-8">
        <div className="relative h-[500px]">
          {/* Visual - Mobile*/}
          {visual?.mobile.url && (
            <Image
              src={visual?.mobile?.url}
              alt={visual?.mobile?.alt}
              fill
              sizes="100vw"
              className="object-cover lg:hidden"
              priority
            />
          )}
        </div>
        {/* Visual - Desktop*/}
        {visual?.desktop.url && (
          <Image
            src={visual?.desktop?.url}
            alt={visual?.desktop?.alt}
            fill
            sizes="100vw"
            className="hidden object-cover lg:block"
            priority
          />
        )}

        {/* Text Content */}
        <div className="flex h-auto flex-col bg-white pb-6 text-black lg:absolute lg:bottom-8 lg:h-auto lg:bg-transparent lg:p-0 lg:pb-0 lg:text-white p-6">
          <div className="mb-1">
            {titleDesktop && <h2 className="font-matter-regular hidden text-2xl lg:block">{titleDesktop}</h2>}
            {titleMobile1 && <h2 className="font-matter-regular text-2xl lg:hidden">{titleMobile1}</h2>}
            {titleMobile2 && <h2 className="font-matter-regular text-2xl lg:hidden">{titleMobile2}</h2>}
          </div>
          {body && (
            <div style={bodyMaxWidth ? { maxWidth: bodyMaxWidth } : undefined}>
              <RichText
                doc={{
                  type: body.doc.type,
                  content: body.doc.content,
                }}
                className={{
                  p: "font-matter-regular text-sm last:mb-6",
                }}
              />
            </div>
          )}
          {/* Links */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {links &&
              links?.map((link, index: number) => (
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-none border-black bg-transparent px-4 py-2 text-black transition-none lg:border-white lg:text-white lg:hover:bg-[#F7F2EA66] lg:hover:text-white"
                  key={index}
                >
                  <Link href={link?.url}>
                    <span className="font-matter-regular text-lg">{link.text}</span>
                  </Link>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
