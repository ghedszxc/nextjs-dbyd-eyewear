"use client";

import React, { useState } from "react";
import Image from "next/image";
import RichText from "@/components/RichText";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IGenericFullWidthBanner } from "@/models/widgets/IGenericFullWidthBanner";

const GenericFullWidthBanner = (bannerProps: IGenericFullWidthBanner) => {
  const { image, title, body, cta, video, background_color } = bannerProps;
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  // Resolve responsive images with fallback to shared image
  const desktopSrc = image?.desktop?.src || image?.src;
  const mobileSrc = image?.mobile?.src || image?.src;
  const imageAlt = image?.desktop?.alt || image?.mobile?.alt || image?.alt || "Banner Image";

  const playVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
    const videoElement = e.currentTarget.parentElement?.previousSibling as HTMLVideoElement;
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  const muteVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
    const videoElement = e.currentTarget.parentElement?.previousSibling as HTMLVideoElement;
    videoElement.muted = !videoElement.muted;
  };

  return (
    <section className="bg-linear-to-l from-[#65656500] to-[#000000]">
      <div className="relative text-black lg:text-white">
        <div>
          {video?.src ? (
            <div className="relative h-[650px] lg:h-[652px]">
              <video className="relative h-full w-full object-cover" autoPlay loop muted>
                <source src={video?.src} type={video?.type} />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div className="absolute right-auto bottom-6 left-6 flex w-fit items-center gap-6 rounded-[50px] bg-[#F7F2EABF] px-4 py-2 backdrop-blur-sm lg:right-8 lg:bottom-8 lg:left-auto">
                <Button
                  onClick={(e) => {
                    playVideo(e);
                    setIsVideoPlaying(!isVideoPlaying);
                  }}
                  className="h-6! cursor-pointer bg-transparent p-0! hover:bg-transparent"
                >
                  <Image
                    src={`${isVideoPlaying ? "/icons/video-pause-btn.svg" : "/icons/video-play-btn.svg"}`}
                    alt="Play/Pause"
                    width={24}
                    height={24}
                  />
                </Button>
                <Button
                  onClick={(e) => {
                    muteVideo(e);
                    setIsVideoMuted(!isVideoMuted);
                  }}
                  className="h-6! cursor-pointer bg-transparent p-0! hover:bg-transparent"
                >
                  <Image
                    src={`${isVideoMuted ? "/icons/video-unmuted.svg" : "/icons/video-muted.svg"}`}
                    alt="Mute/Unmute"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative h-[375px] lg:h-[652px]">
              {mobileSrc && (
                <Image className="object-cover lg:hidden" src={mobileSrc} alt={imageAlt} fill sizes="100vw"  />
              )}

              {desktopSrc && (
                <Image className="hidden object-cover lg:block" src={desktopSrc} alt={imageAlt} fill sizes="100vw"   />
              )}
            </div>
          )}
        </div>

        {/* Text Content */}
        {title && body && cta?.href && (
          <div
            style={{ backgroundColor: background_color }}
            className="flex flex-col gap-12 p-6 pr-12 lg:absolute lg:bottom-0 lg:bg-transparent! lg:gap-6 lg:p-8"
          >
            <div className="flex flex-col gap-2">
              {title && <h3 className="font-matter-regular text-2xl">{title}</h3>}
              {body && (
                <RichText
                  doc={body.doc}
                  className={{
                    p: "font-matter-regular text-sm",
                  }}
                />
              )}
            </div>
            <div className="-mr-[19px] lg:mr-0">
              {cta?.href && (
                <Button
                  asChild
                  className="flex h-[43px] w-full items-center rounded-none border border-black bg-transparent px-4 py-2 hover:bg-transparent lg:w-fit lg:border-white"
                >
                  <Link href={cta?.href}>
                    <span className="font-matter-regular text-lg text-black lg:text-white">{cta?.text}</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default GenericFullWidthBanner;
