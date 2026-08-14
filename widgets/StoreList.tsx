"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { extractCountryCode, getCountryBasedOnIP } from "@/lib/utils";
import { IStoreList } from "@/models/widgets/IStoreList";
import { useNavStore } from "@/lib/store/nav";
import { Locate, CircleX, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

type Status = "idle" | "detecting" | "ready" | "error";

const StoreList = (
  {
    suggestedText,
    storesAvailableText,
    visitStoreText,
    visitTextAccordion,
    searchPlaceholderText,
    searchArrowTextDsk,
    searchArrowTextMob,
    items
  }: IStoreList) => {

  const [status, setStatus] = useState<Status>("idle");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>("Asia");
  const [search, setSearch] = useState("");
  const regionBarRef = useRef<HTMLDivElement>(null);
  const regionTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isClickScrolling = useRef(false);
  const lastScrollY = useRef(0);
  const navHidden = useNavStore((s) => s.hidden);

  const categorized = useMemo(() => items.reduce((acc: RegionGroup[], item: any) => {
    let region = acc.find(r => r.region === item.region);
    if (!region) {
      region = { region: item.region, countries: [] };
      acc.push(region);
    }

    let country = region.countries.find(c => c.country === item.country);
    if (!country) {
      country = { country: item.country, stores: [] };
      region.countries.push(country);
    }

    country.stores.push({
      name: item.store,
      url: item.url,
      icon: { url: item.logo.url, alt: item.logo.alt },
      iconColor: item.logoColor
    });

    return acc;
  }, []), [items]);

  useEffect(() => {
    if (search) return;
    if (!categorized.length) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;
      if (!regionBarRef.current) return;

      const offset = regionBarRef.current.getBoundingClientRect().bottom;
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY >= lastScrollY.current;
      lastScrollY.current = currentScrollY;

      let activeRegion = categorized[0].region;

      if (scrollingDown) {
        for (const region of categorized) {
          const el = document.getElementById(region.region);
          if (el && el.getBoundingClientRect().top <= offset + 10) {
            activeRegion = region.region;
          }
        }
      } else {
        let found = false;
        for (const region of categorized) {
          const el = document.getElementById(region.region);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top >= offset && top <= window.innerHeight) {
            activeRegion = region.region;
            found = true;
            break;
          }
        }
        if (!found) {
          for (const region of categorized) {
            const el = document.getElementById(region.region);
            if (el && el.getBoundingClientRect().top <= offset + 10) {
              activeRegion = region.region;
            }
          }
        }
      }

      setSelectedRegion(activeRegion);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [categorized, search]);

  useEffect(() => {
    if (search) return;
    const activeIndex = categorized.findIndex(region => region.region === selectedRegion);
    const activeButton = regionTabRefs.current[activeIndex];
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedRegion, categorized, search]);

  /* Auto-detect on modal open using IP */
  useEffect(() => {

    // If already cached country code, use it
    const cached = localStorage.getItem("countryCode");
    if (cached) {
      setCountryCode(cached);
      setStatus("ready");
      return;
    }

    const detectCountry = async () => {
      try {
        setStatus("detecting");

        const code = await getCountryBasedOnIP();

        if (!code) throw new Error("No country returned");

        setCountryCode(code);
        localStorage.setItem("countryCode", code);
        setStatus("ready");
      } catch {
        setStatus("error");
        setErrorMsg("Failed to detect your country. Please select manually.");
      }
    };

    detectCountry();
  }, []);

  /* Find suggested country */
  const suggestedCountry = useMemo(() => {
    if (!countryCode) return null;

    for (const region of categorized) {
      for (const country of region.countries) {
        if (extractCountryCode(country.country) === countryCode) {
          return country;
        }
      }
    }
    return null;
  }, [countryCode]);

  const toggleRegion = (region: string) => {
    setSelectedRegion(region);

    isClickScrolling.current = true;
    const element = document.getElementById(region);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => { isClickScrolling.current = false; }, 800);
  }

  //search function 
  const handleChange = (event: any) => {
    const value = event.target.value;
    setSearch(value);
  };

  const clear = () => {
    const inputElement = document.getElementById('search') as HTMLInputElement;
    const mobileInputElement = document.getElementById('searchMobile') as HTMLInputElement; //searchMobile
    if (inputElement) {
      inputElement.value = '';
    };
    if (mobileInputElement) {
      mobileInputElement.value = '';
    };
    setSearch("");
  }

  const renderSearchResult = (items: RegionGroup[], searchTerm: string) => {
    const hasMatch = () => {
      //return items.map((region) => { region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).length === 0 })
      return items.some(region => region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())));
    }

    if (!hasMatch()) {
      return <div className="font-matter-regular text-[24px] pt-[56px] px-[24px]">No results found</div>
    } else {
      return (
        items.map((region, index) => (
          <div key={index} className="mb-[80px] lg:mb-[40px] scroll-m-[174px]" id={region.region}>
            {region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).length !== 0 &&
              <div className="font-matter-regular text-[30px] lg:text-[36px] mb-[32px]">{region.region}</div>
            }
            {region.countries.filter(country => country.country.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).map((country) => (
              <AccordionItem key={country.country} value={country.country} className="border-b-[0.5px] border-[#000000] mt-[16px]">
                <AccordionTrigger className="text-lg !text-black cursor-pointer hover:no-underline pt-[32px] pb-[32px] lg:pt-[21px] lg:pb-[21px]">
                  <div>
                    <p className="font-matter-regular text-[24px] lg:text-[20px]">{country.country.split("<")[0]}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-[24px] lg:px-[24px]">
                  <CountryCard
                    key={country.country}
                    country={country.country}
                    stores={country.stores}
                    storesAvailableText={storesAvailableText}
                    visitStoreText={visitStoreText}
                    visitTextAccordion={visitTextAccordion}
                    onSelect={() => {
                      const code = extractCountryCode(country.country);
                      if (!code) return;
                      setCountryCode(code);
                      localStorage.setItem("countryCode", code);
                      setStatus("ready");
                      setErrorMsg(null);
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        ))
      )
    }
  }

  return (
    <div className="space-y-4 lg:pb-6">
      <div className="bg-[#3A3A2C] border-t-[0.5px] border-[#FFFFFF]">
        {/* Loading / status */}
        {!countryCode && (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Locate className="h-4 w-4 animate-pulse" />
            {status === "detecting" && "Detecting your country…"}
            {status === "error" && "An error occurred"}
          </p>
        )}

        {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}

        {/* Suggested */}
        {suggestedCountry && (
          <div className="px-[24px] py-[40px] lg:mx-[80px] lg:px-0">
            <div className="flex items-center gap-2 mb-[24px] font-matter-regular text-4xl text-white font-medium">
              {suggestedText}
            </div>

            <CountryCard
              country={suggestedCountry.country}
              stores={suggestedCountry.stores}
              storesAvailableText={storesAvailableText}
              visitStoreText={visitStoreText}
              visitTextAccordion={visitTextAccordion}
              isSuggested
            />
          </div>
        )}
      </div>

      {/*Search bar*/}
      <div className="flex px-[24px] mt-6 mb-[32px] lg:mx-[80px] lg:px-0">
        {/* desktop */}
        <div className="relative flex-1 hidden lg:block">
          <input
            id="search"
            type="text"
            placeholder={searchPlaceholderText}
            className="inline px-4 py-2 border border-black rounded-full focus:outline-none w-full"
            onChange={handleChange}
          />
          {!search &&
            <div className="flex absolute top-2 right-5">
              <span className="font-matter-regular text-[16px]">{searchArrowTextDsk}</span>
              <MoveRight className="w-[20px] h-[20px] ms-[10px] mt-[4px] stroke-1" />
            </div>
          }
        </div>

        {/* mobile */}
        <div className="relative flex-1 block lg:hidden">
          <input
            id="searchMobile"
            type="text"
            placeholder=""
            className="inline px-4 py-2 border border-black rounded-full focus:outline-none w-full"
            onChange={handleChange}
          />
          {!search &&
            <div className="flex absolute top-2 left-5">
              <span className="font-matter-regular text-[18px]">{searchArrowTextMob}</span>
              <MoveRight className="w-[20px] h-[20px] ms-[10px] mt-[4px] stroke-1" />
            </div>
          }
        </div>

        {search &&
          <button onClick={() => clear()}>
            <CircleX className="w-[36px] h-[36px] ms-[24px] stroke-1" />
          </button>
        }
      </div>

      {/* Regions */}
      {!search &&
        <div
          ref={regionBarRef}
          className={clsx(
            "sticky z-1 backdrop-blur-sm transition-[top] duration-300 ease-in-out",
            navHidden ? "top-0" : "top-[80px] lg:top-[88px]"
          )}
        >
          <div className="pt-[24px] pb-[24px] mb-[24px] z-15 h-auto flex overflow-x-scroll px-[24px] gap-[24px] lg:overflow-x-auto lg:mx-[80px] lg:mb-[32px] lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categorized.map((region, index) => (
              <button
                key={index}
                ref={(el) => { regionTabRefs.current[index] = el; }}
                className={`font-matter-regular text-[16px] whitespace-nowrap h-[46px] border border-black rounded-[100px] pt-[8px] pb-[8px] ps-[32px] pe-[32px] hover:bg-[#3A3A2C1A] hover:border-0 hover:text-black lg:w-[183px] lg:text-[18px] lg:ps-[32px] lg:pe-[32px] ${region.region == selectedRegion ? "bg-[#3A3A2C] hover:bg-[#3A3A2C] text-white hover:text-white" : "bg-white text-black"}`}
                onClick={() => toggleRegion(region.region)}
              >
                {region.region}
              </button>
            ))}
          </div>
        </div>
      }

      {/* Search result */}
      {search &&
        <div className="px-[24px] pb-[80px] mt-[32px] lg:mx-[80px] lg:mt-[40px] lg:px-0">
          <Accordion type="single" collapsible className="w-full">
            {renderSearchResult(categorized, search)}
          </Accordion>
        </div>
      }

      {/* Default */}
      {!search &&
        <div className="px-[24px] pb-[80px] mt-[32px] lg:mx-[80px] lg:mt-[40px] lg:px-0">
          <Accordion type="single" collapsible className="w-full">
            {categorized.map((region, index) => (
              <div key={index} className="mb-[80px] lg:mb-[40px] scroll-m-[174px]" id={region.region}>
                <div className="font-matter-regular text-[30px] lg:text-[36px] mb-[32px]">{region.region}</div>
                {region.countries.map((country) => (
                  <AccordionItem key={country.country} value={country.country} className="border-b-[0.5px] border-[#000000] mt-[16px]">
                    <AccordionTrigger className="text-lg !text-black cursor-pointer hover:no-underline pt-[32px] pb-[32px] lg:pt-[21px] lg:pb-[21px]">
                      <div>
                        <p className="font-matter-regular text-[24px] lg:text-[20px]">{country.country.split("<")[0]}</p>
                        {/* <span className="font-matter-regular text-[12px] lg:text-[14px]">
                          {country.stores.length} {country.stores.length > 1 ? storesAvailableText.split("|")[1].toLowerCase() : storesAvailableText.split("|")[0].toLowerCase()}
                        </span> */}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-[24px] lg:px-[24px]">
                      <CountryCard
                        key={country.country}
                        country={country.country}
                        stores={country.stores}
                        storesAvailableText={storesAvailableText}
                        visitStoreText={visitStoreText}
                        visitTextAccordion={visitTextAccordion}
                        onSelect={() => {
                          const code = extractCountryCode(country.country);
                          if (!code) return;
                          setCountryCode(code);
                          localStorage.setItem("countryCode", code);
                          setStatus("ready");
                          setErrorMsg(null);
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            ))}
          </Accordion>
        </div>
      }
      {/* {!search && selectedRegion &&
        <div className="px-[24px] pb-[80px] lg:mx-[80px] lg:px-0">
          <Accordion type="single" collapsible className="w-full">
            {categorized.filter(region => region.region == selectedRegion).map((region, index) => (
              <div key={index}>
                {region.countries.map((country) => (
                  <AccordionItem key={country.country} value={country.country} className="border-b-[0.5px] border-[#DEDEDE]">
                    <AccordionTrigger className="text-lg !text-black cursor-pointer hover:no-underline pb-[24px] lg:p-[24px]">
                      <div>
                        <p className="font-matter-regular text-[16px] lg:text-[18px]">{country.country.split("<")[0]}</p>
                        <span className="font-matter-regular text-[12px] lg:text-[14px]">
                          {country.stores.length} {country.stores.length > 1 ? storesAvailableText.split("|")[1].toLowerCase() : storesAvailableText.split("|")[0].toLowerCase()}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-[24px] lg:px-[24px]">
                      <CountryCard
                        key={country.country}
                        country={country.country}
                        stores={country.stores}
                        storesAvailableText={storesAvailableText}
                        visitStoreText={visitStoreText}
                        visitTextAccordion={visitTextAccordion}
                        onSelect={() => {
                          const code = extractCountryCode(country.country);
                          if (!code) return;
                          setCountryCode(code);
                          localStorage.setItem("countryCode", code);
                          setStatus("ready");
                          setErrorMsg(null);
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            ))}
          </Accordion>
        </div>
      } */}
    </div>
  );
};

export default StoreList;

const CountryCard = (
  {
    country,
    stores,
    storesAvailableText,
    visitStoreText,
    visitTextAccordion,
    onSelect,
    isSuggested
  }:
    {
      country: string;
      stores: Store[];
      storesAvailableText: string;
      visitStoreText: string;
      visitTextAccordion: string,
      onSelect?: () => void;
      isSuggested?: boolean
    }
) => {
  return (
    <div
      className={`space-y-3 ${isSuggested ? "bg-[#3A3A2C] text-white" : "bg-white text-black"}`}
      onClick={onSelect}
    >
      {isSuggested &&
        <div className="space-y-2">
          <span className={`inline-block me-[80px] font-matter-regular text-[20px] lg:text[24px] ${isSuggested ? "text-lg" : "text-base"}`}>{country.split("<")[0]}</span>
          <span className="inline-block font-matter-regular text-[12px] lg:[24px]">
            {stores.length} {stores.length > 1 ? storesAvailableText.split("|")[1] : storesAvailableText.split("|")[0]}
          </span>
        </div>
      }

      <div className="flex flex-col gap-[16px] space-y-2 w-full lg:flex-row">
        {stores.map((store, index) => (
          <div key={index} className={`flex items-center justify-between border rounded-[8px] justify-center w-[99%] px-3 py-2 ${isSuggested ? "border-white h-[96px] lg:w-[265px] lg:h-[112px]" : "border-[#3A3A2C] bg-[#3A3A2C] h-[112px] lg:w-[296px] lg:h-[96px] text-white"}`}>
            <Button size="sm" className={`p-4 bg-transparent hover:bg-transparent`} asChild>
              <Link
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {isSuggested ?
                  <span className="me-[16px] font-matter-regular text-[12px]">{visitStoreText}</span>
                  :
                  <span className="me-[16px] font-matter-regular text-[12px]">{visitTextAccordion}</span>
                }
                {store.icon?.url ?
                  <span style={{ backgroundColor: store.iconColor }} className="px-[5px]"><Image src={store.icon?.url} alt={store.icon?.alt} width={150} height={32}   /></span>
                  :
                  <span className="font-matter-regular text-base w-[150px]">{store.name}</span>
                }
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
