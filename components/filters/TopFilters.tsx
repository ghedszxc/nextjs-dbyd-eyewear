"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Image from "next/image";
import { safeJsonParse } from "@/lib/utils";

type FilterKey = "lensType" | "gender" | "ageGroup" | "frameMaterial" | "frameColour" | "frameShape" | "lensColour" | "faceCoverage" | "bridgeChoice";
// | "frameSize";

type FilterOption = {
  label: string;
  description?: string;
  value: string; // lowercase, spaces preserved
  icon?: string;
  smallText?: string;
  ageGroup?: string; //for differentiating Adults and Teens gender
};

type FilterConfig = Record<
  FilterKey,
  {
    title: string;
    options: FilterOption[];
  }
>;

type SelectedFilters = Record<FilterKey, string[]>;

const CONFIG: FilterConfig = {
  lensType: {
    title: "Filter for",
    options: [
      { label: "Eyeglasses", value: "Eyeglasses" },
      { label: "Sunglasses", value: "Sunglasses" }
    ]
  },

  gender: {
    title: "Style for",
    options: [
      { label: "Female", value: "Female", ageGroup: "adultsF" },
      { label: "Male", value: "Male", ageGroup: "adultsM" },
      { label: "Unisex", value: "Unisex", ageGroup: "adultsU" },
      { label: "Boys", value: "Male", ageGroup: "teensM" },
      { label: "Girls", value: "Female", ageGroup: "teensF" },
    ]
  },

  ageGroup: {
    title: "Age Group",
    options: [
      { label: "Adults", value: "Adults" },
      { label: "Teens", value: "Teens (11-13)" }
    ]
  },

  frameMaterial: {
    title: "Frame Material",
    options: [
      { label: "Bio-Acetate", value: "Bio-acetate", smallText: "Made with at least 61% bio-carbon content representing the amount of carbon coming from plant vs. fossil-based sources" },
      { label: "Titanium", value: "Titanium" },
      { label: "Stainless Steel", value: "Stainless steel" },
      { label: "Recycled Metal", value: "Recycled metal", smallText: "Made with 60% recycled content" },
    ],
  },

  frameColour: {
    title: "Frame Colour",
    options: [
      { label: "Black", value: "Black" },
      { label: "Brown", value: "Brown" },
      { label: "Grey", value: "Grey" },
      { label: "Blue", value: "Blue" },
      { label: "Green", value: "Green" },
      { label: "Pink", value: "Pink" },
      { label: "Purple", value: "Purple" },
      { label: "Gold", value: "Gold" },
      { label: "Silver", value: "Silver" },
      { label: "Clear", value: "Clear" },
      { label: "Burgundy", value: "Burgundy" },
      { label: "Bronze", value: "Bronze" },
      { label: "Havana", value: "Havana" }
    ],
  },

  frameShape: {
    title: "Frame Shape",
    options: [
      { icon: "/icons/filter/pantos.svg", label: "Pantos", value: "Pantos" },
      { icon: "/icons/filter/square.svg", label: "Square", value: "Square" },
      { icon: "/icons/filter/rectangle.svg", label: "Rectangle", value: "Rectangle" },
      { icon: "/icons/filter/pilot.svg", label: "Pilot", value: "Pilot" },
      { icon: "/icons/filter/oval.svg", label: "Oval", value: "Oval" },
      { icon: "/icons/filter/round.svg", label: "Round", value: "Round" },
      { icon: "/icons/filter/irregular.svg", label: "Irregular", value: "Irregular" },
      { icon: "/icons/filter/cateye.svg", label: "Cat-eye", value: "Cat Eye" },
    ],
  },

  lensColour: {
    title: "Lens Colour",
    options: [
      { label: "Grey", value: "GREY" },
      { label: "Green", value: "GREEN" },
      { label: "Brown", value: "BROWN" },
      { label: "Blue", value: "BLUE" },
      { label: "Pink", value: "PINK" },
      { label: "Purple", value: "PURPLE" }
    ]
  },

  faceCoverage: {
    title: "Face Coverage",
    options: [
      { label: "Petite", value: "Petite", smallText: "Frames are made with bio-based acetate containing at least 61% bio-carbon content." },
      { label: "Standard", value: "Standard" },
      { label: "Generous", value: "Brown" },
    ]
  },

  bridgeChoice: {
    title: "Bridge Choice & Nosepads",
    options: [
      { label: "High bridge fit", value: "High", description: "Offers a more secure and comfortable fit for those with a high nose bridge and lower cheekbones. A good choice if the bridge of your nose is above the level of your pupils." },
      { label: "Low bridge fit", value: "Low", description: "Offers a more secure and comfortable fit for those with a low nose bridge and higher cheekbones. A good choice if eyewear tends to slide down your nose, sit too low, or press on your temples or cheeks." },
      { label: "Universal fit", value: "Universal", description: "This option accommodates most face shapes." },
      { label: "Adjustable nose pads", value: "Adjustable", description: "This option accommodates most face shapes." }
    ]
  }
};

const EMPTY_SELECTED: SelectedFilters = {
  lensType: [],
  gender: [],
  ageGroup: [],
  frameMaterial: [],
  frameColour: [],
  frameShape: [],
  lensColour: [],
  faceCoverage: [],
  bridgeChoice: []
  // frameSize: [],
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function countSelected(selected: SelectedFilters) {
  return Object.values(selected).reduce((acc, arr) => acc + arr.length, 0);
}

/**
 * Writes the selected filters into URLSearchParams using dot keys:
 * - attributes.FRAME_MATERIAL=val,val
 * - attributes.FRAME_COLOUR=val,val
 * - attributes.FRAME_SHAPE=val,val
 * - attributes.FRAME_SIZE=val,val
 *
 * Empty selections are removed from the URL.
 */
function upsertAttributeParams(params: URLSearchParams, selected: SelectedFilters) {
  const map: Record<FilterKey, string> = {
    lensType: "attributes.LENS_TYPE",
    gender: "attributes.GENDER",
    ageGroup: "attributes.AGE_GROUP",
    frameMaterial: "attributes.FRAME_MATERIAL",
    frameColour: "attributes.FRONT_FRAME_COLOR",
    frameShape: "attributes.FRAME_SHAPE",
    lensColour: "attributes.LENS_COLOR_DESCRIPTION",
    faceCoverage: "attributes.FACE_COVERAGE",
    bridgeChoice: "attributes.BRIDGE_CHOICE"
    // frameSize: "attributes.FRAME_SIZE",
  };

  (Object.keys(map) as FilterKey[]).forEach((key) => {

    const paramKey = map[key];
    const values = selected[key];

    if (!values || values.length === 0) {
      params.delete(paramKey);
      return;
    }

    // join as "string,string"
    params.set(paramKey, values.join(","));
  });

  return params;
}

type TopFiltersProps = {
  /** Optional: called when user clicks "See results" (in addition to URL update) */
  onApply?: (selected: SelectedFilters) => void;
  lang?: string
  category?: string[];
  triggerLabel?: string;
  resultsCount?: number;
  className?: string;
  filterConfig?: any
};

export default function TopFilters({ filterConfig, onApply, triggerLabel = "Filter", lang, category, resultsCount, className }: TopFiltersProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedFilters>(EMPTY_SELECTED);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productCount, setProductCounts] = useState<number>(0);
  const [activeAgeGroup, setActiveAgeGroup] = useState<String[]>([]);
  const [isSelectedEmpty, setIsSelectedEmpty] = useState<Boolean>(true);
  const prevItemsRef = useRef(selected.ageGroup);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearAll = () => {
    setSelected(EMPTY_SELECTED);
    setActiveAgeGroup([]);
    setProductCounts(0);

    // also clear from URL immediately
    const params = new URLSearchParams(searchParams.toString());
    params.delete("attributes.LENS_TYPE");
    params.delete("attributes.GENDER");
    params.delete("attributes.AGE_GROUP");
    params.delete("attributes.FRAME_MATERIAL");
    params.delete("attributes.FRONT_FRAME_COLOR");
    params.delete("attributes.FRAME_SHAPE");
    params.delete("attributes.LENS_COLOR_DESCRIPTION");
    params.delete("attributes.FACE_COVERAGE")
    params.delete("attributes.BRIDGE_CHOICE")
    // params.delete("attributes.FRAME_SIZE");

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setOpen(false)
    router.refresh()
  };

  const selectGenderFilter = (key: FilterKey, option: string, ageGroup?: string) => {
    if (ageGroup) {
      setActiveAgeGroup((prevItems) =>
        prevItems.includes(ageGroup)
          ? prevItems.filter((id) => id !== ageGroup) // Remove if exists
          : [...prevItems, ageGroup]                 // Add if missing
      );
    } else {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: toggleValue(prev["gender"], option),
      }))
    }
  }

  const selectFilter = (key: FilterKey, option: string, ageGroup?: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: toggleValue(prev[key], option),
    }))
  }

  const checkActiveAgeGroup = (ageGroup?: string) => {
    if (ageGroup) {
      return activeAgeGroup.includes(ageGroup);
    } else {
      return;
    }
  }

  const isAgeFilterEnabled = (ageGroup?: string) => {
    if (activeAgeGroup.length == 0) {
      return true
    }

    if (ageGroup == "Adults") {
      if (activeAgeGroup.includes("adultsM") || activeAgeGroup.includes("adultsF") || activeAgeGroup.includes("adultsU")) {
        return true;
      } else {
        return false;
      }
    }
    if (ageGroup == "Teens (11-13)") {
      if (activeAgeGroup.includes("teensM") || activeAgeGroup.includes("teensF")) {
        return true;
      } else {
        return false;
      }
    }
  }

  const apply = () => {
    onApply?.(selected);

    const params = new URLSearchParams(searchParams.toString());
    upsertAttributeParams(params, selected);

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

    setOpen(false);
  };

  const handleMouseEnter = (text: any, id: FilterKey, selectedFilter: string) => {
    const smallTextContainer = document.getElementById(selectedFilter) as HTMLElement;
    const newTextNode = document.createTextNode(text);
    if (!selected[id].includes(selectedFilter)) {
      if (text) {
        if (smallTextContainer) {
          smallTextContainer.appendChild(newTextNode);
        }
      }
    }
  }

  const handleMouseLeave = (id: FilterKey, selectedFilter: string) => {
    const smallTextContainer = document.getElementById(selectedFilter) as HTMLElement;
    if (!selected[id].includes(selectedFilter)) {
      if (smallTextContainer) {
        Array.from(smallTextContainer.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.remove();
          }
        });
      }
    }
  }

  const handleToggle = (text: any, id: FilterKey, selectedFilter: string) => {
    const smallTextContainer = document.getElementById(selectedFilter) as HTMLElement;
    const newTextNode = document.createTextNode(text);
    if (text && selected[id].includes(selectedFilter) && smallTextContainer.childNodes.length == 0) {
      if (smallTextContainer) {
        smallTextContainer.appendChild(newTextNode);
      }
    } else if (selected[id].includes(selectedFilter) && smallTextContainer.childNodes.length > 0) {
      Array.from(smallTextContainer.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.remove();
        }
      });
    }

  }

  //check category and disable filters accordingly
  const checkLensCategory = () => {
    const lensCategories = ["eyeglasses", "sunglasses", "sun", "optical"];
    return lensCategories.some(el => pathname.includes(el));
  }

  //check category and disable filters accordingly
  const checkAgeGroup = () => {
    const ageGroupCateories = ["adult", "teens"];
    return ageGroupCateories.some(el => pathname.includes(el))
  }

  // const renderCheckBoxFilters = (key: FilterKey) => {
  //   const col = CONFIG[key];

  //   return (
  //     <div key={key} className="min-w-0">
  //       <Accordion type="multiple" className="w-full">
  //         <AccordionItem key={key} value={key}>
  //           <AccordionTrigger className="text-white text-xl font-normal font-matter-regular bg-clip-text hover:no-underline [&>svg]:invert">
  //             {col.title}
  //           </AccordionTrigger>
  //           <AccordionContent className="pb-0">
  //             <div className={"grid grid-cols-1 gap-[16px] mt-4 items-start"}>
  //               {col.options.map((opt, index) => {
  //                 const checked = selected[key].includes(opt.value);

  //                 return (
  //                   <label key={opt.value} className={"flex-auto flex-nowrap cursor-pointer select-none bg-gray-200 text-black py-6 px-4 border border-gray-200"}>
  //                     <Checkbox
  //                       checked={checked}
  //                       onCheckedChange={() =>
  //                         setSelected((prev) => ({
  //                           ...prev,
  //                           [key]: toggleValue(prev[key], opt.value),
  //                         }))
  //                       }
  //                       className="mt-0.5 me-[24px] rounded-full border border-black"
  //                     />
  //                     {opt.icon && <img src={opt.icon} className="inline-block me-[16px]" />}
  //                     <span className="text-[18px] inline-block mb-[8px]">
  //                       {opt.label}
  //                     </span>
  //                     {opt.description && <p className="ms-[40px]">{opt.description}</p>}
  //                   </label>
  //                 );
  //               })}
  //             </div>
  //           </AccordionContent>
  //         </AccordionItem>
  //       </Accordion>

  //       <Separator className="bg-black !h-[0.5px] mt-[20px]" />
  //     </div>
  //   );
  // };

  //lens colour is only relevant for sunglasses, so disable it for eyeglasses
  
  const isEyeglassesCategory = pathname.includes("eyeglasses") || pathname.includes("optical");

  const renderFilters = (key: FilterKey, desktopColumns: any, mobileColumns: any) => {
    const col = CONFIG[key];

    const variantStyles: Record<string, string> = {
      col1: "grid-cols-1",
      col2: "grid-cols-2",
      col3: "grid-cols-3",
      col4: "grid-cols-4"
    };


    return (
      <div key={key} className="min-w-0">
        <p className="text-[20px] font-normal font-matter-regular pt-[32px] pb-[24px] lg:pb-[16px]">{col.title}</p>

        <div className={`grid gap-[16px] pb-[32px] ${variantStyles[mobileColumns]} items-start lg:${variantStyles[desktopColumns]}`}>
          {col.options.map((opt, index) => {
            const checked = selected[key].includes(opt.value);

            return (
              <label key={opt.value} className={"flex-auto flex-nowrap cursor-pointer select-none text-center bg-transparent text-black py-2 px-4 border border-black rounded-full has-aria-checked:bg-[#3A3A2C] has-aria-checked:text-white lg:hover:bg-gray-200 lg:hover:border-gray-200"}>
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => selectFilter(key, opt.value)}
                  className="peer mt-0.5 invisible absolute"
                />
                <span className="font-matter-regular text-[18px]">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>

        <Separator className="bg-black !h-[0.5px]" />
      </div>
    );
  };

  //filter specific to gender category
  const renderGenderFilters = (key: FilterKey, desktopColumns: any, mobileColumns: any) => {
    const col = CONFIG[key];

    const variantStyles: Record<string, string> = {
      col1: "grid-cols-1",
      col2: "grid-cols-2",
      col3: "grid-cols-3",
      col4: "grid-cols-4"
    };

    const genderCategories = ["male", "female", "unisex"];
    const isGenderCollection = genderCategories.some(el => pathname.includes(el));
    const isTeensCategory = pathname.includes("teens");

    return (
      <div key={key} className="min-w-0">
        <p className="text-[20px] font-normal font-matter-regular pt-[32px] pb-[24px] lg:pb-[16px]">{col.title}</p>

        <div className={`grid gap-[16px] pb-[32px] ${variantStyles[mobileColumns]} items-start lg:${variantStyles[desktopColumns]}`}>
          {col.options.map((opt, index) => {
            const checked = selected[key].includes(opt.value);

            if (isGenderCollection) {
              if (opt.ageGroup == "teensM" || opt.ageGroup == "teensF") {
                return;
              }
              if (pathname.split("/").includes(opt.value.toLowerCase())) {
                return (
                  <label key={opt.label} className={"flex-auto flex-nowrap cursor-pointer select-none text-center bg-transparent text-black py-2 px-4 border border-black rounded-full has-aria-checked:bg-[#3A3A2C] has-aria-checked:text-white lg:hover:bg-gray-200 lg:hover:border-gray-200"}>
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => selectFilter(key, opt.value)}
                      className="peer mt-0.5 invisible absolute"
                    />
                    <span className="font-matter-regular text-[18px]">
                      {opt.label}
                    </span>
                  </label>
                );
              } else {
                return;
              }
            } else if (isTeensCategory) {
              if (opt.ageGroup == "adultsM" || opt.ageGroup == "adultsF") {
                return;
              } else {
                return (
                  <label key={opt.label} className={`flex-auto flex-nowrap cursor-pointer ${opt.value == "Unisex" ? "order-1" : ""} select-none text-center bg-transparent text-black py-2 px-4 border border-black rounded-full has-aria-checked:bg-[#3A3A2C] has-aria-checked:text-white lg:hover:bg-gray-200 lg:hover:border-gray-200`}>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => selectFilter(key, opt.value)}
                      className="peer mt-0.5 invisible absolute"
                    />
                    <span className="font-matter-regular text-[18px]">
                      {opt.label}
                    </span>
                  </label>
                );
              }
            } else {
              return (
                <label key={opt.label} className={"flex-auto flex-nowrap cursor-pointer select-none text-center bg-transparent text-black py-2 px-4 border border-black rounded-full has-aria-checked:bg-[#3A3A2C] has-aria-checked:text-white lg:hover:bg-gray-200 lg:hover:border-gray-200"}>
                  <Checkbox
                    checked={checkActiveAgeGroup(opt.ageGroup)}
                    onCheckedChange={() => selectGenderFilter(key, opt.value, opt.ageGroup)}
                    className="peer mt-0.5 invisible absolute"
                  />
                  <span className="font-matter-regular text-[18px]">
                    {opt.label}
                  </span>
                </label>
              );
            }
          })}
        </div>

        <Separator className="bg-black !h-[0.5px]" />
      </div>
    );
  };

  const renderAccordionFilters = (key: FilterKey, desktopColumns: any, mobileColumns: any, disabled = false) => {
    const col = CONFIG[key];

    const variantStyles: Record<string, string> = {
      col1: "grid-cols-1",
      col2: "grid-cols-2",
      col3: "grid-cols-3",
      col4: "grid-cols-4"
    };

    const hasDisclaimer = col.options.some(obj => 'smallText' in obj);

    return (
      <div key={key} className="min-w-0">
        <Accordion type="multiple" className="w-full">
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="font-matter-regular font-normal cursor-pointer text-xl py-[24px] bg-clip-text hover:no-underline aria-expanded:pb-[16px]">
              {col.title}
            </AccordionTrigger>
            <AccordionContent className="peer relative pb-[32px]">
              <div className={`grid gap-[16px] items-start ${hasDisclaimer ? "pb-[32px]" : ""} ${variantStyles[mobileColumns]} lg:${variantStyles[desktopColumns]}`}>
                {col.options.map((opt, index) => {
                  const checked = selected[key].includes(opt.value);

                  return (
                    <label
                      onClick={() => handleToggle(opt.smallText, key, opt.value)}
                      onMouseEnter={() => handleMouseEnter(opt.smallText, key, opt.value)}
                      onMouseLeave={() => handleMouseLeave(key, opt.value)}
                      key={index}
                      aria-disabled={disabled}
                      className={`flex-auto cursor-pointer flex-nowrap rounded-full border border-black bg-transparent px-4 py-2 text-center text-black select-none has-aria-checked:bg-[#3A3A2C] has-aria-checked:text-white ${disabled ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer lg:hover:bg-gray-200 lg:hover:border-gray-200"}`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={() => selectFilter(key, opt.value)}
                        className="invisible absolute mt-0.5"
                      />
                      {opt.icon && (
                        <Image
                          src={opt.icon}
                          width={22}
                          height={10}
                          alt="Frame shape icon"
                          className="me-[16px] inline-block pb-[4px] invert peer-data-[state=checked]:invert-0"
                          priority
                        />
                      )}
                      <span className="font-matter-regular text-[18px]">{opt.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="absolute top-[75%]">
                {col.options.map((opt, index) => {
                  return (
                    <p key={index} id={opt.value} className="text-[8px]"></p>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator className="bg-black !h-[0.5px]" />
      </div>
    );
  };

  //filter specific to age group category
  const renderAgeGroupFilters = (key: FilterKey, desktopColumns: any, mobileColumns: any) => {
    const col = CONFIG[key];

    const variantStyles: Record<string, string> = {
      col1: "grid-cols-1",
      col2: "grid-cols-2",
      col3: "grid-cols-3",
      col4: "grid-cols-4"
    };

    const hasDisclaimer = col.options.some(obj => 'smallText' in obj);

    const genderCategories = ["male", "female", "unisex"];
    const isGenderCollection = genderCategories.some(el => pathname.includes(el));
    const isTeensCategory = pathname.includes("teens");

    if (isGenderCollection || isTeensCategory) {
      return;
    } else {
      return (
        <div key={key} className="min-w-0">
          <Accordion type="multiple" className="w-full">
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="font-matter-regular font-normal cursor-pointer text-xl py-[24px] bg-clip-text hover:no-underline aria-expanded:pb-[16px]">
                {col.title}
              </AccordionTrigger>
              <AccordionContent className="relative pb-[32px]">
                <div className={`grid gap-[16px] items-start ${hasDisclaimer ? "pb-[32px]" : ""} ${variantStyles[mobileColumns]} lg:${variantStyles[desktopColumns]}`}>
                  {col.options.map((opt, index) => {
                    const checked = selected[key].includes(opt.value);

                    return (
                      <label
                        onClick={() => handleToggle(opt.smallText, key, opt.value)}
                        onMouseEnter={() => handleMouseEnter(opt.smallText, key, opt.value)}
                        onMouseLeave={() => handleMouseLeave(key, opt.value)}
                        key={index}
                        className={"flex-auto flex-nowrap cursor-pointer select-none has-[button:disabled]:bg-[#F6F6F6] has-[button:disabled]:border-[#F6F6F6] has-[button:disabled]:text-[#3A3A2C1A] text-center bg-transparent text-black py-2 px-4 border border-black rounded-full has-aria-checked:bg-[#3A3A2C] has-aria-checked:text-white lg:hover:bg-gray-200 lg:hover:border-gray-200"}
                      >
                        <Checkbox
                          disabled={!isAgeFilterEnabled(opt.value)}
                          checked={checked}
                          onCheckedChange={() => selectFilter(key, opt.value)}
                          className="mt-0.5 invisible absolute"
                        />
                        <span className="font-matter-regular text-[18px]">
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="absolute top-[75%]">
                  {col.options.map((opt, index) => {
                    return (
                      <p key={index} id={opt.value} className="text-[8px]"></p>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="bg-black !h-[0.5px]" />
        </div>
      );
    }
  };

  const isRecordEmpty = (record: SelectedFilters) => {
    const values = Object.values(record);

    if (values.length === 0) return true;

    return values.every(arr => Array.isArray(arr) && arr.length === 0);
  };

  //check for selected gender filters then apply corresponding filter
  useEffect(() => {
    const isMaleSelected = activeAgeGroup.includes("adultsM") || activeAgeGroup.includes("teensM");
    const isFemaleSelected = activeAgeGroup.includes("adultsF") || activeAgeGroup.includes("teensF");
    const isUnisexSelected = activeAgeGroup.includes("adultsU");
    const isMaleFiltered = selected.gender.includes("Male");
    const isFemaleFiltered = selected.gender.includes("Female");
    const isUnisexFiltered = selected.gender.includes("Unisex");

    if (isMaleSelected && !isMaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: [...prev["gender"], "Male"],
      }))
    } else if (!isMaleSelected && isMaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: prev["gender"].filter((v) => v !== "Male"),
      }))
    }

    if (isFemaleSelected && !isFemaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: [...prev["gender"], "Female"],
      }))
    } else if (!isFemaleSelected && isFemaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: prev["gender"].filter((v) => v !== "Female"),
      }))
    }

    if (isUnisexSelected && !isUnisexFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: [...prev["gender"], "Unisex"],
      }))
    } else if (!isUnisexSelected && isUnisexFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: prev["gender"].filter((v) => v !== "Unisex"),
      }))
    }

  }, [activeAgeGroup]);

  useEffect(() => {
    const isAdultGendersSelected = activeAgeGroup.includes("adultsM") || activeAgeGroup.includes("adultsF") || activeAgeGroup.includes("adultsU");
    const isTeenGendersSelected = activeAgeGroup.includes("teensM") || activeAgeGroup.includes("teensF");
    const isAdultFiltered = selected.ageGroup.includes("Adults");
    const isTeenFiltered = selected.ageGroup.includes("Teens (11-13)");

    if (activeAgeGroup.length == 0) {
      return
    }

    if (isAdultGendersSelected && !isAdultFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: [...prev["ageGroup"], "Adults"],
      }))
    } else if (!isAdultGendersSelected && isAdultFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: prev["ageGroup"].filter((v) => v !== "Adults"),
      }))
    }
    if (isTeenGendersSelected && !isTeenFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: [...prev["ageGroup"], "Teens (11-13)"],
      }))
    } else if (!isTeenGendersSelected && isTeenFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: prev["ageGroup"].filter((v) => v !== "Teens (11-13)"),
      }))
    }
  }, [activeAgeGroup]);

  useEffect(() => {
    const removedItems = prevItemsRef.current.filter(
      (item) => !selected.ageGroup.includes(item)
    );

    if (removedItems.length > 0) {
      if (removedItems.includes("Adults")) {
        setActiveAgeGroup((prevItems) =>
          prevItems.includes("adultsF")
            ? prevItems.filter((id) => id !== "adultsF")
            : [...prevItems]
        );
        setActiveAgeGroup((prevItems) =>
          prevItems.includes("adultsM")
            ? prevItems.filter((id) => id !== "adultsM")
            : [...prevItems]
        );
        setActiveAgeGroup((prevItems) =>
          prevItems.includes("adultsU")
            ? prevItems.filter((id) => id !== "adultsU")
            : [...prevItems]
        );
      }
      if (removedItems.includes("Teens (11-13)")) {
        setActiveAgeGroup((prevItems) =>
          prevItems.includes("teensF")
            ? prevItems.filter((id) => id !== "teensF")
            : [...prevItems]
        );
        setActiveAgeGroup((prevItems) =>
          prevItems.includes("teensM")
            ? prevItems.filter((id) => id !== "teensM")
            : [...prevItems]
        );
      }

    }

    prevItemsRef.current = selected.ageGroup;

    // if (selected.ageGroup.length = 0) {
    //   setActiveAgeGroup([]);
    // }
  }, [selected.ageGroup]);

  //check if there are filter params on load then set the corresponding filters to active
  useEffect(() => {
    const map: Record<string, string> = {
      "attributes.LENS_TYPE": "lensType",
      "attributes.GENDER": "gender",
      "attributes.AGE_GROUP": "ageGroup",
      "attributes.FRAME_MATERIAL": "frameMaterial",
      "attributes.FRONT_FRAME_COLOR": "frameColour",
      "attributes.FRAME_SHAPE": "frameShape",
      "attributes.LENS_COLOR_DESCRIPTION": "lensColour",
      "attributes.FACE_COVERAGE": "faceCoverage",
      "attributes.BRIDGE_CHOICE": "bridgeChoice"
    };

    const params = new URLSearchParams(searchParams.toString());
    if (params) {
      for (const [key, value] of params.entries()) {
        value.split(",").map((val: string, index: number) => {
          if (key === "lang" || key === "category" || key === "page") return;
          if (key in map) {
            setSelected((prev) => ({
              ...prev,
              [map[key]]: prev[map[key] as keyof SelectedFilters].includes(val) ? [...prev[map[key] as keyof SelectedFilters]] : [...prev[map[key] as keyof SelectedFilters], val],
            }))
          }
        })
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params) {
      if (params.get("attributes.AGE_GROUP")?.split(",").includes("Adults")) {
        if (params.get("attributes.GENDER")?.split(",").includes("Female")) {
          setActiveAgeGroup((prevItems) =>
            prevItems.includes("adultsF")
              ? [...prevItems]
              : [...prevItems, "adultsF"]                 // Add if missing
          );
        }
        if (params.get("attributes.GENDER")?.split(",").includes("Male")) {
          setActiveAgeGroup((prevItems) =>
            prevItems.includes("adultsM")
              ? [...prevItems]
              : [...prevItems, "adultsM"]                 // Add if missing
          );
        }
        if (params.get("attributes.GENDER")?.split(",").includes("Unisex")) {
          setActiveAgeGroup((prevItems) =>
            prevItems.includes("adultsU")
              ? [...prevItems]
              : [...prevItems, "adultsU"]                 // Add if missing
          );
        }
      }
      if (params.get("attributes.AGE_GROUP")?.split(",").includes("Teens (11-13)")) {
        if (params.get("attributes.GENDER")?.split(",").includes("Female")) {
          setActiveAgeGroup((prevItems) =>
            prevItems.includes("teensF")
              ? [...prevItems]
              : [...prevItems, "teensF"]                 // Add if missing
          );
        }
        if (params.get("attributes.GENDER")?.split(",").includes("Male")) {
          setActiveAgeGroup((prevItems) =>
            prevItems.includes("teensM")
              ? [...prevItems]
              : [...prevItems, "teensM"]                 // Add if missing
          );
        }
      }
    }
  }, []);

  //get all products
  useEffect(() => {
    fetch(`/api/fetchProducts?lang=${lang ?? "en"}&category=${category}`)
      .then((res) => res.json())
      .then((json) => {
        setAllProducts(json.data);
      })
      .catch(() => ({
        category: category,
        count: 0
      }))
  }, []);

  //count number of results when selecting filter
  useEffect(() => {
    let productsToCount = allProducts;

    let currentProductCount = 0;

    let genderSelected = selected.gender.length > 0;

    productsToCount = productsToCount?.map((data) => {
      const related = data?.content?.related_products ?? [];
      const filteredRelated = related.filter((rp: any) => {
        const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
        const lensType = String(attrs?.LENS_TYPE ?? "").toLowerCase();
        const gender = String(attrs?.GENDER ?? "").toLowerCase();
        const age = String(attrs?.AGE_GROUP ?? "").toLowerCase();
        const frameColor = String(attrs?.FRONT_FRAME_COLOR ?? "").toLowerCase();
        const frameShape = String(attrs?.FRAME_SHAPE ?? "").toLowerCase();
        const frameMaterial = String(attrs?.FRAME_MATERIAL ?? "").toLowerCase();
        const lensColor = String(attrs?.LENS_COLOR_DESCRIPTION ?? "").toLowerCase();

        const attrSet = new Set([lensType, frameShape, frameMaterial]);
        const frameColorSet = new Set([frameColor]);
        const lensColorSet = new Set([lensColor]);
        const ageGroupSet = new Set([age]);
        const genderGroupSet = new Set([gender]);

        const hasMatch = Object.values(selected).flat().some(value => attrSet.has(value.toLowerCase()));
        const frameColorMatch = Object.values(selected.frameColour).flat().some(value => frameColorSet.has(value.toLowerCase()));
        const lensColorMatch = Object.values(selected.lensColour).flat().some(value => lensColorSet.has(value.toLowerCase()));
        const ageGroupHasMatch = Object.values(selected.ageGroup).flat().some(value => ageGroupSet.has(value.toLowerCase()));
        const genderHasMatch = Object.values(selected.gender).flat().some(value => genderGroupSet.has(value.toLowerCase()));

        return hasMatch || frameColorMatch || lensColorMatch || (genderSelected ? ageGroupHasMatch && genderHasMatch : ageGroupHasMatch);
      });

      return {
        ...data,
        content: {
          ...data.content,
          related_products: filteredRelated,
        },
      };
    })?.filter((product) => product.content?.related_products?.length > 0);

    currentProductCount = productsToCount.length;
    
    setProductCounts(currentProductCount);

  }, [selected, allProducts]);

  useEffect(() => {
    setIsSelectedEmpty(isRecordEmpty(selected));
  }, [selected])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={`inline-flex items-center gap-1 px-0 lg:gap-4 ${className ?? ""}`}>
          <Image src="/icons/plus-icon.svg" alt="plus icon" width={18} height={18} />
          <div>
            <span className="font-matter-regular pt-1">{triggerLabel}</span>
            {searchParams.size !== 0 && resultsCount && resultsCount > 0 ? (
              <span className="font-matter-regular px-1 py-0.5 text-[16px] [font-variant-ligatures:none]">{`( ${resultsCount} )`}</span>
            ) : null}
          </div>
        </Button>
      </SheetTrigger>

      {/* TOP DRAWER (scrollable) */}
      <SheetContent side="right" className="h-full w-full p-0 lg:!max-w-[600px]">
        {/* Capped height + flex layout so only the middle scrolls */}
        <div className="relative -left-px mx-auto flex h-full w-full max-w-6xl flex-col">
          {/* Header (non-scroll) */}
          <div className="px-4 py-5 md:px-6">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-base md:text-lg"></SheetTitle>
            </SheetHeader>
          </div>

          <Separator className="!h-[0.5px] bg-black" />

          {/* Scroll Area (hides scrollbar) */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto px-4 pt-0 pb-6 md:px-6">
            <div className="grid grid-cols-1 gap-0">
              {!checkLensCategory() && renderFilters("lensType", "col2", "col2")}
              {renderGenderFilters("gender", "col3", "col2")}
              {!checkAgeGroup() && renderAgeGroupFilters("ageGroup", "col2", "col2")}
              {renderAccordionFilters("frameShape", "col3", "col2")}
              {renderAccordionFilters("frameMaterial", "col2", "col2")}
              {renderAccordionFilters("frameColour", "col4", "col2")}
              {renderAccordionFilters("lensColour", "col4", "col2", isEyeglassesCategory)}
              {/* {renderAccordionFilters("faceCoverage", "col3", "col2")}
              {renderCheckBoxFilters("bridgeChoice")} */}
            </div>

            {/* Spacer so last items don't feel cramped near footer */}
            <div className="h-6" />
          </div>

          <Separator className="!h-[0.5px] bg-black" />

          {/* Footer actions (sticky because it's outside scroll area) */}
          <div className="px-4 py-4 md:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                variant="link"
                className="font-matter-regular cursor-pointer text-[18px] text-black underline"
                onClick={clearAll}
              >
                Clear All
              </Button>

              <Button
                className="font-matter-regular h-[43px] w-[100%] rounded-none border border-black bg-transparent text-[18px] text-black !no-underline [font-variant-ligatures:none] hover:bg-transparent hover:no-underline lg:w-[158px]"
                disabled={productCount > 0 && !isSelectedEmpty ? false : true}
                onClick={apply}
              >
                See results {productCount > 0 && !isSelectedEmpty && <span>{`(${productCount})`}</span>}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}