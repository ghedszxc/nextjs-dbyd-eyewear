type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const LABEL_DISPLAY_MAP: Record<string, string> = {
  Male: "Men",
  Female: "Women",
  New: "New Arrivals",
  "Best Seller": "Bestsellers",
};

const getDisplayLabel = (label: string): string => {
  return LABEL_DISPLAY_MAP[label] || label;
};

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  const normalizedItems = items.filter((item) => item.label && item.label.trim() !== "Products");
  return (
    <nav aria-label="Breadcrumb" className="self-center-safe">
      <ol className="flex items-center gap-2 text-base text-[#000000]">
        {normalizedItems.map((item, index) => {
          const isLast = index === normalizedItems.length - 1;
          const displayLabel = getDisplayLabel(item.label);

          return (
            <li key={item.label} className="font-matter-regular flex items-center gap-1">
              {!isLast ? (
                <>
                  <a href={item.href} className="hover:underline">
                    {displayLabel}
                  </a>
                  <span className="text-[#000000]">/</span>
                </>
              ) : (
                <span className="font-matter-regular text-[#000000] underline">{displayLabel}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
