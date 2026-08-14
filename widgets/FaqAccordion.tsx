"use client";

import React, { useId, useEffect, useState } from "react";
import { IFaqAccordion } from "@/models/widgets/IFaqAccordion";
import { useSearch } from "@/context/SearchContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RichText from "@/components/RichText";

const FaqAccordion = ({ collectionTitle, items }: IFaqAccordion) => {
  const { isSearching, searchQuery, updateAccordionState, updateSearchResults, activeAccordionId, setActiveAccordionId } = useSearch();
  const accordionId = useId();
  const [openValue, setOpenValue] = useState("");

  if (!items || items.length === 0) return null;
  const displayItems = isSearching
    ? items.filter((item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : items;

  useEffect(() => {
    if (isSearching) {
      updateSearchResults(accordionId, displayItems.length > 0);
    } else {
      updateSearchResults(accordionId, false);
    }
  }, [isSearching, searchQuery, displayItems.length, accordionId, updateSearchResults]);

  useEffect(() => {
    if (activeAccordionId !== null && activeAccordionId !== accordionId) {
      setOpenValue("");
    }
  }, [activeAccordionId, accordionId]);
  if (isSearching && displayItems.length === 0) return null;
  return (
    <section className="bg-white px-8 lg:px-20 lg: pb-8 text-[black]">
      <div className="max-w-9xl">
        {collectionTitle && (
          <h3 className="font-matter-regular text-[30px] lg:text-[36px] pt-8 lg:py-8">
            {collectionTitle}
          </h3>
        )}

        <Accordion type="single" collapsible className="w-full" value={openValue} onValueChange={(value: string) => {
          setOpenValue(value);
          setActiveAccordionId(value ? accordionId : null);
          updateAccordionState(accordionId, value !== "");
        }}>
          {displayItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b-[0.5px] border-black last:border-b-[0.5px]"
            >
              <AccordionTrigger className="font-matter-regular font-normal cursor-pointer py-4 text-[20px] lg:text-[24px] hover:no-underline [&>svg]:text-black [&>svg]:stroke-1">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pl-4 lg:px-[40px] lg:pb-4">
                <div className="[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-4 lg:[&_li]:mb-1 [&_ul]:mt-4 lg:py-4">
                  <RichText
                    doc={{
                      type: item.answer.doc.type,
                      content: item.answer.doc.content,
                    }}
                    className={{
                      p: "font-matter-regular text-base text-[black] leading-6",
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqAccordion;
