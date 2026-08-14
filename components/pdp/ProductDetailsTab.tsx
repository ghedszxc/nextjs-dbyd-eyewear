'use client'

import {
  DETAILS_COLUMN_CLASSES,
  DETAILS_COLUMN_WITH_BORDER_CLASSES,
  DETAILS_CONTAINER_CLASSES,
  DETAILS_LABEL_CLASSES,
  DETAILS_ROW_CLASSES,
  DETAILS_VALUE_CLASSES,
  TAB_CONTENT_DETAILS_CLASSES,
} from "./constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { DetailItem } from "./useProductData";
import { useCallback, useEffect, useState } from "react";
import breakpoints from "@/constants/breakpoints";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Button } from "../ui/button";

interface ProductDetailsTabProps {
  details: DetailItem[];
  columnsPerRow?: number;
}

function groupDetailsIntoRows(details: DetailItem[], columnsPerRow: number): DetailItem[][] {
  const rows: DetailItem[][] = [];
  for (let i = 0; i < details.length; i += columnsPerRow) {
    rows.push(details.slice(i, i + columnsPerRow));
  }
  return rows;
}

const tooltipIconDark = "/icons/info-tooltip-dark.svg";
const tooltipIconLight = "/icons/info-tooltip.svg";

export function ProductDetailsTab({ details, columnsPerRow = 2 }: ProductDetailsTabProps) {
  if (!details?.length) return null;

  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { current } = useBreakpoint(breakpoints);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close tooltip when tapping outside on mobile
  useEffect(() => {
    if (!isMobile || !openTooltip) return;
    const handleOutsideClick = () => setOpenTooltip(null);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => document.removeEventListener("touchstart", handleOutsideClick);
  }, [isMobile, openTooltip]);

  const handleOpenChange = useCallback(
    (tooltipId: string, open: boolean) => {
      // On mobile, ignore Radix's hover-driven open/close — we control it via touch
      if (isMobile) return;
      setOpenTooltip(open ? tooltipId : null);
    },
    [isMobile]
  );

  const handleTouchTrigger = useCallback((e: React.TouchEvent, tooltipId: string) => {
    e.stopPropagation(); // Prevent the outside-click handler from immediately closing it
    setOpenTooltip((prev) => (prev === tooltipId ? null : tooltipId));
  }, []);


  const detailRows = groupDetailsIntoRows(details, columnsPerRow);

  return (
    <div className={TAB_CONTENT_DETAILS_CLASSES}>
      <div className={DETAILS_CONTAINER_CLASSES}>
        {detailRows.map((row, rowIndex) => (
          <div key={rowIndex} className={DETAILS_ROW_CLASSES}>
            {row.map((detail, colIndex) => {              
              const className = DETAILS_COLUMN_WITH_BORDER_CLASSES;
              const tooltipId = `${detail.label}-${rowIndex}-${colIndex}`;
              const isOpen = openTooltip === tooltipId;

              return (
                <div key={detail.label} className={className}>
                  <span className={DETAILS_LABEL_CLASSES}>{detail.label}</span>
                  <div className="flex items-center gap-2">
                    <p className={DETAILS_VALUE_CLASSES}>{detail.value}</p>
                    {detail.tooltip && (
                      <Tooltip open={isOpen} onOpenChange={(open) => handleOpenChange(tooltipId, open)}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center focus:outline-none"
                            onTouchEnd={(e) => handleTouchTrigger(e, tooltipId)}
                          >
                            <Image
                              src={isOpen ? tooltipIconDark : tooltipIconLight}
                              alt="Info"
                              width={16}
                              height={16}
                              className=""
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          align="start"
                          className="flex flex-row-reverse max-w-[181px] bg-[#3A3A2C1A] p-2 gap-2"
                          sideOffset={current === "laptop" ? -15 : 12}
                          alignOffset={current === "laptop" ? 20 : 0}
                        >
                          {current === "mobile" || current === "tablet" ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenTooltip(null);
                              }}
                              variant="ghost"
                              size="icon"
                              className="relative flex h-4 w-4 items-center justify-center focus:outline-none"
                              aria-label="Close tooltip"
                            >
                              <Image src="/icons/tooltip-close.svg" alt="Close Button" fill sizes="16px" />
                            </Button>
                          ) : null}
                          <p className="font-matter-regular text-black text-[8px] leading-[130%]">{detail.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
