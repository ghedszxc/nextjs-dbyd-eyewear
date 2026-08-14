import React from 'react'
import Image from "next/image";
import RichText from '../RichText';
import Link from 'next/link';
//import { HiOutlineArrowSmRight } from 'react-icons/hi';
import { ArrowRight } from 'lucide-react';

const CollectionBanners = ({collectionBanner, imageLoaded, setImageLoaded, activeLabel, sizes}: {collectionBanner: any, imageLoaded: boolean, setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>, activeLabel: string | null, sizes?: string}) => {
  return (
    <div key={collectionBanner.header} className="collection-banner-card flex h-full flex-col gap-4 pb-6">
      <div
        className={`relative h-64 w-full overflow-hidden transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <Image
          src={collectionBanner.image}
          alt={collectionBanner.header || activeLabel || "Collection banner"}
          fill
          sizes={sizes ?? "25vw"}
          className="object-cover h-full img-hover-zoom"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="flex grow flex-col gap-6 px-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-matter-regular text-lg text-white lg:text-xl">{collectionBanner.header}</h3>

          {collectionBanner.description?.doc && Array.isArray(collectionBanner.description.doc.content) && (
            <RichText
              doc={{
                type: collectionBanner.description.doc.type,
                content: collectionBanner.description.doc.content,
              }}
              className={{
                p: "font-matter-regular text-sm font-light text-white",
              }}
            />
          )}
        </div>
        <Link
          href={collectionBanner.cta.href}
          className="font-matter-regular mt-auto text-lg text-white flex flex-row items-center hover:cursor-pointer"
        >
          <span className="cta-hover-underline">
            {collectionBanner.cta.text}
          </span>
          {/* <HiOutlineArrowSmRight className="text-white w-6 h-6"/> */}
          <ArrowRight className="ml-[2px] text-white w-5 h-5" strokeWidth={2.3}/>
        </Link>
      </div>
    </div>
  );
}

export default CollectionBanners