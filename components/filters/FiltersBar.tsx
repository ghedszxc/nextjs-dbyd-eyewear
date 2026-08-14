"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";
import TopFilters from "./TopFilters";
import Breadcrumbs from "../Breadcrumbs";
import { buildBreadcrumbs } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";

interface FiltersBarProps {
  filters: any[];
  topFilters: any[]
  category: string[];
  resultsCount: number;
  status?: string;
  errorMsg?: string;
  placeholder?: string; // product title
  onApply?: (selected: any) => void;
  triggerLabel?: string;
  lang: string | undefined;
  containerClassName?: string;
}

export const FiltersBar = forwardRef<HTMLDivElement, FiltersBarProps>(
  (
    {
      category,
      resultsCount,
      status = "idle",
      errorMsg = "",
      placeholder = "Products",
      onApply,
      triggerLabel = "Filters",
      lang,
      containerClassName,
    },
    ref
  ) => {
    const { current } = useBreakpoint(breakpoints);

    return (
      <div className={clsx(containerClassName)}>
        <div ref={ref} className="w-full items-center justify-between bg-white/75 backdrop-blur-[2px]">
          <div className="flex flex-col gap-4 px-6 py-2 lg:px-8 lg:py-4">
            <div className="flex justify-between">
              <Breadcrumbs
                items={buildBreadcrumbs({
                  lang: lang ?? "",
                  route: category,
                })}
              />
              {current === "desktop" && (
                <TopFilters
                  triggerLabel={triggerLabel}
                  resultsCount={resultsCount}
                  lang={lang}
                  category={category}
                  onApply={(selected) => {
                    console.log("APPLY FILTERS:", selected);
                    onApply?.(selected);
                  }}
                  className="font-matter-regular cursor-pointer text-base hover:bg-transparent hover:underline"
                />
              )}
            </div>

            {/* Title with Product Count */}
            <div className="flex gap-2">
              <span className="font-matter-regular m-0 text-4xl">{placeholder}</span>
              <h4>
                <sup className="font-matter-regular text-base font-normal">
                  {status === "loading" || status === "idle" ? "…" : resultsCount}
                </sup>
              </h4>
            </div>

            {/* Error Display */}
            {status === "error" ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
          </div>
        </div>
      </div>
    );
  }
);

FiltersBar.displayName = "FiltersBar";
