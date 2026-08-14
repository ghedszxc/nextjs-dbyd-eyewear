import React, { useState } from "react";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import RichText from "@/components/RichText";

const SidebarMenu = ({ navLinks, closeSidebar }: { navLinks: any[]; closeSidebar: React.MouseEventHandler }) => {
  const [openParentLabel, setOpenParentLabel] = useState<string | null>(null);

  const activeParentIndex = navLinks.findIndex((l) => l.label === openParentLabel);
  const activeParent = activeParentIndex !== -1 ? navLinks[activeParentIndex] : undefined;
  const isShowingSubmenu = !!activeParent?.children;
  const showSubmenuLabel = isShowingSubmenu && activeParentIndex < 3;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 h-full w-full bg-dark-green shadow-lg transition-opacity duration-150 ease-in-out lg:hidden">
      <div className="flex h-full flex-col">
        <div className="flex w-full shrink-0 items-center justify-between border-b-hairline px-6 py-4 h-[80px]">
          {showSubmenuLabel ? (
            <Button variant="ghost" onClick={() => setOpenParentLabel(null)} className="-ml-6 p-0 text-white gap-[32px]">
              <svg className="size-8" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2">
                <polyline points="20,6 10,16 20,26" />
              </svg>
              <span className="text-2xl font-matter-regular">{activeParent.label}</span>
            </Button>
          ) : (
            <span />
          )}
          <Button variant="ghost" onClick={closeSidebar} className="-mr-4 p-0">
            <svg className="size-8" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2">
              <line x1="8" y1="8" x2="24" y2="24" />
              <line x1="24" y1="8" x2="8" y2="24" />
            </svg>
          </Button>
        </div>
        <div className="scrollbar-hide min-h-0 w-full flex-1 overflow-y-auto px-6 pt-8 pb-6">
          {!isShowingSubmenu && (
            <ul>
              {navLinks.map((link: any) => {
                return (
                  <li key={link.label}>
                    <button
                      className="flex w-full items-center justify-between pb-10"
                      onClick={() => setOpenParentLabel(link.children ? link.label : null)}
                    >
                      <h3 className="font-matter-regular text-2xl text-white">{link.label}</h3>
                      {link.children && <svg className="size-8" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2">
                        <polyline points="12,6 22,16 12,26" />
                      </svg>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {isShowingSubmenu && (
            <div>
              {activeParent.children
                .filter((item: any) => item.image)
                .map((item: any) => (
                  <div key={item.header} className="mb-6">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.header}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2 py-4">
                      <h3 className="font-matter-regular font-normal text-lg text-white">{item.header}</h3>
                      {item.description?.doc && Array.isArray(item.description.doc.content) && (
                        <RichText
                          doc={{
                            type: item.description.doc.type,
                            content: item.description.doc.content,
                          }}
                          className={{
                            p: "font-matter-regular text-sm font-light text-white",
                          }}
                        />
                      )}
                      {item.cta && (
                        <Link
                          href={item.cta.href}
                          className="font-matter-regular mt-2 flex flex-row items-center text-base text-white hover:underline"
                        >
                          {item.cta.text}
                          {/* <HiOutlineArrowSmRight className="h-5 w-5 text-white"/> */}
                          <ArrowRight className="ml-[3px] h-4 w-4 text-white" strokeWidth={2.3}/>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

              {!activeParent.children.some((item: any) => item.image) &&
                activeParent.children
                  .filter((item: any) => item.children && item.children.length > 0)
                  .map((item: any) => (
                    <div key={item.header} className="mb-[80px]">
                      <h3 className="font-matter-regular mb-8 text-[24px] font-normal text-white ">{item.header}</h3>
                      <ul className="flex flex-col gap-8">
                        {item.children.map((child: any) => (
                          <li key={child.label} className="group transition duration-200 ease-in-out">
                            <Link href={child.href}>
                              <div className="flex items-center gap-2">
                                <span className="font-matter-regular text-lg text-white">{child.label}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

              {activeParent.children
                .filter((item: any) => !item.image && !item.children && item.href)
                .map((item: any) => (
                  <div key={item.header} className="pb-10">
                    <Link href={item.href} className="flex w-full items-center justify-between">
                      <h3 className="font-matter-regular text-2xl text-white">{item.header}</h3>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
