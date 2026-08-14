"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORY_FILTERS, FILTER_VALUES, isCollectionFilter } from "@/constants/productPrefixQuery";

type FilterItem = {
  name: string;
  link: string;
  value: string;
};

const ButtonFilters = ({ filters, category }: { filters: FilterItem[]; category: string[] }) => {
  const searchParams = useSearchParams();

  const getCurrentActiveFilter = (): string | null => {
    for (const segment of category) {
      if (FILTER_VALUES.includes(segment as any)) {
        return segment;
      }
    }
    return null;
  };

  const buildFilterLink = (filterValue: string): string => {
    const isCollection = isCollectionFilter(filterValue);

    if (isCollection) {
      return `/products/${filterValue}`;
    }

    const currentFilter = getCurrentActiveFilter();
    let basePath: string;

    if (filterValue === "prod") {
      const baseCategory = category.filter((seg) => !FILTER_VALUES.includes(seg as any));
      basePath = `/${baseCategory.join("/")}`;
    } else if (currentFilter === filterValue) {
      const filtered = category.filter((seg) => seg !== filterValue);
      basePath = `/${filtered.join("/")}`;
    } else if (currentFilter && currentFilter !== "prod") {
      const updated = category.map((seg) => (seg === currentFilter ? filterValue : seg));
      basePath = `/${updated.join("/")}`;
    } else {
      basePath = `/${category.join("/")}/${filterValue}`;
    }

    const params = new URLSearchParams(searchParams);
    const queryString = params.toString();

    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const isFilterActive = (filterValue: string): boolean => {
    const isCollection = isCollectionFilter(filterValue);

    if (isCollection) {
      return category?.[0] === filterValue || category?.[1] === filterValue;
    }

    if (filterValue === "prod") {
      return !getCurrentActiveFilter();
    }
    return getCurrentActiveFilter() === filterValue;
  };

  return (
    <div className="flex w-full gap-10 overflow-auto px-6 py-4 lg:w-[250px] lg:flex-col lg:gap-4 lg:p-8">
      {filters.map((f, i) => {
        const isActive = isFilterActive(f.value);

        return (
          <Button
            key={f.name}
            variant={null}
            className={cn(
              "font-matter-regular h-auto w-fit cursor-pointer p-0 text-sm hover:underline lg:text-base",
              isActive && "underline",
              i === filters.length - 1 ? "pr-4" : "pr-0"
            )}
            asChild
          >
            <Link href={buildFilterLink(f.value)}>{f.name}</Link>
          </Button>
        );
      })}
    </div>
  );
};

export default ButtonFilters;
